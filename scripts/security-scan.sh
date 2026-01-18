#!/bin/bash

# Security Scanning Script
# Prioritizes global Snyk, falls back to npm audit.

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Determine project root (one level up from where the script is located)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "🔍 Starting Security Scan in $PROJECT_ROOT..."
cd "$PROJECT_ROOT" || exit 1

# 1. Check for global Snyk
if command_exists snyk; then
    echo "✅ Snyk found. Running Snyk test on all projects (excluding .next)..."
    
    # Snyk exit codes:
    # 0: success, no vulnerabilities found
    # 1: vulnerabilities found
    # 2+: error occurred (e.g. auth, network)
    snyk test --all-projects --exclude=.next
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo "✅ Snyk scan passed (no vulnerabilities found)!"
        exit 0
    elif [ $EXIT_CODE -eq 1 ]; then
        echo "❌ Snyk found vulnerabilities."
        echo "💡 Run 'snyk monitor' to track these in the Snyk dashboard."
        exit 1
    else
        echo "⚠️ Snyk encountered an error (code $EXIT_CODE). Falling back to npm audit..."
    fi
else
    echo "ℹ️ Snyk is not installed globally. Run ./scripts/setup-snyk.sh first."
fi

# 2. Fallback to npm audit
echo "🛡️ Running npm audit..."
if [ -f "package-lock.json" ]; then
    if npm audit; then
        echo "✅ npm audit pass!"
        exit 0
    else
        echo "❌ npm audit found vulnerabilities."
        exit 1
    fi
else
    echo "⚠️ package-lock.json not found. npm audit requires a lockfile."
    echo "💡 Run 'npm install' or 'npm i --package-lock-only' to generate one."
    exit 1
fi
