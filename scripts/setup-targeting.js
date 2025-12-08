#!/usr/bin/env node

/**
 * Set up targeting rules for feature flags
 * 
 * This script configures targeting rules for the show-premium-feature-demo flag:
 * - Individual targeting: user-001 (Beta Tester) → ON, user-002 (Premium User) → ON
 * - Rule-based targeting: subscriptionTier = "premium" → ON, betaTester = true → ON, role = "beta-tester" → ON
 * - Default: OFF
 * 
 * Usage:
 *   node scripts/setup-targeting.js --project PROJECT_KEY --environment ENVIRONMENT_KEY
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let projectKey = null;
let environmentKey = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--project' && args[i + 1]) {
    projectKey = args[i + 1];
    i++;
  } else if (args[i] === '--environment' && args[i + 1]) {
    environmentKey = args[i + 1];
    i++;
  }
}

if (!projectKey || !environmentKey) {
  console.error('❌ Error: --project and --environment are required');
  console.error('Usage: node scripts/setup-targeting.js --project PROJECT_KEY --environment ENVIRONMENT_KEY');
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

const FLAG_KEY = 'show-premium-feature-demo';

console.log('🎯 Setting up targeting rules for LaunchDarkly flags...');
console.log(`📁 Project: ${projectKey}`);
console.log(`🌍 Environment: ${environmentKey}`);
console.log(`🚩 Flag: ${FLAG_KEY}\n`);

// Helper function to sleep/delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  try {
    // Step 1: Set default to OFF (variation 1 = false)
    console.log('📝 Step 1: Setting default variation to OFF...');
    try {
      execSync(
        `ldcli flags update ${FLAG_KEY} --project ${projectKey} --environment ${environmentKey} --default-off-variation 1`,
        { stdio: 'pipe' }
      );
      console.log('✅ Default set to OFF\n');
    } catch (error) {
      console.log('⚠️  Could not set default (flag may not exist yet or already configured)\n');
    }

    await sleep(1000);

    // Step 2: Add individual targeting for Beta Tester (user-001) → ON
    console.log('📝 Step 2: Adding individual targeting for Beta Tester (user-001)...');
    try {
      execSync(
        `ldcli flags targets add ${FLAG_KEY} --project ${projectKey} --environment ${environmentKey} --user-key user-001 --variation 0`,
        { stdio: 'pipe' }
      );
      console.log('✅ Beta Tester (user-001) → ON\n');
    } catch (error) {
      const errorMsg = error.message || error.toString();
      if (errorMsg.includes('already') || errorMsg.includes('409')) {
        console.log('⚠️  Beta Tester targeting already exists (skipping)\n');
      } else {
        console.error(`❌ Failed to add Beta Tester targeting: ${errorMsg}\n`);
      }
    }

    await sleep(1000);

    // Step 3: Add individual targeting for Premium User (user-002) → ON
    console.log('📝 Step 3: Adding individual targeting for Premium User (user-002)...');
    try {
      execSync(
        `ldcli flags targets add ${FLAG_KEY} --project ${projectKey} --environment ${environmentKey} --user-key user-002 --variation 0`,
        { stdio: 'pipe' }
      );
      console.log('✅ Premium User (user-002) → ON\n');
    } catch (error) {
      const errorMsg = error.message || error.toString();
      if (errorMsg.includes('already') || errorMsg.includes('409')) {
        console.log('⚠️  Premium User targeting already exists (skipping)\n');
      } else {
        console.error(`❌ Failed to add Premium User targeting: ${errorMsg}\n`);
      }
    }

    await sleep(1000);

    // Step 4: Add rule-based targeting - subscriptionTier = "premium" → ON
    console.log('📝 Step 4: Adding rule: subscriptionTier = "premium" → ON...');
    try {
      const rule1 = {
        clauses: [{
          attribute: 'subscriptionTier',
          op: 'in',
          values: ['premium']
        }],
        variation: 0
      };
      const ruleJson = JSON.stringify(rule1).replace(/"/g, '\\"');
      execSync(
        `ldcli flags rules add ${FLAG_KEY} --project ${projectKey} --environment ${environmentKey} -d "${ruleJson}"`,
        { stdio: 'pipe', shell: true }
      );
      console.log('✅ Rule added: subscriptionTier = "premium" → ON\n');
    } catch (error) {
      const errorMsg = error.message || error.toString();
      if (errorMsg.includes('already') || errorMsg.includes('409')) {
        console.log('⚠️  Rule already exists (skipping)\n');
      } else {
        console.error(`❌ Failed to add rule: ${errorMsg}\n`);
        console.error('   Note: You may need to configure this rule manually in the LaunchDarkly dashboard\n');
      }
    }

    await sleep(1000);

    // Step 5: Add rule-based targeting - betaTester = true → ON
    console.log('📝 Step 5: Adding rule: betaTester = true → ON...');
    try {
      const rule2 = {
        clauses: [{
          attribute: 'betaTester',
          op: 'in',
          values: [true]
        }],
        variation: 0
      };
      const ruleJson = JSON.stringify(rule2).replace(/"/g, '\\"');
      execSync(
        `ldcli flags rules add ${FLAG_KEY} --project ${projectKey} --environment ${environmentKey} -d "${ruleJson}"`,
        { stdio: 'pipe', shell: true }
      );
      console.log('✅ Rule added: betaTester = true → ON\n');
    } catch (error) {
      const errorMsg = error.message || error.toString();
      if (errorMsg.includes('already') || errorMsg.includes('409')) {
        console.log('⚠️  Rule already exists (skipping)\n');
      } else {
        console.error(`❌ Failed to add rule: ${errorMsg}\n`);
        console.error('   Note: You may need to configure this rule manually in the LaunchDarkly dashboard\n');
      }
    }

    await sleep(1000);

    // Step 6: Add rule-based targeting - role = "beta-tester" → ON
    console.log('📝 Step 6: Adding rule: role = "beta-tester" → ON...');
    try {
      const rule3 = {
        clauses: [{
          attribute: 'role',
          op: 'in',
          values: ['beta-tester']
        }],
        variation: 0
      };
      const ruleJson = JSON.stringify(rule3).replace(/"/g, '\\"');
      execSync(
        `ldcli flags rules add ${FLAG_KEY} --project ${projectKey} --environment ${environmentKey} -d "${ruleJson}"`,
        { stdio: 'pipe', shell: true }
      );
      console.log('✅ Rule added: role = "beta-tester" → ON\n');
    } catch (error) {
      const errorMsg = error.message || error.toString();
      if (errorMsg.includes('already') || errorMsg.includes('409')) {
        console.log('⚠️  Rule already exists (skipping)\n');
      } else {
        console.error(`❌ Failed to add rule: ${errorMsg}\n`);
        console.error('   Note: You may need to configure this rule manually in the LaunchDarkly dashboard\n');
      }
    }

    console.log('✨ Targeting setup complete!');
    console.log('\n📋 Summary:');
    console.log(`   Flag: ${FLAG_KEY}`);
    console.log('   Individual Targeting:');
    console.log('     - user-001 (Beta Tester) → ON');
    console.log('     - user-002 (Premium User) → ON');
    console.log('   Rule-Based Targeting:');
    console.log('     - subscriptionTier = "premium" → ON');
    console.log('     - betaTester = true → ON');
    console.log('     - role = "beta-tester" → ON');
    console.log('   Default: OFF');
    console.log('\n💡 Note: If any rules failed to add via CLI, you can configure them manually in the LaunchDarkly dashboard.');
    console.log('   Navigate to: Feature Flags → show-premium-feature-demo → Targeting');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
})();

