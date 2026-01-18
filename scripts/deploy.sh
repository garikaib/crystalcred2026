#!/bin/bash

# Configuration
cd "$(dirname "$0")/.." # Ensure we are in the project root
REMOTE_HOST="51.195.252.90"
REMOTE_USER="ubuntu"
DOMAIN="next.crystalcred.co.zw"
REMOTE_DIR="/var/www/$DOMAIN"
SSH_OPTS="-o StrictHostKeyChecking=no" 
ARCHIVE_NAME="deploy.tar.zst"

SKIP_BUILD=false
if [[ "$*" == *"--skip-build"* ]]; then
    SKIP_BUILD=true
fi

echo "🚀 Deploying to $REMOTE_USER@$REMOTE_HOST"

# 1. Build Locally
# 1. Build Locally
if [ "$SKIP_BUILD" = false ]; then
    echo "📦 Building locally..."
    
    # Temporarily move .env.local so next build picks up .env.production
    if [ -f .env.local ]; then
        echo "🔄 Swapping environment files for production build..."
        mv .env.local .env.local.backup
    fi
    
    # Ensure cleanup happens even if build fails
    trap 'if [ -f .env.local.backup ]; then mv .env.local.backup .env.local; echo "🔄 Restored .env.local"; fi' EXIT

    rm -rf .next
    npm run build
    
    # Restore .env.local immediately after build
    if [ -f .env.local.backup ]; then
        mv .env.local.backup .env.local
        echo "🔄 Restored .env.local"
    fi
    
    # Remove trap as we handled it
    trap - EXIT
    
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Aborting deployment."
        exit 1
    fi
else
    echo "⏭️ Skipping build as requested."
fi

# 2. Create Archive
echo "📚 Creating archive..."
tar --exclude='node_modules' --exclude='.git' --exclude='.next/cache' --exclude='.next/dev' -cf - \
    .next \
    public \
    package.json \
    next.config.mjs \
    ecosystem.config.js \
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
    # Create directory if it doesn't exist
    sudo mkdir -p $REMOTE_DIR
    sudo chown $REMOTE_USER:$REMOTE_USER $REMOTE_DIR

    # Clean remote cache (Nuke it)
    echo "🧹 Cleaning remote cache..."
    sudo rm -rf $REMOTE_DIR/.next

    # Unpack archive
    echo "📦 Unpacking archive..."
    sudo tar -I zstd -xf ~/$ARCHIVE_NAME -C $REMOTE_DIR
    
    # Move environment file
    echo "🔑 Updating environment variables..."
    mv ~/.env $REMOTE_DIR/.env
    
    # Cleanup remote archive
    rm ~/$ARCHIVE_NAME
    
    cd $REMOTE_DIR
    
    # Fix ownership
    sudo chown -R $REMOTE_USER:$REMOTE_USER .

    # Install dependencies
    echo "📥 Installing dependencies..."
    npm install --omit=dev --ignore-scripts
    
    # Flush Nginx cache
    echo "🧹 Flushing Nginx cache..."
    sudo rm -rf /var/cache/nginx/*
    sudo systemctl reload nginx
    
    # Restart PM2
    echo "🔄 Restarting Service..."
    pm2 reload crystalcred || pm2 start ecosystem.config.js --env production
    
    # Save PM2 list
    pm2 save
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
