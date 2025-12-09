#!/usr/bin/env node

/**
 * Export all LaunchDarkly flags with their targeting rules and configurations
 * 
 * This script uses the LaunchDarkly CLI to export all flags from a project,
 * including their targeting rules, individual targeting, and experiment configurations.
 * 
 * Usage:
 *   node scripts/export-flags-with-targeting.js --project YOUR_PROJECT_KEY [--environment ENV_KEY] [--output OUTPUT_FILE]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let projectKey = null;
let environmentKey = 'production'; // Default to production
let outputFile = 'launchdarkly-flags-export.json';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--project' && args[i + 1]) {
    projectKey = args[i + 1];
    i++;
  } else if (args[i] === '--environment' && args[i + 1]) {
    environmentKey = args[i + 1];
    i++;
  } else if (args[i] === '--output' && args[i + 1]) {
    outputFile = args[i + 1];
    i++;
  }
}

if (!projectKey) {
  console.error('❌ Error: --project is required');
  console.error('Usage: node scripts/export-flags-with-targeting.js --project PROJECT_KEY [--environment ENV_KEY] [--output OUTPUT_FILE]');
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

console.log('🚀 Exporting flags from LaunchDarkly...');
console.log(`📁 Project: ${projectKey}`);
console.log(`🌍 Environment: ${environmentKey}`);
console.log(`📄 Output file: ${outputFile}\n`);

// Helper function to sleep/delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Export flags with targeting information
(async () => {
  try {
    // Step 1: Get list of all flags (handle pagination)
    console.log('📋 Fetching list of all flags...');
    let allFlags = [];
    let limit = 20;
    let offset = 0;
    let hasMore = true;
    
    while (hasMore) {
      const listCmd = `ldcli flags list --project ${projectKey} --env ${environmentKey} --limit ${limit} --offset ${offset} -o json`;
      const listOutput = execSync(listCmd, { encoding: 'utf-8', stdio: 'pipe' });
      const flagsList = JSON.parse(listOutput);
      
      const pageFlags = flagsList.items || [];
      allFlags = allFlags.concat(pageFlags);
      
      // Check if there are more pages
      const totalCount = flagsList.totalCount || 0;
      hasMore = allFlags.length < totalCount;
      offset += limit;
      
      console.log(`   Fetched ${allFlags.length} of ${totalCount} flags...`);
    }
    
    const flags = allFlags;
    console.log(`✅ Found ${flags.length} flags total\n`);

    // Step 2: Get detailed information for each flag including targeting
    const exportedFlags = [];
    
    for (let i = 0; i < flags.length; i++) {
      const flag = flags[i];
      const flagKey = flag.key || flag._key;
      
      console.log(`⏳ Exporting flag ${i + 1}/${flags.length}: ${flagKey}...`);
      
      try {
        // Get full flag details including targeting rules
        const getCmd = `ldcli flags get --flag ${flagKey} --project ${projectKey} --env ${environmentKey} -o json`;
        const flagDetails = execSync(getCmd, { encoding: 'utf-8', stdio: 'pipe' });
        const flagData = JSON.parse(flagDetails);
        
        // Extract relevant information
        const exportedFlag = {
          key: flagData.key,
          name: flagData.name,
          description: flagData.description,
          kind: flagData.kind,
          variations: flagData.variations,
          temporary: flagData.temporary,
          tags: flagData.tags || [],
          environments: {}
        };
        
        // Extract environment-specific targeting information
        if (flagData.environments && flagData.environments[environmentKey]) {
          const envConfig = flagData.environments[environmentKey];
          
          exportedFlag.environments[environmentKey] = {
            on: envConfig.on || false,
            archived: envConfig.archived || false,
            salt: envConfig.salt,
            sel: envConfig.sel,
            lastModified: envConfig.lastModified,
            version: envConfig._version,
            
            // Individual targeting
            targets: envConfig.targets || [],
            
            // Rule-based targeting
            rules: envConfig.rules || [],
            
            // Fallthrough variation
            fallthrough: envConfig.fallthrough || null,
            
            // Off variation
            offVariation: envConfig.offVariation,
            
            // Prerequisites (if any)
            prerequisites: envConfig.prerequisites || [],
            
            // Experiment information (if flag is used in experiments)
            hasExperiment: flagData.hasExperiment || false
          };
        }
        
        exportedFlags.push(exportedFlag);
        console.log(`   ✅ Exported targeting rules: ${(exportedFlag.environments[environmentKey]?.targets?.length || 0)} individual targets, ${(exportedFlag.environments[environmentKey]?.rules?.length || 0)} targeting rules`);
        
        // Add delay to avoid rate limiting
        if (i < flags.length - 1) {
          await sleep(500); // 500ms delay between requests
        }
      } catch (error) {
        const errorMsg = error.message || error.toString();
        console.error(`   ❌ Failed to export ${flagKey}: ${errorMsg}`);
        
        // Still add basic flag info even if detailed export fails
        exportedFlags.push({
          key: flagKey,
          name: flag.name || flag._name,
          error: errorMsg
        });
      }
    }
    
    // Step 3: Create export report
    const exportReport = {
      exportedAt: new Date().toISOString(),
      project: projectKey,
      environment: environmentKey,
      totalFlags: flags.length,
      successfullyExported: exportedFlags.filter(f => !f.error).length,
      failedExports: exportedFlags.filter(f => f.error).length,
      flags: exportedFlags
    };
    
    // Step 4: Write to file
    const outputPath = path.join(__dirname, '..', outputFile);
    fs.writeFileSync(outputPath, JSON.stringify(exportReport, null, 2));
    
    console.log('\n✨ Export complete!');
    console.log(`✅ Successfully exported: ${exportReport.successfullyExported} flags`);
    if (exportReport.failedExports > 0) {
      console.log(`⚠️  Failed exports: ${exportReport.failedExports} flags`);
    }
    console.log(`📄 Export saved to: ${outputPath}`);
    
    // Print summary statistics
    console.log('\n📊 Summary Statistics:');
    const flagsWithTargeting = exportedFlags.filter(f => 
      !f.error && 
      f.environments[environmentKey] && 
      (f.environments[environmentKey].targets?.length > 0 || f.environments[environmentKey].rules?.length > 0)
    );
    console.log(`   Flags with targeting rules: ${flagsWithTargeting.length}`);
    
    const flagsWithIndividualTargeting = exportedFlags.filter(f => 
      !f.error && 
      f.environments[environmentKey]?.targets?.length > 0
    );
    console.log(`   Flags with individual targeting: ${flagsWithIndividualTargeting.length}`);
    
    const flagsWithRuleBasedTargeting = exportedFlags.filter(f => 
      !f.error && 
      f.environments[environmentKey]?.rules?.length > 0
    );
    console.log(`   Flags with rule-based targeting: ${flagsWithRuleBasedTargeting.length}`);
    
    const flagsWithExperiments = exportedFlags.filter(f => 
      !f.error && 
      f.environments[environmentKey]?.hasExperiment
    );
    console.log(`   Flags used in experiments: ${flagsWithExperiments.length}`);
    
  } catch (error) {
    console.error('❌ Error during export:', error.message);
    process.exit(1);
  }
})();

