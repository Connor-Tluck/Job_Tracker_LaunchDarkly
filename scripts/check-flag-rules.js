#!/usr/bin/env node

/**
 * Check which flags have targeting rules in LaunchDarkly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectKey = 'interview-import-test';
const environmentKey = 'production';

console.log('🔍 Checking flags with targeting rules in LaunchDarkly...\n');

try {
  // Get list of all flags (handle pagination)
  const flagsListResponse = JSON.parse(execSync(
    `ldcli flags list --project ${projectKey} --env ${environmentKey} -o json`,
    { encoding: 'utf-8', stdio: 'pipe' }
  ));

  const flagsList = flagsListResponse.items || flagsListResponse;
  console.log(`Found ${flagsList.length} flags total\n`);

  const flagsWithRules = [];
  const flagsWithTargets = [];
  const flagsWithBoth = [];

  for (const flag of flagsList) {
    const flagKey = flag.key || flag._key;
    
    try {
      // Get full flag details
      const flagDetails = JSON.parse(execSync(
        `ldcli flags get --flag ${flagKey} --project ${projectKey} --env ${environmentKey} -o json`,
        { encoding: 'utf-8', stdio: 'pipe' }
      ));

      const envConfig = flagDetails.environments?.[environmentKey];
      const rules = envConfig?.rules || [];
      const targets = envConfig?.targets || [];
      const contextTargets = envConfig?.contextTargets || [];
      const totalTargets = (targets?.length || 0) + (contextTargets?.length || 0);

      if (rules.length > 0 || totalTargets > 0) {
        const info = {
          key: flagKey,
          rules: rules.length,
          targets: totalTargets,
          hasRules: rules.length > 0,
          hasTargets: totalTargets > 0
        };

        if (rules.length > 0 && totalTargets > 0) {
          flagsWithBoth.push(info);
        } else if (rules.length > 0) {
          flagsWithRules.push(info);
        } else if (totalTargets > 0) {
          flagsWithTargets.push(info);
        }
      }
    } catch (error) {
      console.error(`Error checking ${flagKey}: ${error.message}`);
    }
  }

  console.log('📊 Summary:');
  console.log(`   Flags with rules only: ${flagsWithRules.length}`);
  console.log(`   Flags with targets only: ${flagsWithTargets.length}`);
  console.log(`   Flags with both rules and targets: ${flagsWithBoth.length}`);
  console.log(`   Total flags with targeting: ${flagsWithRules.length + flagsWithTargets.length + flagsWithBoth.length}\n`);

  if (flagsWithRules.length > 0) {
    console.log('Flags with rules only:');
    flagsWithRules.forEach(f => console.log(`   - ${f.key}: ${f.rules} rules`));
    console.log('');
  }

  if (flagsWithTargets.length > 0) {
    console.log('Flags with targets only:');
    flagsWithTargets.forEach(f => console.log(`   - ${f.key}: ${f.targets} targets`));
    console.log('');
  }

  if (flagsWithBoth.length > 0) {
    console.log('Flags with both rules and targets:');
    flagsWithBoth.forEach(f => console.log(`   - ${f.key}: ${f.rules} rules, ${f.targets} targets`));
    console.log('');
  }

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}

