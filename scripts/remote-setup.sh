#!/bin/bash

# Configuration
APP_DIR="/var/www/next.crystalcred.co.zw"
DOMAIN="next.crystalcred.co.zw"

echo "Starting Remote Server Setup..."

# 1. Update & Install Basic Tools
sudo apt update
sudo apt install -y curl git unzip

# 2. Install Webinoly (if not installed)
if ! command -v webinoly &> /dev/null; then
    echo "Installing Webinoly..."
    wget -qO weby qrok.es/wy && sudo bash weby
else
    echo "Webinoly already installed."
fi

# 3. Install Node.js (LTS) & PM2
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    # Using Webinoly's stack command if available, or manual
    sudo stack -node
else
    echo "Node.js already installed."
fi

if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
else
    echo "PM2 already installed."
fi

# 4. Setup Site with Webinoly (Reverse Proxy)
# Check if site exists
if [ ! -d "$APP_DIR" ]; then
    echo "Creating Webinoly site '$DOMAIN' with Proxy to Port 3000..."
    sudo site "$DOMAIN" -proxy=3000
    
    # Enable SSL
    echo "Enabling SSL..."
    sudo site "$DOMAIN" -ssl=on
else
    echo "Site '$DOMAIN' already exists."
fi

# 5. Prepare Directory Permissions
# Ensure the user has write access to the app directory
CURRENT_USER=$(whoami)
echo "Setting permissions for $CURRENT_USER on $APP_DIR..."
sudo chown -R "$CURRENT_USER:$CURRENT_USER" "$APP_DIR"

echo "Remote Setup Complete!"
