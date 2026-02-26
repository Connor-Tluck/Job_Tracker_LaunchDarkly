#!/usr/bin/env node

/**
 * Compare local export JSON against LaunchDarkly project data.
 *
 * Usage:
 *   node scripts/compare-local-vs-ld.js --project PROJECT_KEY [--environment ENV_KEY]
 *     [--input INPUT_FILE] [--access-token TOKEN] [--env-file PATH]
 *     [--exclude-flags] [--exclude-segments] [--exclude-metrics]
 *     [--exclude-experiments] [--exclude-ai-configs]
 *     [--exclude-release-pipelines] [--exclude-releases]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const DEFAULT_INPUT = 'backups/launchdarkly-export-all.json';

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
  projectKey: CONFIG.projectKey || 'ctluck-ld-demo',
  environmentKey: CONFIG.environmentKey || 'production',
  inputFile: (CONFIG.defaults && CONFIG.defaults.compareFrom) || DEFAULT_INPUT,
  includeFlags: true,
  includeSegments: true,
  includeMetrics: true,
  includeExperiments: true,
  includeAiConfigs: true,
  includeReleasePipelines: true,
  includeReleases: true,
  endpoints: {
    flagsList: '/api/v2/flags/{projectKey}',
    experimentsList: '/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments',
    segmentsList: '/api/v2/segments/{projectKey}/{environmentKey}',
    metricsList: '/api/v2/metrics/{projectKey}',
    aiConfigsList: '/api/v2/projects/{projectKey}/ai-configs',
    releasePipelinesList: '/api/v2/projects/{projectKey}/release-pipelines',
    releasesList: '/api/v2/projects/{projectKey}/release-pipelines/{pipelineKey}/releases'
  },
  baseUrl: CONFIG.baseUrl || 'https://app.launchdarkly.com'
};

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    projectKey: DEFAULTS.projectKey,
    environmentKey: DEFAULTS.environmentKey,
    inputFile: DEFAULTS.inputFile,
    accessToken: null,
    envFile: null,
    includeFlags: DEFAULTS.includeFlags,
    includeSegments: DEFAULTS.includeSegments,
    includeMetrics: DEFAULTS.includeMetrics,
    includeExperiments: DEFAULTS.includeExperiments,
    includeAiConfigs: DEFAULTS.includeAiConfigs,
    includeReleasePipelines: DEFAULTS.includeReleasePipelines,
    includeReleases: DEFAULTS.includeReleases
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--project' && args[i + 1]) {
      options.projectKey = args[i + 1];
      i++;
    } else if (arg === '--environment' && args[i + 1]) {
      options.environmentKey = args[i + 1];
      i++;
    } else if (arg === '--input' && args[i + 1]) {
      options.inputFile = args[i + 1];
      i++;
    } else if (arg === '--access-token' && args[i + 1]) {
      options.accessToken = args[i + 1];
      i++;
    } else if (arg === '--env-file' && args[i + 1]) {
      options.envFile = args[i + 1];
      i++;
    } else if (arg === '--exclude-flags') {
      options.includeFlags = false;
    } else if (arg === '--exclude-segments') {
      options.includeSegments = false;
    } else if (arg === '--exclude-metrics') {
      options.includeMetrics = false;
    } else if (arg === '--exclude-experiments') {
      options.includeExperiments = false;
    } else if (arg === '--exclude-ai-configs') {
      options.includeAiConfigs = false;
    } else if (arg === '--exclude-release-pipelines') {
      options.includeReleasePipelines = false;
    } else if (arg === '--exclude-releases') {
      options.includeReleases = false;
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

function buildUrl(template, params, query = {}) {
  let url = template;
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, encodeURIComponent(value));
  });

  const queryString = new URLSearchParams(query).toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return `${DEFAULTS.baseUrl}${url}`;
}

function ldApiRequest({ url, accessToken, headers = {} }) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const requestHeaders = {
      Authorization: accessToken.startsWith('api-') ? accessToken : `api-${accessToken}`,
      'Content-Type': 'application/json',
      ...headers
    };

    const options = {
      hostname: parsedUrl.hostname,
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      method: 'GET',
      headers: requestHeaders
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
    const url = buildUrl(DEFAULTS.endpoints.flagsList, { projectKey }, {
      env: environmentKey,
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

async function fetchAllExperiments({ projectKey, environmentKey, accessToken }) {
  const allExperiments = [];
  let offset = 0;
  const limit = 50;
  let totalCount = null;
  const betaHeaders = { 'LD-API-Version': 'beta' };

  while (totalCount === null || allExperiments.length < totalCount) {
    const url = buildUrl(
      DEFAULTS.endpoints.experimentsList,
      { projectKey, environmentKey },
      { limit, offset }
    );
    const response = await ldApiRequest({ url, accessToken, headers: betaHeaders });
    const items = response.items || [];
    totalCount = response.totalCount || items.length;
    allExperiments.push(...items);
    offset += limit;
  }

  return allExperiments;
}

async function fetchAllSegments({ projectKey, environmentKey, accessToken }) {
  const allSegments = [];
  let offset = 0;
  const limit = 50;
  let totalCount = null;

  while (totalCount === null || allSegments.length < totalCount) {
    const url = buildUrl(DEFAULTS.endpoints.segmentsList, { projectKey, environmentKey }, { limit, offset });
    const response = await ldApiRequest({ url, accessToken });
    const items = response.items || [];
    totalCount = response.totalCount || items.length;
    allSegments.push(...items);
    offset += limit;
  }

  return allSegments;
}

async function fetchAllMetrics({ projectKey, accessToken }) {
  const allMetrics = [];
  let offset = 0;
  const limit = 50;
  let totalCount = null;

  while (totalCount === null || allMetrics.length < totalCount) {
    const url = buildUrl(DEFAULTS.endpoints.metricsList, { projectKey }, { limit, offset });
    const response = await ldApiRequest({ url, accessToken });
    const items = response.items || [];
    totalCount = response.totalCount || items.length;
    allMetrics.push(...items);
    offset += limit;
  }

  return allMetrics;
}

async function fetchAllAiConfigs({ projectKey, accessToken }) {
  const allConfigs = [];
  let offset = 0;
  const limit = 50;
  let totalCount = null;
  const betaHeaders = { 'LD-API-Version': 'beta' };

  while (totalCount === null || allConfigs.length < totalCount) {
    const url = buildUrl(DEFAULTS.endpoints.aiConfigsList, { projectKey }, { limit, offset });
    const response = await ldApiRequest({ url, accessToken, headers: betaHeaders });
    const items = response.items || [];
    totalCount = response.totalCount || items.length;
    allConfigs.push(...items);
    offset += limit;
  }

  return allConfigs;
}

async function fetchAllReleasePipelines({ projectKey, accessToken }) {
  const allPipelines = [];
  let offset = 0;
  const limit = 50;
  let totalCount = null;
  const betaHeaders = { 'LD-API-Version': 'beta' };

  while (totalCount === null || allPipelines.length < totalCount) {
    const url = buildUrl(DEFAULTS.endpoints.releasePipelinesList, { projectKey }, { limit, offset });
    const response = await ldApiRequest({ url, accessToken, headers: betaHeaders });
    const items = response.items || [];
    totalCount = response.totalCount || items.length;
    allPipelines.push(...items);
    offset += limit;
  }

  return allPipelines;
}

async function fetchReleasesForPipeline({ projectKey, pipelineKey, accessToken }) {
  const allReleases = [];
  let offset = 0;
  const limit = 50;
  let totalCount = null;
  const betaHeaders = { 'LD-API-Version': 'beta' };

  while (totalCount === null || allReleases.length < totalCount) {
    const url = buildUrl(
      DEFAULTS.endpoints.releasesList,
      { projectKey, pipelineKey },
      { limit, offset }
    );
    const response = await ldApiRequest({ url, accessToken, headers: betaHeaders });
    const items = response.items || [];
    totalCount = response.totalCount || items.length;
    allReleases.push(...items);
    offset += limit;
  }

  return allReleases;
}

function toKey(item) {
  return item && (item.key || item._key || item.id || item._id || item.name);
}

function toKeySet(items) {
  const set = new Set();
  (items || []).forEach((item) => {
    const key = toKey(item);
    if (key) set.add(String(key));
  });
  return set;
}

function diffKeys(localItems, remoteItems) {
  const localSet = toKeySet(localItems);
  const remoteSet = toKeySet(remoteItems);
  const missing = [];
  localSet.forEach((key) => {
    if (!remoteSet.has(key)) {
      missing.push(key);
    }
  });
  missing.sort();
  return missing;
}

function resolveInputPath(inputFile) {
  return path.isAbsolute(inputFile) ? inputFile : path.join(process.cwd(), inputFile);
}

async function main() {
  const options = parseArgs(process.argv);

  if (!options.projectKey) {
    console.error('❌ Error: --project is required');
    console.error('Usage: node scripts/compare-local-vs-ld.js --project PROJECT_KEY [--environment ENV_KEY]');
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
    console.error('Provide via --access-token or set LAUNCHDARKLY_ACCESS_TOKEN/LD_ACCESS_TOKEN.');
    process.exit(1);
  }

  const inputPath = resolveInputPath(options.inputFile);
  if (!fs.existsSync(inputPath)) {
    console.error(`❌ Error: Local export file not found: ${inputPath}`);
    process.exit(1);
  }

  let localData;
  try {
    localData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } catch (error) {
    console.error(`❌ Error reading local export file: ${error.message}`);
    process.exit(1);
  }

  console.log('🔍 Comparing local export to LaunchDarkly project...');
  console.log(`📁 Project: ${options.projectKey}`);
  console.log(`🌍 Environment: ${options.environmentKey}`);
  console.log(`📄 Local file: ${inputPath}\n`);

  const report = {
    project: options.projectKey,
    environment: options.environmentKey,
    inputFile: inputPath,
    missing: {},
    errors: {}
  };

  try {
    if (options.includeFlags) {
      const remoteFlags = await fetchAllFlags({
        projectKey: options.projectKey,
        environmentKey: options.environmentKey,
        accessToken
      });
      report.missing.flags = diffKeys(localData.flags || [], remoteFlags);
    }
  } catch (error) {
    report.errors.flags = error.message || String(error);
  }

  try {
    if (options.includeSegments) {
      const remoteSegments = await fetchAllSegments({
        projectKey: options.projectKey,
        environmentKey: options.environmentKey,
        accessToken
      });
      report.missing.segments = diffKeys(localData.segments || [], remoteSegments);
    }
  } catch (error) {
    report.errors.segments = error.message || String(error);
  }

  try {
    if (options.includeMetrics) {
      const remoteMetrics = await fetchAllMetrics({
        projectKey: options.projectKey,
        accessToken
      });
      report.missing.metrics = diffKeys(localData.metrics || [], remoteMetrics);
    }
  } catch (error) {
    report.errors.metrics = error.message || String(error);
  }

  try {
    if (options.includeExperiments) {
      const remoteExperiments = await fetchAllExperiments({
        projectKey: options.projectKey,
        environmentKey: options.environmentKey,
        accessToken
      });
      report.missing.experiments = diffKeys(localData.experiments || [], remoteExperiments);
    }
  } catch (error) {
    report.errors.experiments = error.message || String(error);
  }

  try {
    if (options.includeAiConfigs) {
      const remoteAiConfigs = await fetchAllAiConfigs({
        projectKey: options.projectKey,
        accessToken
      });
      report.missing.aiConfigs = diffKeys(localData.aiConfigs || [], remoteAiConfigs);
    }
  } catch (error) {
    report.errors.aiConfigs = error.message || String(error);
  }

  try {
    if (options.includeReleasePipelines) {
      const remotePipelines = await fetchAllReleasePipelines({
        projectKey: options.projectKey,
        accessToken
      });
      report.missing.releasePipelines = diffKeys(localData.releasePipelines || [], remotePipelines);

      if (options.includeReleases) {
        const localReleaseGroups = Array.isArray(localData.releases) ? localData.releases : [];
        const remoteReleasesByPipeline = {};
        for (const pipeline of remotePipelines) {
          const pipelineKey = toKey(pipeline);
          if (!pipelineKey) continue;
          const releases = await fetchReleasesForPipeline({
            projectKey: options.projectKey,
            pipelineKey,
            accessToken
          });
          remoteReleasesByPipeline[pipelineKey] = releases;
        }

        const missingReleases = {};
        for (const group of localReleaseGroups) {
          const pipelineKey = group.pipelineKey || group.pipelineId || group.key;
          if (!pipelineKey) continue;
          const localReleases = Array.isArray(group.releases) ? group.releases : [];
          const remoteReleases = remoteReleasesByPipeline[pipelineKey] || [];
          const diff = diffKeys(localReleases, remoteReleases);
          if (diff.length > 0) {
            missingReleases[pipelineKey] = diff;
          }
        }
        report.missing.releases = missingReleases;
      }
    }
  } catch (error) {
    report.errors.releasePipelines = error.message || String(error);
  }

  console.log('✅ Comparison complete.\n');
  if (Object.keys(report.missing).length > 0) {
    console.log('Missing items by category:');
    Object.entries(report.missing).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        console.log(`- ${category}: ${items.length}`);
      } else if (items && typeof items === 'object') {
        const total = Object.values(items).reduce((sum, list) => sum + list.length, 0);
        console.log(`- ${category}: ${total}`);
      }
    });
  }

  if (Object.keys(report.errors).length > 0) {
    console.log('\nErrors:');
    Object.entries(report.errors).forEach(([category, message]) => {
      console.log(`- ${category}: ${message}`);
    });
  }

  console.log('\nReport (JSON):');
  console.log(JSON.stringify(report, null, 2));
}

main();
