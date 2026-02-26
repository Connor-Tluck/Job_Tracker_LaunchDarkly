#!/usr/bin/env node

/**
 * Import missing LaunchDarkly resources from a local export JSON.
 *
 * Usage:
 *   node scripts/import-missing-to-ld.js --project PROJECT_KEY [--environment ENV_KEY]
 *     [--input INPUT_FILE] [--access-token TOKEN] [--env-file PATH]
 *     [--exclude-flags] [--exclude-segments] [--exclude-metrics]
 *     [--exclude-experiments] [--exclude-ai-configs]
 *     [--exclude-release-pipelines] [--exclude-releases]
 *     [--rate-limit-ms 500] [--apply]
 *
 * Notes:
 * - Default is dry-run (no writes). Use --apply to create resources.
 * - Uses REST API only (no CLI).
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
  inputFile: (CONFIG.defaults && CONFIG.defaults.uploadFrom) || DEFAULT_INPUT,
  includeFlags: true,
  includeSegments: true,
  includeMetrics: true,
  includeExperiments: true,
  includeAiConfigs: true,
  includeReleasePipelines: true,
  includeReleases: true,
  rateLimitMs: CONFIG.rateLimitMs || 500,
  endpoints: {
    flagsList: '/api/v2/flags/{projectKey}',
    flagsCreate: '/api/v2/flags/{projectKey}',
    flagsUpdate: '/api/v2/flags/{projectKey}/{flagKey}',
    experimentsList: '/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments',
    experimentsCreate: '/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments',
    segmentsList: '/api/v2/segments/{projectKey}/{environmentKey}',
    segmentsCreate: '/api/v2/segments/{projectKey}/{environmentKey}',
    metricsList: '/api/v2/metrics/{projectKey}',
    metricsCreate: '/api/v2/metrics/{projectKey}',
    aiConfigsList: '/api/v2/projects/{projectKey}/ai-configs',
    aiConfigsCreate: '/api/v2/projects/{projectKey}/ai-configs',
    aiConfigVariationsCreate: '/api/v2/projects/{projectKey}/ai-configs/{configKey}/variations',
    releasePipelinesList: '/api/v2/projects/{projectKey}/release-pipelines',
    releasePipelinesCreate: '/api/v2/projects/{projectKey}/release-pipelines',
    releasesList: '/api/v2/projects/{projectKey}/release-pipelines/{pipelineKey}/releases',
    releasesCreate: '/api/v2/projects/{projectKey}/release-pipelines/{pipelineKey}/releases'
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
    includeReleases: DEFAULTS.includeReleases,
    rateLimitMs: DEFAULTS.rateLimitMs,
    apply: false
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
    } else if (arg === '--rate-limit-ms' && args[i + 1]) {
      options.rateLimitMs = Number(args[i + 1]);
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

function resolveInputPath(inputFile) {
  return path.isAbsolute(inputFile) ? inputFile : path.join(process.cwd(), inputFile);
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

function ldApiRequest({ url, accessToken, method = 'GET', headers = {}, body }) {
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
      method,
      headers: requestHeaders
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

function stripReadOnlyFields(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(stripReadOnlyFields);

  const cleaned = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (key.startsWith('_')) return;
    if (key === '_links' || key === 'links') return;
    if (['createdAt', 'updatedAt', 'lastModified', 'version', 'creationDate'].includes(key)) return;
    cleaned[key] = stripReadOnlyFields(value);
  });
  return cleaned;
}

function buildFlagPayload(localFlag) {
  const base = {
    key: localFlag.key,
    name: localFlag.name,
    description: localFlag.description,
    kind: localFlag.kind,
    tags: localFlag.tags || [],
    variations: localFlag.variations || [],
    defaults: localFlag.defaults || null,
    clientSideAvailability: localFlag.clientSideAvailability || null,
    temporary: localFlag.temporary || false
  };

  return stripReadOnlyFields(base);
}

function buildSegmentPayload(localSegment) {
  return stripReadOnlyFields(localSegment);
}

function buildMetricPayload(localMetric) {
  const cleaned = stripReadOnlyFields(localMetric);
  if (cleaned && typeof cleaned === 'object') {
    delete cleaned._maintainerId;
    delete cleaned.maintainerId;
  }
  return cleaned;
}

function removeRuleIdFields(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(removeRuleIdFields);
  }
  const cleaned = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (key === 'ruleId') return;
    cleaned[key] = removeRuleIdFields(value);
  });
  return cleaned;
}

function buildExperimentIterationPayload(iteration) {
  if (!iteration) return null;

  const cleanedFlags = {};
  if (iteration.flags) {
    Object.entries(iteration.flags).forEach(([flagKey, flagConfig]) => {
      if (!flagConfig || typeof flagConfig !== 'object') return;
      const cleaned = stripReadOnlyFields(flagConfig);
      delete cleaned.targetingRuleClauses;
      delete cleaned.flagConfigVersion;
      delete cleaned.notInExperimentVariationId;
      // Rule IDs from another project won't exist; use fallthrough.
      if (cleaned.targetingRule && cleaned.targetingRule !== 'fallthrough') {
        cleaned.targetingRule = 'fallthrough';
      } else if (!cleaned.targetingRule) {
        cleaned.targetingRule = 'fallthrough';
      }
      cleanedFlags[flagKey] = cleaned;
    });
  }

  const payload = {
    hypothesis: iteration.hypothesis,
    flags: cleanedFlags,
    treatments: iteration.treatments,
    primaryMetric: iteration.primaryMetric || iteration.primarySingleMetric,
    secondaryMetrics: iteration.secondaryMetrics,
    randomizationUnit: iteration.randomizationUnit,
    attributes: iteration.attributes,
    metricGroups: iteration.metricGroups
  };

  const stripped = stripReadOnlyFields(payload);
  const withoutRuleIds = removeRuleIdFields(stripped);
  // Ensure no nested targetingRule values linger outside flags.
  if (withoutRuleIds && withoutRuleIds.flags) {
    Object.values(withoutRuleIds.flags).forEach((flagConfig) => {
      if (!flagConfig) return;
      if (flagConfig.targetingRule && flagConfig.targetingRule !== 'fallthrough') {
        flagConfig.targetingRule = 'fallthrough';
      } else if (!flagConfig.targetingRule) {
        flagConfig.targetingRule = 'fallthrough';
      }
    });
  }
  return withoutRuleIds;
}

function buildExperimentPayload(localExperiment, environmentKey) {
  const iteration = localExperiment.draftIteration || localExperiment.currentIteration;
  const iterationPayload = buildExperimentIterationPayload(iteration);
  if (!iterationPayload) return null;

  const payload = {
    key: localExperiment.key,
    name: localExperiment.name,
    description: localExperiment.description || '',
    environmentKey: localExperiment.environmentKey || environmentKey,
    methodology: localExperiment.methodology,
    dataSource: localExperiment.dataSource,
    iteration: iterationPayload
  };

  return stripReadOnlyFields(payload);
}

function buildAiConfigPayload(localAiConfig) {
  const payload = {
    key: localAiConfig.key,
    name: localAiConfig.name,
    description: localAiConfig.description || '',
    mode: localAiConfig.mode || 'completion',
    tags: localAiConfig.tags || []
  };
  return stripReadOnlyFields(payload);
}

function buildAiConfigVariationPayload(variation) {
  return stripReadOnlyFields({
    key: variation.key,
    name: variation.name,
    messages: variation.messages || [],
    model: variation.model || {},
    modelConfigKey: variation.modelConfigKey
  });
}

function buildReleasePipelinePayload(localPipeline) {
  return stripReadOnlyFields(localPipeline);
}

function buildReleasePayload(localRelease) {
  return stripReadOnlyFields(localRelease);
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

async function createResource({ url, accessToken, payload, headers = {} }) {
  return ldApiRequest({
    url,
    accessToken,
    method: 'POST',
    headers,
    body: payload
  });
}

async function patchResource({ url, accessToken, payload, headers = {} }) {
  return ldApiRequest({
    url,
    accessToken,
    method: 'PATCH',
    headers,
    body: payload
  });
}

function cleanRules(rules) {
  return (rules || []).map((rule) => {
    const cleanRule = { ...rule };
    delete cleanRule._id;
    delete cleanRule.ref;
    if (cleanRule.clauses) {
      cleanRule.clauses = cleanRule.clauses.map((clause) => {
        const cleanClause = { ...clause };
        delete cleanClause._id;
        return cleanClause;
      });
    }
    return cleanRule;
  });
}

function cleanTargets(targets) {
  return (targets || []).map((target) => {
    const cleanTarget = { ...target };
    delete cleanTarget._id;
    return cleanTarget;
  });
}

function buildFlagTargetingPayload(localFlag, environmentKey) {
  const envConfig = localFlag.environments?.[environmentKey];
  if (!envConfig) return null;

  return {
    environments: {
      [environmentKey]: {
        on: envConfig.on !== undefined ? envConfig.on : true,
        targets: cleanTargets(envConfig.targets || []),
        rules: cleanRules(envConfig.rules || []),
        fallthrough: envConfig.fallthrough || { variation: 0 },
        offVariation: envConfig.offVariation !== undefined ? envConfig.offVariation : 1,
        prerequisites: envConfig.prerequisites || []
      }
    }
  };
}

async function applyFlagTargeting({
  projectKey,
  flagKey,
  environmentKey,
  accessToken,
  localFlag
}) {
  const payload = buildFlagTargetingPayload(localFlag, environmentKey);
  if (!payload) return;

  const url = buildUrl(DEFAULTS.endpoints.flagsUpdate, { projectKey, flagKey });
  await patchResource({ url, accessToken, payload });
}

async function createAiConfigVariations({
  projectKey,
  configKey,
  accessToken,
  variations
}) {
  const betaHeaders = { 'LD-API-Version': 'beta' };
  for (const variation of variations || []) {
    const payload = buildAiConfigVariationPayload(variation);
    const url = buildUrl(DEFAULTS.endpoints.aiConfigVariationsCreate, {
      projectKey,
      configKey
    });
    await createResource({ url, accessToken, payload, headers: betaHeaders });
  }
}

async function applyAiConfigTargeting({
  projectKey,
  configKey,
  accessToken,
  localAiConfig
}) {
  const targeting = localAiConfig.targeting;
  if (!targeting || !targeting.environments) return;

  const betaHeaders = {
    'LD-API-Version': 'beta',
    'Content-Type': 'application/json; domain-model=launchdarkly.semanticpatch'
  };

  const envTargeting = targeting.environments[DEFAULTS.environmentKey];
  if (!envTargeting) return;

  const getUrl = buildUrl(DEFAULTS.endpoints.aiConfigsCreate, { projectKey });
  const configList = await ldApiRequest({ url: getUrl, accessToken, headers: betaHeaders });
  const config = (configList.items || []).find((item) => item.key === configKey);
  if (!config) return;

  const targetUrl = `${DEFAULTS.baseUrl}/api/v2/projects/${projectKey}/ai-configs/${configKey}/targeting`;

  const variationIndexToId = {};
  try {
    const currentTargeting = await ldApiRequest({
      url: targetUrl,
      accessToken,
      headers: betaHeaders
    });
    if (currentTargeting.variations && currentTargeting.variations.length > 0) {
      currentTargeting.variations.forEach((v, idx) => {
        variationIndexToId[idx] = v._id;
      });
    }
  } catch {
    return;
  }

  if (Object.keys(variationIndexToId).length === 0) return;

  const instructions = [];
  if (envTargeting.fallthrough && envTargeting.fallthrough.variation !== undefined) {
    const fallthroughVariationId = variationIndexToId[envTargeting.fallthrough.variation];
    if (fallthroughVariationId) {
      instructions.push({
        kind: 'updateFallthroughVariationOrRollout',
        variationId: fallthroughVariationId
      });
    }
  }

  if (envTargeting.offVariation !== undefined) {
    const offVariationId = variationIndexToId[envTargeting.offVariation];
    if (offVariationId) {
      instructions.push({
        kind: 'updateOffVariation',
        variationId: offVariationId
      });
    }
  }

  const allTargets = [];
  if (envTargeting.targets && envTargeting.targets.length > 0) {
    envTargeting.targets.forEach((target) => {
      const variationId = variationIndexToId[target.variation];
      if (variationId) {
        allTargets.push({
          contextKind: target.contextKind,
          variationId,
          values: target.values
        });
      }
    });
  }

  if (allTargets.length > 0) {
    instructions.push({
      kind: 'replaceTargets',
      targets: allTargets
    });
  }

  if (instructions.length === 0) return;

  const patchPayload = {
    environmentKey: DEFAULTS.environmentKey,
    instructions
  };

  await patchResource({
    url: targetUrl,
    accessToken,
    payload: patchPayload,
    headers: betaHeaders
  });
}

async function main() {
  const options = parseArgs(process.argv);

  if (!options.projectKey) {
    console.error('❌ Error: --project is required');
    console.error('Usage: node scripts/import-missing-to-ld.js --project PROJECT_KEY [--environment ENV_KEY]');
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

  console.log('⬆️  Importing missing items to LaunchDarkly...');
  console.log(`📁 Project: ${options.projectKey}`);
  console.log(`🌍 Environment: ${options.environmentKey}`);
  console.log(`📄 Local file: ${inputPath}`);
  console.log(`⚙️  Mode: ${options.apply ? 'apply' : 'dry-run'}\n`);

  const summary = {
    created: {},
    skipped: {},
    errors: {},
    appliedTargeting: {}
  };

  if (options.includeFlags) {
    try {
      const remoteFlags = await fetchAllFlags({
        projectKey: options.projectKey,
        environmentKey: options.environmentKey,
        accessToken
      });
      const missing = diffKeys(localData.flags || [], remoteFlags);
      summary.skipped.flags = (localData.flags || []).length - missing.length;
      summary.created.flags = 0;

      for (const key of missing) {
        const localFlag = (localData.flags || []).find((f) => toKey(f) === key);
        if (!localFlag) continue;
        const payload = buildFlagPayload(localFlag);
        const url = buildUrl(DEFAULTS.endpoints.flagsCreate, { projectKey: options.projectKey });
        if (!options.apply) {
          console.log(`DRY RUN: create flag ${key}`);
        } else {
          await createResource({ url, accessToken, payload });
          summary.created.flags += 1;
          console.log(`✅ Created flag: ${key}`);
          await applyFlagTargeting({
            projectKey: options.projectKey,
            flagKey: key,
            environmentKey: options.environmentKey,
            accessToken,
            localFlag
          });
          summary.appliedTargeting.flags = (summary.appliedTargeting.flags || 0) + 1;
          await sleep(options.rateLimitMs);
        }
      }
    } catch (error) {
      summary.errors.flags = error.message || String(error);
    }
  }

  if (options.includeSegments) {
    try {
      const remoteSegments = await fetchAllSegments({
        projectKey: options.projectKey,
        environmentKey: options.environmentKey,
        accessToken
      });
      const missing = diffKeys(localData.segments || [], remoteSegments);
      summary.skipped.segments = (localData.segments || []).length - missing.length;
      summary.created.segments = 0;

      for (const key of missing) {
        const localSegment = (localData.segments || []).find((s) => toKey(s) === key);
        if (!localSegment) continue;
        const payload = buildSegmentPayload(localSegment);
        const url = buildUrl(DEFAULTS.endpoints.segmentsCreate, {
          projectKey: options.projectKey,
          environmentKey: options.environmentKey
        });
        if (!options.apply) {
          console.log(`DRY RUN: create segment ${key}`);
        } else {
          await createResource({ url, accessToken, payload });
          summary.created.segments += 1;
          console.log(`✅ Created segment: ${key}`);
          await sleep(options.rateLimitMs);
        }
      }
    } catch (error) {
      summary.errors.segments = error.message || String(error);
    }
  }

  if (options.includeMetrics) {
    try {
      const remoteMetrics = await fetchAllMetrics({
        projectKey: options.projectKey,
        accessToken
      });
      const missing = diffKeys(localData.metrics || [], remoteMetrics);
      summary.skipped.metrics = (localData.metrics || []).length - missing.length;
      summary.created.metrics = 0;

      for (const key of missing) {
        const localMetric = (localData.metrics || []).find((m) => toKey(m) === key);
        if (!localMetric) continue;
        const payload = buildMetricPayload(localMetric);
        const url = buildUrl(DEFAULTS.endpoints.metricsCreate, { projectKey: options.projectKey });
        if (!options.apply) {
          console.log(`DRY RUN: create metric ${key}`);
        } else {
          await createResource({ url, accessToken, payload });
          summary.created.metrics += 1;
          console.log(`✅ Created metric: ${key}`);
          await sleep(options.rateLimitMs);
        }
      }
    } catch (error) {
      summary.errors.metrics = error.message || String(error);
    }
  }

  if (options.includeExperiments) {
    try {
      const remoteExperiments = await fetchAllExperiments({
        projectKey: options.projectKey,
        environmentKey: options.environmentKey,
        accessToken
      });
      const missing = diffKeys(localData.experiments || [], remoteExperiments);
      summary.skipped.experiments = (localData.experiments || []).length - missing.length;
      summary.created.experiments = 0;
      const betaHeaders = { 'LD-API-Version': 'beta' };

      for (const key of missing) {
        const localExperiment = (localData.experiments || []).find((e) => toKey(e) === key);
        if (!localExperiment) continue;
        const payload = buildExperimentPayload(localExperiment, options.environmentKey);
        if (!payload) {
          summary.errors.experiments = 'Missing iteration data for experiment payload';
          console.warn(`⚠️  Skipping experiment ${key}: missing iteration`);
          continue;
        }
        const url = buildUrl(DEFAULTS.endpoints.experimentsCreate, {
          projectKey: options.projectKey,
          environmentKey: options.environmentKey
        });
        if (!options.apply) {
          console.log(`DRY RUN: create experiment ${key}`);
        } else {
          await createResource({ url, accessToken, payload, headers: betaHeaders });
          summary.created.experiments += 1;
          console.log(`✅ Created experiment: ${key}`);
          await sleep(options.rateLimitMs);
        }
      }
    } catch (error) {
      summary.errors.experiments = error.message || String(error);
    }
  }

  if (options.includeAiConfigs) {
    try {
      const remoteAiConfigs = await fetchAllAiConfigs({
        projectKey: options.projectKey,
        accessToken
      });
      const missing = diffKeys(localData.aiConfigs || [], remoteAiConfigs);
      summary.skipped.aiConfigs = (localData.aiConfigs || []).length - missing.length;
      summary.created.aiConfigs = 0;
      const betaHeaders = { 'LD-API-Version': 'beta' };

      for (const key of missing) {
        const localAiConfig = (localData.aiConfigs || []).find((c) => toKey(c) === key);
        if (!localAiConfig) continue;
        const payload = buildAiConfigPayload(localAiConfig);
        const url = buildUrl(DEFAULTS.endpoints.aiConfigsCreate, { projectKey: options.projectKey });
        if (!options.apply) {
          console.log(`DRY RUN: create AI config ${key}`);
        } else {
          await createResource({ url, accessToken, payload, headers: betaHeaders });
          if (localAiConfig.variations && localAiConfig.variations.length > 0) {
            await createAiConfigVariations({
              projectKey: options.projectKey,
              configKey: key,
              accessToken,
              variations: localAiConfig.variations
            });
          }
          await applyAiConfigTargeting({
            projectKey: options.projectKey,
            configKey: key,
            accessToken,
            localAiConfig
          });
          summary.created.aiConfigs += 1;
          console.log(`✅ Created AI config: ${key}`);
          summary.appliedTargeting.aiConfigs = (summary.appliedTargeting.aiConfigs || 0) + 1;
          await sleep(options.rateLimitMs);
        }
      }
    } catch (error) {
      summary.errors.aiConfigs = error.message || String(error);
    }
  }

  if (options.includeReleasePipelines) {
    try {
      const remotePipelines = await fetchAllReleasePipelines({
        projectKey: options.projectKey,
        accessToken
      });
      const missing = diffKeys(localData.releasePipelines || [], remotePipelines);
      summary.skipped.releasePipelines = (localData.releasePipelines || []).length - missing.length;
      summary.created.releasePipelines = 0;
      const betaHeaders = { 'LD-API-Version': 'beta' };

      for (const key of missing) {
        const localPipeline = (localData.releasePipelines || []).find((p) => toKey(p) === key);
        if (!localPipeline) continue;
        const payload = buildReleasePipelinePayload(localPipeline);
        const url = buildUrl(DEFAULTS.endpoints.releasePipelinesCreate, { projectKey: options.projectKey });
        if (!options.apply) {
          console.log(`DRY RUN: create release pipeline ${key}`);
        } else {
          await createResource({ url, accessToken, payload, headers: betaHeaders });
          summary.created.releasePipelines += 1;
          console.log(`✅ Created release pipeline: ${key}`);
          await sleep(options.rateLimitMs);
        }
      }
    } catch (error) {
      summary.errors.releasePipelines = error.message || String(error);
    }
  }

  if (options.includeReleases) {
    try {
      const remotePipelines = await fetchAllReleasePipelines({
        projectKey: options.projectKey,
        accessToken
      });
      const remoteReleaseMap = {};
      for (const pipeline of remotePipelines) {
        const pipelineKey = toKey(pipeline);
        if (!pipelineKey) continue;
        remoteReleaseMap[pipelineKey] = await fetchReleasesForPipeline({
          projectKey: options.projectKey,
          pipelineKey,
          accessToken
        });
      }

      const localReleaseGroups = Array.isArray(localData.releases) ? localData.releases : [];
      summary.created.releases = 0;
      summary.skipped.releases = 0;
      const betaHeaders = { 'LD-API-Version': 'beta' };

      for (const group of localReleaseGroups) {
        const pipelineKey = group.pipelineKey || group.pipelineId || group.key;
        if (!pipelineKey) continue;
        const localReleases = Array.isArray(group.releases) ? group.releases : [];
        const remoteReleases = remoteReleaseMap[pipelineKey] || [];
        const missing = diffKeys(localReleases, remoteReleases);
        summary.skipped.releases += localReleases.length - missing.length;
        for (const key of missing) {
          const localRelease = localReleases.find((r) => toKey(r) === key);
          if (!localRelease) continue;
          const payload = buildReleasePayload(localRelease);
          const url = buildUrl(DEFAULTS.endpoints.releasesCreate, {
            projectKey: options.projectKey,
            pipelineKey
          });
          if (!options.apply) {
            console.log(`DRY RUN: create release ${key} in pipeline ${pipelineKey}`);
          } else {
            await createResource({ url, accessToken, payload, headers: betaHeaders });
            summary.created.releases += 1;
            console.log(`✅ Created release: ${key} (pipeline ${pipelineKey})`);
            await sleep(options.rateLimitMs);
          }
        }
      }
    } catch (error) {
      summary.errors.releases = error.message || String(error);
    }
  }

  console.log('\nSummary:');
  Object.entries(summary.created).forEach(([category, count]) => {
    console.log(`- created ${category}: ${count}`);
  });
  Object.entries(summary.skipped).forEach(([category, count]) => {
    console.log(`- skipped ${category}: ${count}`);
  });
  Object.entries(summary.appliedTargeting).forEach(([category, count]) => {
    console.log(`- targeting applied ${category}: ${count}`);
  });
  if (Object.keys(summary.errors).length > 0) {
    console.log('\nErrors:');
    Object.entries(summary.errors).forEach(([category, message]) => {
      console.log(`- ${category}: ${message}`);
    });
  }
}

main();
