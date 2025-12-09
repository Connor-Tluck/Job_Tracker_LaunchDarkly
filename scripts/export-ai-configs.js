#!/usr/bin/env node

/**
 * Export all AI Configs from a LaunchDarkly project
 * 
 * This script exports AI Configs including their variations and targeting rules
 * 
 * Usage:
 *   node scripts/export-ai-configs.js --project PROJECT_KEY [--output OUTPUT_FILE]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let projectKey = null;
let outputFile = 'launchdarkly-ai-configs-export.json';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--project' && args[i + 1]) {
    projectKey = args[i + 1];
    i++;
  } else if (args[i] === '--output' && args[i + 1]) {
    outputFile = args[i + 1];
    i++;
  }
}

if (!projectKey) {
  console.error('❌ Error: --project is required');
  console.error('Usage: node scripts/export-ai-configs.js --project PROJECT_KEY [--output OUTPUT_FILE]');
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

console.log('🚀 Exporting AI Configs from LaunchDarkly...');
console.log(`📁 Project: ${projectKey}\n`);

const exportData = {
  exportedAt: new Date().toISOString(),
  project: projectKey,
  aiConfigs: []
};

try {
  // Get list of all AI Configs
  const listResponse = JSON.parse(execSync(
    `ldcli ai-configs-beta list-ai-configs --project ${projectKey} -o json`,
    { encoding: 'utf-8', stdio: 'pipe' }
  ));

  const aiConfigs = listResponse.items || [];
  console.log(`Found ${aiConfigs.length} AI Config(s) to export\n`);

  for (let i = 0; i < aiConfigs.length; i++) {
    const aiConfig = aiConfigs[i];
    const configKey = aiConfig.key;

    console.log(`⏳ Exporting AI Config ${i + 1}/${aiConfigs.length}: ${configKey}...`);

    try {
      // Get full AI Config details
      const configDetails = JSON.parse(execSync(
        `ldcli ai-configs-beta get-ai-config --project ${projectKey} --config ${configKey} -o json`,
        { encoding: 'utf-8', stdio: 'pipe' }
      ));

      // Get targeting configuration
      let targeting = null;
      try {
        targeting = JSON.parse(execSync(
          `ldcli ai-configs-beta get-ai-config-targeting --project ${projectKey} --config ${configKey} -o json`,
          { encoding: 'utf-8', stdio: 'pipe' }
        ));
      } catch (error) {
        console.log(`   ⚠️  Could not export targeting for ${configKey}: ${error.message}`);
      }

      // Extract relevant information
      const exportedConfig = {
        key: configDetails.key,
        name: configDetails.name,
        description: configDetails.description || '',
        mode: configDetails.mode,
        tags: configDetails.tags || [],
        variations: configDetails.variations.map(variation => ({
          key: variation.key,
          name: variation.name,
          messages: variation.messages || [],
          model: variation.model || {},
          modelConfigKey: variation.modelConfigKey,
          state: variation.state
        })),
        targeting: targeting
      };

      exportData.aiConfigs.push(exportedConfig);
      console.log(`   ✅ Exported: ${configKey} (${exportedConfig.variations.length} variations)`);
    } catch (error) {
      console.error(`   ❌ Failed to export ${configKey}: ${error.message}`);
    }
  }

  // Write export file
  const outputPath = path.isAbsolute(outputFile) 
    ? outputFile 
    : path.join(__dirname, '..', outputFile);

  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
  
  console.log(`\n✅ Export complete!`);
  console.log(`📝 Saved to: ${outputPath}`);
  console.log(`📊 Total AI Configs exported: ${exportData.aiConfigs.length}`);

} catch (error) {
  console.error('❌ Error during export:', error.message);
  process.exit(1);
}

