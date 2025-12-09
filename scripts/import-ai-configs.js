#!/usr/bin/env node

/**
 * Import AI Configs to a LaunchDarkly project
 * 
 * This script imports AI Configs including their variations and targeting rules
 * 
 * Usage:
 *   node scripts/import-ai-configs.js --project PROJECT_KEY --export-file EXPORT_FILE.json [--environment ENV_KEY]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Parse command line arguments
const args = process.argv.slice(2);
let projectKey = null;
let exportFile = null;
let environmentKey = 'production';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--project' && args[i + 1]) {
    projectKey = args[i + 1];
    i++;
  } else if (args[i] === '--export-file' && args[i + 1]) {
    exportFile = args[i + 1];
    i++;
  } else if (args[i] === '--environment' && args[i + 1]) {
    environmentKey = args[i + 1];
    i++;
  }
}

if (!projectKey || !exportFile) {
  console.error('❌ Error: --project and --export-file are required');
  console.error('Usage: node scripts/import-ai-configs.js --project PROJECT_KEY --export-file EXPORT_FILE.json [--environment ENV_KEY]');
  process.exit(1);
}

// Check if ldcli is installed
try {
  execSync('ldcli --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Error: LaunchDarkly CLI (ldcli) is not installed');
  console.error('Install it from: https://docs.launchdarkly.com/home/getting-started/ldcli-commands');
  process.exit(1);
}

// Load export file
const exportPath = path.isAbsolute(exportFile) 
  ? exportFile 
  : path.join(__dirname, '..', exportFile);

if (!fs.existsSync(exportPath)) {
  console.error(`❌ Error: Export file not found: ${exportPath}`);
  process.exit(1);
}

let exportData;
try {
  exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
} catch (error) {
  console.error(`❌ Error reading export file: ${error.message}`);
  process.exit(1);
}

console.log('🚀 Importing AI Configs to LaunchDarkly...');
console.log(`📁 Project: ${projectKey}`);
console.log(`🌍 Environment: ${environmentKey}`);
console.log(`📊 Found ${exportData.aiConfigs?.length || 0} AI Config(s) to import\n`);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let createdCount = 0;
let skippedCount = 0;
let failedCount = 0;
const failedConfigs = [];

(async () => {
  for (let i = 0; i < exportData.aiConfigs.length; i++) {
    const aiConfig = exportData.aiConfigs[i];
    const configKey = aiConfig.key;

    console.log(`⏳ Importing AI Config ${i + 1}/${exportData.aiConfigs.length}: ${configKey}...`);

    try {
      // Step 1: Create AI Config
      const createPayload = {
        key: aiConfig.key,
        name: aiConfig.name,
        description: aiConfig.description || '',
        mode: aiConfig.mode || 'completion',
        tags: aiConfig.tags || []
      };

      let configExists = false;
      try {
        // Check if config already exists
        execSync(
          `ldcli ai-configs-beta get-ai-config --project ${projectKey} --config ${configKey} -o json`,
          { encoding: 'utf-8', stdio: 'pipe' }
        );
        configExists = true;
        console.log(`   ⚠️  AI Config ${configKey} already exists (skipping creation)`);
        skippedCount++;
      } catch (error) {
        // Config doesn't exist, create it
        const createJson = JSON.stringify(createPayload).replace(/"/g, '\\"');
        execSync(
          `ldcli ai-configs-beta create-ai-config --project ${projectKey} -d "${createJson}"`,
          { stdio: 'pipe', shell: true }
        );
        console.log(`   ✅ Created AI Config: ${configKey}`);
        createdCount++;
        await sleep(1500); // Rate limiting
      }

      // Step 2: Create variations in order
      // Note: LaunchDarkly creates a "disabled" variation automatically (index 0)
      // Our variations will be at indices 1, 2, etc.
      for (let j = 0; j < aiConfig.variations.length; j++) {
        const variation = aiConfig.variations[j];
        const variationKey = variation.key;

        try {
          // Try to get existing variation to check if it exists
          let variationExists = false;
          try {
            execSync(
              `ldcli ai-configs-beta list-ai-config-variation --project ${projectKey} --config ${configKey} --variation ${variationKey} -o json`,
              { encoding: 'utf-8', stdio: 'pipe' }
            );
            variationExists = true;
            console.log(`   ⚠️  Variation ${variationKey} already exists (skipping)`);
          } catch (checkError) {
            // Variation doesn't exist, create it
            const variationPayload = {
              key: variation.key,
              name: variation.name,
              messages: variation.messages || [],
              modelConfigKey: variation.modelConfigKey,
              model: variation.model || {}
            };

            const variationJson = JSON.stringify(variationPayload).replace(/"/g, '\\"');
            execSync(
              `ldcli ai-configs-beta create-ai-config-variation --project ${projectKey} --config ${configKey} -d "${variationJson}"`,
              { stdio: 'pipe', shell: true }
            );
            console.log(`   ✅ Created variation: ${variationKey} (${variation.name})`);
            await sleep(1500); // Rate limiting
          }
        } catch (error) {
          console.log(`   ⚠️  Could not create variation ${variationKey}: ${error.message}`);
        }
      }

      // Step 3: Apply targeting configuration
      if (aiConfig.targeting && aiConfig.targeting.environments) {
        const envTargeting = aiConfig.targeting.environments[environmentKey];
        if (envTargeting) {
          try {
            // Get current AI Config to get variation IDs for semantic patches
            const currentConfig = JSON.parse(execSync(
              `ldcli ai-configs-beta get-ai-config --project ${projectKey} --config ${configKey} -o json`,
              { encoding: 'utf-8', stdio: 'pipe' }
            ));

            // Get current targeting to see variation structure
            let currentTargeting;
            try {
              currentTargeting = JSON.parse(execSync(
                `ldcli ai-configs-beta get-ai-config-targeting --project ${projectKey} --config ${configKey} -o json`,
                { encoding: 'utf-8', stdio: 'pipe' }
              ));
            } catch (error) {
              // Targeting might not exist yet, that's okay
              currentTargeting = { environments: {} };
            }

            // Map variation keys to indices
            // LaunchDarkly creates a "disabled" variation at index 0 automatically
            // Our variations start at index 1
            const variationKeyToIndex = {};
            variationKeyToIndex['disabled'] = 0;
            aiConfig.variations.forEach((v, idx) => {
              variationKeyToIndex[v.key] = idx + 1; // +1 because disabled is at 0
            });

            // Get variation IDs from current targeting
            // Variation IDs are in the targeting.variations array
            // Note: LaunchDarkly creates a "disabled" variation at index 0 automatically
            // Our variations will be at indices 1, 2, etc.
            const variationIndexToId = {};
            
            // Wait a moment for LaunchDarkly to initialize targeting structure
            await sleep(1000);
            
            // Try to get targeting structure (may need retries)
            let retries = 3;
            let gotTargeting = false;
            while (retries > 0 && !gotTargeting) {
              try {
                currentTargeting = JSON.parse(execSync(
                  `ldcli ai-configs-beta get-ai-config-targeting --project ${projectKey} --config ${configKey} -o json`,
                  { encoding: 'utf-8', stdio: 'pipe' }
                ));
                
                if (currentTargeting.variations && currentTargeting.variations.length > 0) {
                  // Map variation indices to IDs
                  // Index 0 = disabled (auto-created)
                  // Index 1 = first variation (standard)
                  // Index 2 = second variation (combative)
                  currentTargeting.variations.forEach((v, idx) => {
                    variationIndexToId[idx] = v._id;
                  });
                  gotTargeting = true;
                } else {
                  retries--;
                  if (retries > 0) {
                    await sleep(2000);
                  }
                }
              } catch (error) {
                retries--;
                if (retries > 0) {
                  await sleep(2000);
                } else {
                  console.log(`   ⚠️  Could not get targeting structure: ${error.message}`);
                  console.log(`   ℹ️  Targeting will need to be configured manually`);
                  throw error;
                }
              }
            }
            
            if (!gotTargeting || Object.keys(variationIndexToId).length === 0) {
              console.log(`   ⚠️  Could not map variation IDs`);
              console.log(`   ℹ️  Targeting will need to be configured manually`);
              return;
            }
            
            console.log(`   📋 Mapped ${Object.keys(variationIndexToId).length} variation IDs for targeting`);

            // Build semantic patch instructions
            const instructions = [];

            // Note: AI Config enabled state might be controlled differently
            // We'll focus on fallthrough, offVariation, and targets which are the core targeting settings

            // 1. Set fallthrough variation
            if (envTargeting.fallthrough && envTargeting.fallthrough.variation !== undefined) {
              const fallthroughVariationIndex = envTargeting.fallthrough.variation;
              const fallthroughVariationId = variationIndexToId[fallthroughVariationIndex];
              if (fallthroughVariationId) {
                instructions.push({
                  kind: 'updateFallthroughVariationOrRollout',
                  variationId: fallthroughVariationId
                });
              }
            }

            // 3. Set off variation
            if (envTargeting.offVariation !== undefined) {
              const offVariationIndex = envTargeting.offVariation;
              const offVariationId = variationIndexToId[offVariationIndex];
              if (offVariationId) {
                instructions.push({
                  kind: 'updateOffVariation',
                  variationId: offVariationId
                });
              }
            }

            // 4. Replace all targets (simpler than adding individually)
            // Combine targets and contextTargets
            const allTargets = [];
            if (envTargeting.targets && envTargeting.targets.length > 0) {
              envTargeting.targets.forEach(target => {
                const variationIndex = target.variation;
                const variationId = variationIndexToId[variationIndex];
                if (variationId) {
                  allTargets.push({
                    contextKind: target.contextKind,
                    variationId: variationId,
                    values: target.values
                  });
                }
              });
            }
            
            // Use replaceTargets to set all targets at once
            if (allTargets.length > 0) {
              instructions.push({
                kind: 'replaceTargets',
                targets: allTargets
              });
            }

            // Apply semantic patch if we have instructions
            if (instructions.length > 0) {
              const semanticPatch = {
                environmentKey: environmentKey,
                instructions: instructions
              };

              // Try using REST API directly with proper semantic patch headers
              // CLI doesn't properly handle semantic patch Content-Type headers
              let patchSuccess = false;
              
              try {
                // Get access token from environment or CLI config file
                let accessToken = null;
                
                // Try environment variables first
                accessToken = process.env.LD_ACCESS_TOKEN || process.env.LAUNCHDARKLY_ACCESS_TOKEN;
                
                // If not in env, try to read from CLI config file
                if (!accessToken) {
                  const os = require('os');
                  const homedir = os.homedir();
                  const configPaths = [
                    path.join(homedir, '.ldcli', 'config.yml'),
                    path.join(homedir, '.config', 'ldcli', 'config.yaml'),
                    path.join(homedir, '.ldcli', 'config.yaml'),
                    path.join(homedir, '.ldcli.yaml')
                  ];
                  
                  for (const configPath of configPaths) {
                    if (fs.existsSync(configPath)) {
                      try {
                        const configContent = fs.readFileSync(configPath, 'utf8');
                        // Try to extract access-token from YAML (handles both YAML formats)
                        const tokenMatch = configContent.match(/access-token:\s*(.+)/) || 
                                          configContent.match(/accessToken:\s*(.+)/) ||
                                          configContent.match(/access_token:\s*(.+)/);
                        if (tokenMatch) {
                          accessToken = tokenMatch[1].trim().replace(/^["']|["']$/g, ''); // Remove quotes if present
                          break;
                        }
                      } catch (e) {
                        // Continue to next path
                      }
                    }
                  }
                }
                
                if (accessToken) {
                  // Use REST API directly with proper semantic patch headers
                  const apiUrl = `https://app.launchdarkly.com/api/v2/projects/${projectKey}/ai-configs/${configKey}/targeting`;
                  const patchData = JSON.stringify(semanticPatch);
                  
                  const url = new URL(apiUrl);
                  const options = {
                    hostname: url.hostname,
                    path: url.pathname,
                    method: 'PATCH',
                    headers: {
                      'Authorization': accessToken.startsWith('api-') ? accessToken : `api-${accessToken}`,
                      'Content-Type': 'application/json; domain-model=launchdarkly.semanticpatch',
                      'LD-API-Version': 'beta',
                      'Content-Length': Buffer.byteLength(patchData)
                    }
                  };
                  
                  await new Promise((resolve, reject) => {
                    const req = https.request(options, (res) => {
                      let data = '';
                      res.on('data', (chunk) => { data += chunk; });
                      res.on('end', () => {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                          console.log(`   ✅ Applied targeting configuration via REST API (${instructions.length} instruction(s))`);
                          patchSuccess = true;
                          resolve();
                        } else {
                          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                        }
                      });
                    });
                    
                    req.on('error', reject);
                    req.write(patchData);
                    req.end();
                  });
                  
                  await sleep(2000); // Rate limiting
                } else {
                  throw new Error('No access token available');
                }
              } catch (apiError) {
                // Fallback: Try CLI (might work in some cases)
                try {
                  const patchJson = JSON.stringify(semanticPatch).replace(/"/g, '\\"');
                  execSync(
                    `ldcli ai-configs-beta update-ai-config-targeting --project ${projectKey} --config ${configKey} -d "${patchJson}"`,
                    { stdio: 'pipe', shell: true }
                  );
                  console.log(`   ✅ Applied targeting configuration via CLI (${instructions.length} instruction(s))`);
                  patchSuccess = true;
                  await sleep(2000);
                } catch (patchError) {
                  // Both methods failed - provide detailed instructions
                  console.log(`   ⚠️  Could not apply targeting automatically (CLI limitation)`);
                  console.log(`   📋 Targeting configuration needed:`);
                  console.log(`      - Fallthrough variation: Index ${envTargeting.fallthrough?.variation || 'N/A'} (${variationIndexToId[envTargeting.fallthrough?.variation] ? 'ID: ' + variationIndexToId[envTargeting.fallthrough?.variation] : 'N/A'})`);
                  console.log(`      - Off variation: Index ${envTargeting.offVariation !== undefined ? envTargeting.offVariation : 'N/A'} (${variationIndexToId[envTargeting.offVariation] ? 'ID: ' + variationIndexToId[envTargeting.offVariation] : 'N/A'})`);
                  if (envTargeting.targets && envTargeting.targets.length > 0) {
                    envTargeting.targets.forEach(target => {
                      const varId = variationIndexToId[target.variation];
                      console.log(`      - Target: ${target.values.join(', ')} → Variation ${target.variation} (ID: ${varId || 'N/A'})`);
                    });
                  }
                  console.log(`   💡 Configure targeting manually in LaunchDarkly dashboard:`);
                  console.log(`      https://app.launchdarkly.com/${projectKey}/production/ai-configs/${configKey}/targeting`);
                }
              }
            } else {
              console.log(`   ℹ️  No targeting instructions to apply`);
            }

          } catch (error) {
            const errorMsg = error.message || error.toString();
            console.log(`   ⚠️  Could not apply targeting: ${errorMsg}`);
            console.log(`   ℹ️  Targeting information available in export file for manual configuration`);
          }
        }
      }

      console.log(`   ✨ Completed: ${configKey}\n`);

    } catch (error) {
      const errorMsg = error.message || error.toString();
      console.error(`   ❌ Failed: ${configKey} - ${errorMsg}`);
      failedConfigs.push({ key: configKey, error: errorMsg });
      failedCount++;
    }
  }

  console.log('\n✨ Import complete!');
  console.log(`✅ Created: ${createdCount} AI Config(s)`);
  console.log(`⚠️  Skipped (already exists): ${skippedCount} AI Config(s)`);
  if (failedCount > 0) {
    console.log(`❌ Failed: ${failedCount} AI Config(s)`);
    failedConfigs.forEach(f => console.log(`   - ${f.key}: ${f.error}`));
  }
})();

