## LaunchDarkly Commands (Concise)

### Shared config
- `ld-config.json` stores `projectKey`, `environmentKey`, `baseUrl`, `rateLimitMs`, and default file paths used by the scripts.

### Export existing flags
- `npm run ld:export-api`
  - Exports all flags (and targeting/metadata) to `launchdarkly-flags-export-api.json` by default.

### Export everything (flags + experiments + AI configs + segments + metrics + releases)
- `npm run ld:export-all`
  - Exports full backup to `launchdarkly-export-all.json` by default.

### Add a tag to all flags
- Dry-run:
  - `npm run ld:add-tag -- --tag your-tag`
  - Shows which flags would be tagged.
- Apply:
  - `npm run ld:add-tag -- --tag your-tag --apply`
  - Adds the tag to all flags that don’t already have it.

### Compare local export vs LaunchDarkly
- `npm run ld:compare`
  - Reports items that exist locally but are missing in LaunchDarkly.

### Import missing items into LaunchDarkly
- Dry-run:
  - `npm run ld:import-missing`
  - Shows what would be created (no writes).
- Apply:
  - `npm run ld:import-missing -- --apply`
  - Creates missing flags/experiments/AI configs/segments/metrics/releases.

### Optional flags (all commands)
- `--environment ENV_KEY` to target a specific environment (defaults to `production`).
- `--output path.json` or `--input path.json` to control files.
- `--exclude-*` flags to skip categories (see each script’s `--help` usage in the header).
