#!/usr/bin/env node

/**
 * Export LaunchDarkly flags via REST API (no CLI required).
 *
 * Usage:
 *   node scripts/export-flags-via-api.js --project PROJECT_KEY [--environment ENV_KEY]
 *     [--output OUTPUT_FILE] [--access-token TOKEN] [--env-file PATH]
 *     [--exclude-tags] [--exclude-targets] [--exclude-rules]
 *     [--exclude-prerequisites] [--exclude-variations] [--exclude-experiments]
 *
 * Notes:
 * - Requires a LaunchDarkly access token with read permissions.
 * - Reads `NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID` and `LAUNCHDARKLY_SDK_KEY`
 *   from the environment (or an env file) for validation/logging only.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const DEFAULT_OUTPUT = 'backups/launchdarkly-flags-export.json';

function loadConfig() {
  const configPath = path.join(process.cwd(), 'ld-config.json');
  if (!fs.existsSync(configPath)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (error) {
    console.warn(`⚠️  Could not read ld-config.json: ${error.message}`);
    return {};
  }
}

const CONFIG = loadConfig();

// Non-secret defaults (safe to keep in the script).
// Secrets like access tokens should remain in env vars.
const DEFAULTS = {
  projectKey: CONFIG.projectKey || 'ctluck-ld-demo',
  environmentKey: CONFIG.environmentKey || 'production',
  outputFile: (CONFIG.defaults && CONFIG.defaults.downloadTo) || (CONFIG.localFiles && CONFIG.localFiles.flagsOnly) || DEFAULT_OUTPUT,
  includeTags: true,
  includeTargets: true,
  includeRules: true,
  includePrerequisites: true,
  includeVariations: true,
  includeExperiments: true
};

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    projectKey: DEFAULTS.projectKey,
    environmentKey: DEFAULTS.environmentKey,
    outputFile: DEFAULTS.outputFile,
    accessToken: null,
    envFile: null,
    includeTags: DEFAULTS.includeTags,
    includeTargets: DEFAULTS.includeTargets,
    includeRules: DEFAULTS.includeRules,
    includePrerequisites: DEFAULTS.includePrerequisites,
    includeVariations: DEFAULTS.includeVariations,
    includeExperiments: DEFAULTS.includeExperiments
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--project' && args[i + 1]) {
      options.projectKey = args[i + 1];
      i++;
    } else if (arg === '--environment' && args[i + 1]) {
      options.environmentKey = args[i + 1];
      i++;
    } else if (arg === '--output' && args[i + 1]) {
      options.outputFile = args[i + 1];
      i++;
    } else if (arg === '--access-token' && args[i + 1]) {
      options.accessToken = args[i + 1];
      i++;
    } else if (arg === '--env-file' && args[i + 1]) {
      options.envFile = args[i + 1];
      i++;
    } else if (arg === '--exclude-tags') {
      options.includeTags = false;
    } else if (arg === '--exclude-targets') {
      options.includeTargets = false;
    } else if (arg === '--exclude-rules') {
      options.includeRules = false;
    } else if (arg === '--exclude-prerequisites') {
      options.includePrerequisites = false;
    } else if (arg === '--exclude-variations') {
      options.includeVariations = false;
    } else if (arg === '--exclude-experiments') {
      options.includeExperiments = false;
    }
  }

  return options;
}

function parseEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};

  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) return;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  });

  return env;
}

function hydrateEnvFromFile(envPath) {
  const envFromFile = parseEnvFile(envPath);
  Object.keys(envFromFile).forEach((key) => {
    if (!process.env[key]) {
      process.env[key] = envFromFile[key];
    }
  });
}

function resolveEnvFilePath(providedPath) {
  if (providedPath) {
    return path.isAbsolute(providedPath) ? providedPath : path.join(process.cwd(), providedPath);
  }

  const localPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(localPath)) {
    return localPath;
  }

  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    return envPath;
  }

  return null;
}

function ldApiRequest({ url, accessToken }) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const headers = {
      Authorization: accessToken.startsWith('api-') ? accessToken : `api-${accessToken}`,
      'Content-Type': 'application/json'
    };

    const options = {
      hostname: parsedUrl.hostname,
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      method: 'GET',
      headers
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (error) {
            reject(new Error(`Failed to parse response JSON: ${error.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function fetchAllFlags({ projectKey, environmentKey, accessToken }) {
  const allFlags = [];
  let offset = 0;
  const limit = 50;
  let totalCount = null;

  while (totalCount === null || allFlags.length < totalCount) {
    const url = `https://app.launchdarkly.com/api/v2/flags/${projectKey}?env=${environmentKey}&limit=${limit}&offset=${offset}&summary=0`;
    const response = await ldApiRequest({ url, accessToken });
    const items = response.items || [];
    totalCount = response.totalCount || items.length;
    allFlags.push(...items);
    offset += limit;
  }

  return allFlags;
}

function buildExportFlag({
  flag,
  environmentKey,
  includeTags,
  includeTargets,
  includeRules,
  includePrerequisites,
  includeVariations,
  includeExperiments
}) {
  const envConfig = flag.environments?.[environmentKey] || {};

  const exportedFlag = {
    key: flag.key,
    name: flag.name,
    description: flag.description,
    kind: flag.kind,
    temporary: flag.temporary
  };

  if (includeTags) {
    exportedFlag.tags = flag.tags || [];
  }

  if (includeVariations) {
    exportedFlag.variations = flag.variations || [];
    exportedFlag.defaults = flag.defaults || null;
    exportedFlag.clientSideAvailability = flag.clientSideAvailability || null;
  }

  if (includeExperiments && flag.experiments) {
    exportedFlag.experiments = flag.experiments;
  }

  exportedFlag.environments = {
    [environmentKey]: {
      on: envConfig.on || false,
      archived: envConfig.archived || false,
      salt: envConfig.salt,
      sel: envConfig.sel,
      lastModified: envConfig.lastModified,
      version: envConfig._version,
      fallthrough: envConfig.fallthrough || null,
      offVariation: envConfig.offVariation
    }
  };

  if (includeTargets) {
    exportedFlag.environments[environmentKey].targets = envConfig.targets || [];
  }

  if (includeRules) {
    exportedFlag.environments[environmentKey].rules = envConfig.rules || [];
  }

  if (includePrerequisites) {
    exportedFlag.environments[environmentKey].prerequisites = envConfig.prerequisites || [];
  }

  if (includeExperiments && envConfig.hasExperiment !== undefined) {
    exportedFlag.environments[environmentKey].hasExperiment = envConfig.hasExperiment;
  }

  return exportedFlag;
}

async function main() {
  const options = parseArgs(process.argv);

  if (!options.projectKey) {
    console.error('❌ Error: --project is required');
    console.error('Usage: node scripts/export-flags-via-api.js --project PROJECT_KEY [--environment ENV_KEY]');
    process.exit(1);
  }

  const envPath = resolveEnvFilePath(options.envFile);
  if (envPath) {
    hydrateEnvFromFile(envPath);
  }

  const clientId = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID;
  const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;

  if (!clientId) {
    console.warn('⚠️  NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID is not set.');
  }

  if (!sdkKey) {
    console.warn('⚠️  LAUNCHDARKLY_SDK_KEY is not set.');
  }

  const accessToken =
    options.accessToken ||
    process.env.LAUNCHDARKLY_ACCESS_TOKEN ||
    process.env.LD_ACCESS_TOKEN;


  if (!accessToken) {
    console.error('❌ Error: LaunchDarkly access token is required for REST API access.');
    console.error('Provide via --access-token or set LAUNCHDARKLY_ACCESS_TOKEN/LD_ACCESS_TOKEN.');
    process.exit(1);
  }

  console.log('🚀 Exporting flags via LaunchDarkly REST API...');
  console.log(`📁 Project: ${options.projectKey}`);
  console.log(`🌍 Environment: ${options.environmentKey}`);
  console.log(`📄 Output: ${options.outputFile}\n`);

  try {
    const flags = await fetchAllFlags({
      projectKey: options.projectKey,
      environmentKey: options.environmentKey,
      accessToken
    });

    const exportedFlags = flags.map((flag) =>
      buildExportFlag({
        flag,
        environmentKey: options.environmentKey,
        includeTags: options.includeTags,
        includeTargets: options.includeTargets,
        includeRules: options.includeRules,
        includePrerequisites: options.includePrerequisites,
        includeVariations: options.includeVariations,
        includeExperiments: options.includeExperiments
      })
    );

    const exportData = {
      exportedAt: new Date().toISOString(),
      project: options.projectKey,
      environment: options.environmentKey,
      totalFlags: exportedFlags.length,
      flags: exportedFlags
    };

    const outputPath = path.isAbsolute(options.outputFile)
      ? options.outputFile
      : path.join(process.cwd(), options.outputFile);

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

    console.log('✅ Export complete!');
    console.log(`📊 Flags exported: ${exportedFlags.length}`);
    console.log(`📝 Saved to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Export failed:', error.message || error.toString());
    process.exit(1);
  }
}

main();
