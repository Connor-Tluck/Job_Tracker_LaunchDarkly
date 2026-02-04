#!/usr/bin/env node

/**
 * Export LaunchDarkly flags, experiments, and AI configs via REST API.
 *
 * Usage:
 *   node scripts/export-all-via-api.js --project PROJECT_KEY [--environment ENV_KEY]
 *     [--output OUTPUT_FILE] [--access-token TOKEN] [--env-file PATH]
 *     [--exclude-tags] [--exclude-targets] [--exclude-rules]
 *     [--exclude-prerequisites] [--exclude-variations] [--exclude-experiments]
 *     [--exclude-ai-configs] [--exclude-segments] [--exclude-metrics]
 *     [--exclude-release-pipelines] [--exclude-releases]
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

const DEFAULT_OUTPUT = 'launchdarkly-export-all_Interview_Job_Tracking_Project_Final.json';

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
  projectKey: CONFIG.projectKey || 'Interview_Job_Tracking_Project_Final',
  environmentKey: CONFIG.environmentKey || 'production',
  outputFile: (CONFIG.paths && CONFIG.paths.exportAll) || DEFAULT_OUTPUT,
  includeTags: true,
  includeTargets: true,
  includeRules: true,
  includePrerequisites: true,
  includeVariations: true,
  includeExperiments: true,
  includeAiConfigs: true,
  includeSegments: true,
  includeMetrics: true,
  includeReleasePipelines: true,
  includeReleases: true,
  // Endpoint templates (adjust if your account uses different paths)
  endpoints: {
    flagsList: '/api/v2/flags/{projectKey}',
    experimentsList: '/api/v2/projects/{projectKey}/environments/{environmentKey}/experiments',
    segmentsList: '/api/v2/segments/{projectKey}/{environmentKey}',
    metricsList: '/api/v2/metrics/{projectKey}',
    aiConfigsList: '/api/v2/projects/{projectKey}/ai-configs',
    aiConfigGet: '/api/v2/projects/{projectKey}/ai-configs/{configKey}',
    aiConfigTargeting: '/api/v2/projects/{projectKey}/ai-configs/{configKey}/targeting',
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
    outputFile: DEFAULTS.outputFile,
    accessToken: null,
    envFile: null,
    includeTags: DEFAULTS.includeTags,
    includeTargets: DEFAULTS.includeTargets,
    includeRules: DEFAULTS.includeRules,
    includePrerequisites: DEFAULTS.includePrerequisites,
    includeVariations: DEFAULTS.includeVariations,
    includeExperiments: DEFAULTS.includeExperiments,
    includeAiConfigs: DEFAULTS.includeAiConfigs,
    includeSegments: DEFAULTS.includeSegments,
    includeMetrics: DEFAULTS.includeMetrics,
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
    } else if (arg === '--exclude-ai-configs') {
      options.includeAiConfigs = false;
    } else if (arg === '--exclude-segments') {
      options.includeSegments = false;
    } else if (arg === '--exclude-metrics') {
      options.includeMetrics = false;
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
      { limit, offset, expand: 'draftIteration,previousIterations,secondaryMetrics,treatments' }
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

async function fetchAiConfigDetails({ projectKey, configKey, accessToken }) {
  const betaHeaders = { 'LD-API-Version': 'beta' };
  const detailUrl = buildUrl(DEFAULTS.endpoints.aiConfigGet, { projectKey, configKey });
  const targetingUrl = buildUrl(DEFAULTS.endpoints.aiConfigTargeting, { projectKey, configKey });

  const configDetails = await ldApiRequest({ url: detailUrl, accessToken, headers: betaHeaders });
  let targeting = null;
  try {
    targeting = await ldApiRequest({ url: targetingUrl, accessToken, headers: betaHeaders });
  } catch (error) {
    // Targeting may not exist; keep null
  }

  return { configDetails, targeting };
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

function buildExportAiConfig({ configDetails, targeting }) {
  return {
    key: configDetails.key,
    name: configDetails.name,
    description: configDetails.description || '',
    mode: configDetails.mode,
    tags: configDetails.tags || [],
    variations: (configDetails.variations || []).map((variation) => ({
      key: variation.key,
      name: variation.name,
      messages: variation.messages || [],
      model: variation.model || {},
      modelConfigKey: variation.modelConfigKey,
      state: variation.state
    })),
    targeting
  };
}

async function main() {
  const options = parseArgs(process.argv);

  if (!options.projectKey) {
    console.error('❌ Error: --project is required');
    console.error('Usage: node scripts/export-all-via-api.js --project PROJECT_KEY [--environment ENV_KEY]');
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

  console.log('🚀 Exporting LaunchDarkly data via REST API...');
  console.log(`📁 Project: ${options.projectKey}`);
  console.log(`🌍 Environment: ${options.environmentKey}`);
  console.log(`📄 Output: ${options.outputFile}\n`);

  try {
    const exportErrors = {};

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

    let experiments = [];
    if (options.includeExperiments) {
      try {
        experiments = await fetchAllExperiments({
          projectKey: options.projectKey,
          environmentKey: options.environmentKey,
          accessToken
        });
      } catch (error) {
        exportErrors.experiments = error.message || String(error);
      }
    }

    let segments = [];
    if (options.includeSegments) {
      try {
        segments = await fetchAllSegments({
          projectKey: options.projectKey,
          environmentKey: options.environmentKey,
          accessToken
        });
      } catch (error) {
        exportErrors.segments = error.message || String(error);
      }
    }

    let metrics = [];
    if (options.includeMetrics) {
      try {
        metrics = await fetchAllMetrics({
          projectKey: options.projectKey,
          accessToken
        });
      } catch (error) {
        exportErrors.metrics = error.message || String(error);
      }
    }

    let releasePipelines = [];
    let releases = [];
    if (options.includeReleasePipelines) {
      try {
        releasePipelines = await fetchAllReleasePipelines({
          projectKey: options.projectKey,
          accessToken
        });
      } catch (error) {
        exportErrors.releasePipelines = error.message || String(error);
      }
    }

    if (options.includeReleases && releasePipelines.length > 0) {
      const pipelineReleases = [];
      for (const pipeline of releasePipelines) {
        const pipelineKey = pipeline.key || pipeline.id || pipeline._key;
        if (!pipelineKey) continue;
        try {
          const pipelineItems = await fetchReleasesForPipeline({
            projectKey: options.projectKey,
            pipelineKey,
            accessToken
          });
          pipelineReleases.push({ pipelineKey, releases: pipelineItems });
        } catch (error) {
          exportErrors.releases = error.message || String(error);
          break;
        }
      }
      releases = pipelineReleases;
    }

    let aiConfigs = [];
    if (options.includeAiConfigs) {
      try {
        const configs = await fetchAllAiConfigs({
          projectKey: options.projectKey,
          accessToken
        });

        aiConfigs = [];
        for (const config of configs) {
          const configKey = config.key || config._key;
          if (!configKey) continue;
          const { configDetails, targeting } = await fetchAiConfigDetails({
            projectKey: options.projectKey,
            configKey,
            accessToken
          });
          aiConfigs.push(buildExportAiConfig({ configDetails, targeting }));
        }
      } catch (error) {
        exportErrors.aiConfigs = error.message || String(error);
      }
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      project: options.projectKey,
      environment: options.environmentKey,
      flags: exportedFlags,
      segments,
      metrics,
      experiments,
      aiConfigs,
      releasePipelines,
      releases,
      errors: exportErrors
    };

    const outputPath = path.isAbsolute(options.outputFile)
      ? options.outputFile
      : path.join(process.cwd(), options.outputFile);

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

    console.log('✅ Export complete!');
    console.log(`📊 Flags exported: ${exportedFlags.length}`);
    console.log(`🧩 Segments exported: ${segments.length}`);
    console.log(`📈 Metrics exported: ${metrics.length}`);
    console.log(`🧪 Experiments exported: ${experiments.length}`);
    console.log(`🤖 AI Configs exported: ${aiConfigs.length}`);
    console.log(`🚦 Release pipelines exported: ${releasePipelines.length}`);
    console.log(`🚀 Releases exported: ${releases.length}`);
    console.log(`📝 Saved to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Export failed:', error.message || error.toString());
    process.exit(1);
  }
}

main();
