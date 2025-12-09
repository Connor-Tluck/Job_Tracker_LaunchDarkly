#!/usr/bin/env node

/**
 * Regenerate flags.json from LaunchDarkly export file
 * 
 * This script reads a LaunchDarkly export file (from export-flags-with-targeting.js)
 * and regenerates the flags.json file used by the import script.
 * This ensures all flags are included, regardless of their on/off state.
 * 
 * Usage:
 *   node scripts/regenerate-flags-from-export.js [--export-file EXPORT_FILE.json]
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
let exportFile = 'launchdarkly-flags-export-full.json';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--export-file' && args[i + 1]) {
    exportFile = args[i + 1];
    i++;
  }
}

// Paths
const exportPath = path.isAbsolute(exportFile) 
  ? exportFile 
  : path.join(__dirname, '..', exportFile);

const outputPath = path.join(__dirname, '..', 'launchdarkly/flags.json');

// Check if export file exists
if (!fs.existsSync(exportPath)) {
  console.error(`❌ Error: Export file not found: ${exportPath}`);
  console.error('Usage: node scripts/regenerate-flags-from-export.js [--export-file EXPORT_FILE.json]');
  console.error('\nFirst, export your flags:');
  console.error('  node scripts/export-flags-with-targeting.js --project YOUR_PROJECT_KEY');
  process.exit(1);
}

// Read export file
let exportData;
try {
  exportData = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
} catch (error) {
  console.error(`❌ Error reading export file: ${error.message}`);
  process.exit(1);
}

// Validate export structure
if (!exportData.flags || !Array.isArray(exportData.flags)) {
  console.error('❌ Error: Export file does not contain a valid flags array');
  process.exit(1);
}

console.log(`📋 Reading export file: ${exportFile}`);
console.log(`   Found ${exportData.flags.length} flags\n`);

// Map tag to category (reverse of sanitizeTag)
// Tags are like "page-access", "dashboard-components", etc.
// Categories should be like "Page Access", "Dashboard Components", etc.
function tagToCategory(tag) {
  if (!tag) return 'Feature Toggles'; // Default category
  
  // Special case: admin-system -> Admin & System
  if (tag === 'admin-system') {
    return 'Admin & System';
  }
  
  // Convert kebab-case to Title Case
  return tag
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Convert export format to flags.json format
const flags = exportData.flags
  .filter(flag => !flag.error) // Skip flags that failed to export
  .map(flag => {
    // Determine category from tags (use first tag, or default)
    const primaryTag = flag.tags && flag.tags.length > 0 
      ? flag.tags[0] 
      : 'feature-toggles';
    
    const category = tagToCategory(primaryTag);
    
    // Determine default value based on whether flag is on in production
    // If we have environment data, use that; otherwise default to true
    let defaultValue = true;
    if (flag.environments && flag.environments.production) {
      defaultValue = flag.environments.production.on !== false; // Default to true unless explicitly false
    }
    
    return {
      key: flag.key,
      name: flag.name,
      description: flag.description || '',
      category: category,
      default: defaultValue
    };
  })
  .sort((a, b) => {
    // Sort by category first, then by name
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category);
    }
    return a.name.localeCompare(b.name);
  });

// Create output structure
const outputData = {
  flags: flags
};

// Write to file
try {
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
  console.log(`✅ Regenerated flags.json`);
  console.log(`   Output: ${outputPath}`);
  console.log(`   Total flags: ${flags.length}\n`);
  
  // Show category breakdown
  const categoryCounts = {};
  flags.forEach(flag => {
    categoryCounts[flag.category] = (categoryCounts[flag.category] || 0) + 1;
  });
  
  console.log('📊 Category breakdown:');
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`   ${category}: ${count} flags`);
    });
  
  console.log('\n📋 Next steps:');
  console.log('1. Review the regenerated flags.json file');
  console.log('2. Run the convert script to regenerate flags-cli-format.json:');
  console.log('   node scripts/convert-flags-for-cli.js');
  console.log('3. Or run the import script (it will auto-convert if needed):');
  console.log('   npm run ld:import -- --project YOUR_PROJECT_KEY');
  
} catch (error) {
  console.error(`❌ Error writing flags.json: ${error.message}`);
  process.exit(1);
}

