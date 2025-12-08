#!/bin/bash

# Import LaunchDarkly flags using the CLI
# Usage: ./scripts/import-flags.sh --project YOUR_PROJECT_KEY [--environment ENV_KEY]

set -e

PROJECT_KEY=""
ENVIRONMENT_KEY=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --project)
      PROJECT_KEY="$2"
      shift 2
      ;;
    --environment)
      ENVIRONMENT_KEY="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 --project PROJECT_KEY [--environment ENV_KEY]"
      exit 1
      ;;
  esac
done

if [ -z "$PROJECT_KEY" ]; then
  echo "❌ Error: --project is required"
  echo "Usage: $0 --project PROJECT_KEY [--environment ENV_KEY]"
  exit 1
fi

# Check if ldcli is installed
if ! command -v ldcli &> /dev/null; then
  echo "❌ Error: LaunchDarkly CLI (ldcli) is not installed"
  echo "Install it from: https://docs.launchdarkly.com/home/getting-started/ldcli-commands"
  exit 1
fi

# Check if flags-cli-format.json exists
FLAGS_FILE="launchdarkly/flags-cli-format.json"
if [ ! -f "$FLAGS_FILE" ]; then
  echo "📦 Converting flags to CLI format..."
  node scripts/convert-flags-for-cli.js
fi

if [ ! -f "$FLAGS_FILE" ]; then
  echo "❌ Error: $FLAGS_FILE not found"
  exit 1
fi

echo "🚀 Importing flags to LaunchDarkly..."
echo "📁 Project: $PROJECT_KEY"
if [ -n "$ENVIRONMENT_KEY" ]; then
  echo "🌍 Environment: $ENVIRONMENT_KEY"
fi
echo ""

# Count flags
FLAG_COUNT=$(jq '. | length' "$FLAGS_FILE")
echo "📊 Found $FLAG_COUNT flags to import"
echo ""

# Import each flag
SUCCESS_COUNT=0
FAILED_COUNT=0

jq -c '.[]' "$FLAGS_FILE" | while read -r flag; do
  FLAG_KEY=$(echo "$flag" | jq -r '.key')
  FLAG_NAME=$(echo "$flag" | jq -r '.name')
  
  echo "⏳ Creating flag: $FLAG_KEY ($FLAG_NAME)..."
  
  # Create the flag
  if ldcli flags create "$FLAG_KEY" \
    --project "$PROJECT_KEY" \
    --name "$FLAG_NAME" \
    --description "$(echo "$flag" | jq -r '.description')" \
    --variations "$(echo "$flag" | jq -c '.variations')" \
    --defaults "$(echo "$flag" | jq -c '.defaults')" \
    --client-side-availability "$(echo "$flag" | jq -c '.clientSideAvailability')" \
    --tags "$(echo "$flag" | jq -c '.tags')" 2>/dev/null; then
    
    echo "✅ Created: $FLAG_KEY"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    
    # If environment is specified, set the flag variation for that environment
    if [ -n "$ENVIRONMENT_KEY" ]; then
      DEFAULT_VALUE=$(echo "$flag" | jq -r '.defaults.onVariation')
      if [ "$DEFAULT_VALUE" = "0" ]; then
        echo "   Setting default to ON for environment: $ENVIRONMENT_KEY"
        ldcli flags turn-on "$FLAG_KEY" \
          --project "$PROJECT_KEY" \
          --environment "$ENVIRONMENT_KEY" 2>/dev/null || true
      fi
    fi
  else
    echo "⚠️  Flag $FLAG_KEY may already exist (skipping)"
    FAILED_COUNT=$((FAILED_COUNT + 1))
  fi
  
  echo ""
done

echo "✨ Import complete!"
echo "✅ Successfully created/updated: $SUCCESS_COUNT flags"
if [ $FAILED_COUNT -gt 0 ]; then
  echo "⚠️  Skipped (may already exist): $FAILED_COUNT flags"
fi

