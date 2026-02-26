## LaunchDarkly Backup & Sync Commands

All commands use the REST API (no CLI required). Configuration lives in `ld-config.json`.

**Prerequisite:** Set your access token before running any command:

```bash
export LAUNCHDARKLY_ACCESS_TOKEN=api-your-token-here
```

---

### Command Overview

| npm command | Direction | Script file | What it does |
|-------------|-----------|-------------|--------------|
| `npm run ld:download-all` | LD → Local | `scripts/download-all-from-ld.js` | Download flags, experiments, AI configs, segments, metrics, releases to local JSON |
| `npm run ld:download-flags` | LD → Local | `scripts/download-flags-from-ld.js` | Download flags only to local JSON |
| `npm run ld:compare` | Local vs LD | `scripts/compare-local-vs-ld.js` | Show what exists locally but is missing from LD project |
| `npm run ld:upload` | Local → LD | `scripts/upload-to-ld.js` | Upload missing items from local JSON to LD project |
| `npm run ld:add-tag` | → LD | `scripts/add-tag-to-flags.js` | Add a tag to all flags in the LD project |

---

### Download from LD project → local JSON

Save a full backup (flags, experiments, AI configs, segments, metrics, releases):

```bash
npm run ld:download-all
```

Save flags only:

```bash
npm run ld:download-flags
```

Override the output file:

```bash
npm run ld:download-all -- --output my-backup.json
```

---

### Compare local JSON → LD project

Check what exists in your local file but is missing from the LD project (one-way):

```bash
npm run ld:compare
```

Override the input file:

```bash
npm run ld:compare -- --input my-backup.json
```

---

### Upload from local JSON → LD project

Dry-run (preview what would be created, no changes made):

```bash
npm run ld:upload
```

Apply (creates missing flags, segments, metrics, experiments, AI configs, releases, and applies targeting):

```bash
npm run ld:upload -- --apply
```

Override the input file:

```bash
npm run ld:upload -- --input my-backup.json --apply
```

---

### Add a tag to all flags in LD project

Dry-run:

```bash
npm run ld:add-tag -- --tag your-tag
```

Apply:

```bash
npm run ld:add-tag -- --tag your-tag --apply
```

---

### Config: `ld-config.json`

| Key | Purpose |
|-----|---------|
| `projectKey` | Your LD project key |
| `environmentKey` | Target environment (default: `production`) |
| `rateLimitMs` | Delay between API calls to avoid rate limits |
| `defaults.downloadTo` | Default output file for download commands |
| `defaults.compareFrom` | Default input file for compare command |
| `defaults.uploadFrom` | Default input file for upload command |

All file paths can be overridden with `--input` or `--output` flags on any command.

All backup files live in the `backups/` folder (git-ignored).
