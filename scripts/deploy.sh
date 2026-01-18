#!/bin/bash

# Configuration
cd "$(dirname "$0")/.." # Ensure we are in the project root
REMOTE_HOST="51.195.252.90"
REMOTE_USER="ubuntu"
DOMAIN="crystalcred.co.zw"
REMOTE_DIR="/var/www/$DOMAIN"
SSH_OPTS="-o StrictHostKeyChecking=no" 
ARCHIVE_NAME="deploy.tar.zst"

SKIP_BUILD=false
if [[ "$*" == *"--skip-build"* ]]; then
    SKIP_BUILD=true
fi

echo "🚀 Deploying to $REMOTE_USER@$REMOTE_HOST"

# 1. Build Locally (Disabled - building on remote for Turbopack consistency)
if [ "$SKIP_BUILD" = false ]; then
    echo "⏭️ Local build skipped (source will be built on remote server)"
else
    echo "⏭️ Skipping build as requested."
fi

# 2. Create Archive (Source Only)
echo "📚 Creating archive of source files..."
# Exclude node_modules, .git, .next, and other build artifacts
rm -f $ARCHIVE_NAME
tar --exclude='node_modules' --exclude='.git' --exclude='.next' --exclude='deploy.tar.zst' -cf - . \
    | zstd - -3 -o $ARCHIVE_NAME

# Show archive size
ARCHIVE_SIZE=$(du -h $ARCHIVE_NAME | cut -f1)
echo "📊 Archive size: $ARCHIVE_SIZE"

# 3. Transfer Archive and Environment Variables
echo "📤 Transferring files to $REMOTE_USER home..."
rsync -avP -e "ssh $SSH_OPTS" $ARCHIVE_NAME "$REMOTE_USER@$REMOTE_HOST:~/$ARCHIVE_NAME"
rsync -avP -e "ssh $SSH_OPTS" .env.production "$REMOTE_USER@$REMOTE_HOST:~/.env"

if [ $? -ne 0 ]; then
    echo "❌ Transfer failed. Aborting."
    rm $ARCHIVE_NAME
    exit 1
fi

# 4. Remote Commands
echo "🔧 Running remote commands with sudo..."
ssh $SSH_OPTS "$REMOTE_USER@$REMOTE_HOST" << EOF
    # Create directories
    sudo mkdir -p $REMOTE_DIR
    sudo mkdir -p ~/deploy_staging
    sudo chown $REMOTE_USER:$REMOTE_USER $REMOTE_DIR ~/deploy_staging

    # Unpack to staging directory
    echo "📦 Unpacking source archive to staging..."
    rm -rf ~/deploy_staging/*
    tar -I zstd -xf ~/$ARCHIVE_NAME -C ~/deploy_staging
    
    # Move environment file
    echo "🔑 Updating environment variables..."
    mv ~/.env ~/deploy_staging/.env
    
    # Cleanup remote archive
    rm ~/$ARCHIVE_NAME
    
    # rsync to app directory with exclusions (protect user data)
    echo "🔄 Syncing files (protecting uploads and env)..."
    rsync -a --delete \
        --exclude 'public/uploads/' \
        --exclude '.env' \
        --exclude 'node_modules/' \
        --exclude '.next/' \
        ~/deploy_staging/ $REMOTE_DIR/
    
    # Copy .env separately (only if not exists or if we transferred a new one)
    if [ -f ~/deploy_staging/.env ]; then
        cp ~/deploy_staging/.env $REMOTE_DIR/.env
    fi
    
    cd $REMOTE_DIR
    
    # Ensure uploads directory exists
    echo "📁 Ensuring uploads directory exists..."
    mkdir -p public/uploads
    
    # Fix ownership
    sudo chown -R $REMOTE_USER:$REMOTE_USER .

    # Install dependencies (Full Install required for build)
    echo "📥 Installing dependencies (npm ci)..."
    rm -rf node_modules
    npm ci --ignore-scripts
    
    # Stop PM2 to free memory for build
    echo "🛑 Stopping PM2 to free RAM for build..."
    pm2 stop all || true
    
    # Build on Server
    echo "📦 Building on server (Turbopack)..."
    npm run build
    
    # Update Nginx Configuration
    echo "🌐 Updating Nginx configuration..."
    sudo cp $REMOTE_DIR/resources/nginx.conf.template /etc/nginx/sites-available/crystalcred.co.zw
    sudo ln -sf /etc/nginx/sites-available/crystalcred.co.zw /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    
    # Ensure Nginx (www-data) can access uploads
    echo "🔐 Setting permissions for static file serving..."
    sudo chmod o+rx $REMOTE_DIR $REMOTE_DIR/public
    
    # Restart PM2
    echo "🔄 Starting Service..."
    pm2 start ecosystem.config.js --env production
    
    # Save PM2 list
    pm2 save
    
    # Cleanup staging
    rm -rf ~/deploy_staging
EOF

# Cleanup local archive
rm $ARCHIVE_NAME

# 5. Purge Cloudflare Cache
echo "🧹 Purging Cloudflare cache..."
CF_EMAIL="garikaib@gmail.com"
CF_KEY="5f2e114ea312d7fe910251b60f62e43ff892f"

# Get Zone ID
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=crystalcred.co.zw" \
     -H "X-Auth-Email: $CF_EMAIL" \
     -H "X-Auth-Key: $CF_KEY" \
     -H "Content-Type: application/json" | jq -r '.result[0].id')

if [ "$ZONE_ID" != "null" ] && [ -n "$ZONE_ID" ]; then
    # Purge everything
    PURGE_RESULT=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
         -H "X-Auth-Email: $CF_EMAIL" \
         -H "X-Auth-Key: $CF_KEY" \
         -H "Content-Type: application/json" \
         --data '{"purge_everything":true}')
    
    if echo "$PURGE_RESULT" | jq -e '.success' > /dev/null; then
        echo "✅ Cloudflare cache purged successfully!"
    else
        echo "⚠️ Cloudflare cache purge may have failed: $PURGE_RESULT"
    fi
else
    echo "⚠️ Could not find Cloudflare zone ID, skipping cache purge."
fi

echo "✅ Deployment Complete!"
