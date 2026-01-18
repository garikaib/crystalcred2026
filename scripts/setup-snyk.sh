#!/bin/bash

# Snyk Setup Script
# This script installs Snyk globally and authenticates the user.

echo "🚀 Installing Snyk globally..."

if npm install -g snyk; then
    echo "✅ Snyk installed successfully."
else
    echo "❌ Failed to install Snyk globally."
    echo "💡 Try running this script with sudo: sudo ./scripts/setup-snyk.sh"
    exit 1
fi

echo "🔐 Authenticating with Snyk..."
echo "This will open a browser window for you to log in."
snyk auth

if [ $? -eq 0 ]; then
    echo "✅ Successfully authenticated with Snyk."
else
    echo "❌ Snyk authentication failed."
    exit 1
fi

echo "✨ Setup complete! You can now run ./scripts/security-scan.sh"
