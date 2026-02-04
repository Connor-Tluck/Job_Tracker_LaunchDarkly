#!/usr/bin/env node

/**
 * Add a tag to all flags in a LaunchDarkly project.
 *
 * Usage:
 *   node scripts/add-tag-to-flags.js --project PROJECT_KEY --tag TAG
 *     [--env-file PATH] [--access-token TOKEN] [--apply]
 *
 * Notes:
 * - Default is dry-run (no writes). Use --apply to update tags.
 * - Uses REST API only (no CLI).
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

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

const DEFAULTS = {
  projectKey: CONFIG.projectKey || 'Interview_Job_Tracking_Project_Final',
  baseUrl: CONFIG.baseUrl || 'https://app.launchdarkly.com',
  rateLimitMs: CONFIG.rateLimitMs || 500
};

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    projectKey: DEFAULTS.projectKey,
    tag: null,
    accessToken: null,
    envFile: null,
    apply: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--project' && args[i + 1]) {
      options.projectKey = args[i + 1];
      i++;
    } else if (arg === '--tag' && args[i + 1]) {
      options.tag = args[i + 1];
      i++;
    } else if (arg === '--access-token' && args[i + 1]) {
      options.accessToken = args[i + 1];
      i++;
    } else if (arg === '--env-file' && args[i + 1]) {
      options.envFile = args[i + 1];
      i++;
    } else if (arg === '--apply') {
      options.apply = true;
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

function buildUrl(pathname, query = {}) {
  const queryString = new URLSearchParams(query).toString();
  const suffix = queryString ? `?${queryString}` : '';
  return `${DEFAULTS.baseUrl}${pathname}${suffix}`;
}

function ldApiRequest({ url, accessToken, method = 'GET', body }) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const headers = {
      Authorization: accessToken.startsWith('api-') ? accessToken : `api-${accessToken}`,
      'Content-Type': 'application/json'
    };

    const options = {
      hostname: parsedUrl.hostname,
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      method,
      headers
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (!data) return resolve({});
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
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchAllFlags({ projectKey, accessToken }) {
  const allFlags = [];
  let offset = 0;
  const limit = 50;
  let totalCount = null;

  while (totalCount === null || allFlags.length < totalCount) {
    const url = buildUrl(`/api/v2/flags/${projectKey}`, {
      limit,
      offset,
      summary: 0
    });
    const response = await ldApiRequest({ url, accessToken });
    const items = response.items || [];
    totalCount = response.totalCount || items.length;
    allFlags.push(...items);
    offset += limit;
  }

  return allFlags;
}

async function updateFlagTags({ projectKey, flagKey, tags, accessToken }) {
  const url = buildUrl(`/api/v2/flags/${projectKey}/${flagKey}`);
  const payload = { tags };
  return ldApiRequest({ url, accessToken, method: 'PATCH', body: payload });
}

async function updateFlagTagsWithRetry({
  projectKey,
  flagKey,
  tags,
  accessToken,
  rateLimitMs
}) {
  const maxRetries = 5;
  let attempt = 0;
  while (true) {
    try {
      return await updateFlagTags({ projectKey, flagKey, tags, accessToken });
    } catch (error) {
      const message = error.message || String(error);
      if (!message.includes('HTTP 429') && !message.includes('rate_limited')) {
        throw error;
      }
      attempt += 1;
      if (attempt > maxRetries) {
        throw error;
      }
      const backoffMs = Math.min(rateLimitMs * Math.pow(2, attempt), 10000);
      console.log(`⏸️  Rate limited. Retrying ${flagKey} in ${backoffMs}ms...`);
      await sleep(backoffMs);
    }
  }
}

async function main() {
  const options = parseArgs(process.argv);

  if (!options.projectKey || !options.tag) {
    console.error('❌ Error: --project and --tag are required');
    console.error('Usage: node scripts/add-tag-to-flags.js --project PROJECT_KEY --tag TAG [--apply]');
    process.exit(1);
  }

  const envPath = resolveEnvFilePath(options.envFile);
  if (envPath) {
    hydrateEnvFromFile(envPath);
  }

  const accessToken =
    options.accessToken ||
    process.env.LAUNCHDARKLY_ACCESS_TOKEN ||
    process.env.LD_ACCESS_TOKEN;

  if (!accessToken) {
    console.error('❌ Error: LaunchDarkly access token is required for REST API access.');
    process.exit(1);
  }

  console.log('🏷️  Adding tag to flags...');
  console.log(`📁 Project: ${options.projectKey}`);
  console.log(`🏷️  Tag: ${options.tag}`);
  console.log(`⚙️  Mode: ${options.apply ? 'apply' : 'dry-run'}\n`);

  const flags = await fetchAllFlags({
    projectKey: options.projectKey,
    accessToken
  });

  let updatedCount = 0;
  let skippedCount = 0;

  for (const flag of flags) {
    const tags = Array.isArray(flag.tags) ? flag.tags : [];
    if (tags.includes(options.tag)) {
      skippedCount += 1;
      continue;
    }

    const nextTags = [...tags, options.tag];
    if (!options.apply) {
      console.log(`DRY RUN: add tag to ${flag.key}`);
    } else {
      await updateFlagTagsWithRetry({
        projectKey: options.projectKey,
        flagKey: flag.key,
        tags: nextTags,
        accessToken,
        rateLimitMs: DEFAULTS.rateLimitMs
      });
      updatedCount += 1;
      console.log(`✅ Updated flag: ${flag.key}`);
      await sleep(DEFAULTS.rateLimitMs);
    }
  }

  console.log('\nSummary:');
  console.log(`- updated: ${updatedCount}`);
  console.log(`- skipped (already tagged): ${skippedCount}`);
}

main();
