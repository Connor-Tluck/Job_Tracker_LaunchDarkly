# Quick Start: Import Flags with CLI

## Fastest Way to Import All Flags

1. **Install LaunchDarkly CLI**:
   ```bash
   brew install launchdarkly/tap/ldcli
   ```

2. **Login to LaunchDarkly**:
   ```bash
   ldcli login
   ```

3. **Get your Project Key**:
   - Go to https://app.launchdarkly.com
   - Click on your project
   - The project key is in the URL or project settings

4. **Import all flags**:
   ```bash
   npm run ld:import -- --project YOUR_PROJECT_KEY
   ```

That's it! All 29 flags will be created automatically.

## Example

```bash
# After installing CLI and logging in
npm run ld:import -- --project my-job-tracker-project
```

## Need More Help?

See [LAUNCHDARKLY_CLI_SETUP.md](./LAUNCHDARKLY_CLI_SETUP.md) for detailed instructions and troubleshooting.

