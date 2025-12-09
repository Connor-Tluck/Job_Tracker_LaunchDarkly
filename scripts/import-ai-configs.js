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

      // Step 3: Note about targeting
      // Note: Targeting configuration requires semantic patches which is complex to automate.
      // Targeting rules should be configured manually in the LaunchDarkly dashboard.
      // The export file contains targeting information for reference.
      if (aiConfig.targeting && aiConfig.targeting.environments) {
        const envTargeting = aiConfig.targeting.environments[environmentKey];
        if (envTargeting && (envTargeting.targets?.length > 0 || envTargeting.contextTargets?.length > 0 || envTargeting.rules?.length > 0)) {
          console.log(`   ℹ️  Targeting rules found in export - configure manually in LaunchDarkly dashboard`);
          console.log(`      Expected targeting: ${envTargeting.targets?.length || 0} targets, ${envTargeting.contextTargets?.length || 0} context targets, ${envTargeting.rules?.length || 0} rules`);
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

