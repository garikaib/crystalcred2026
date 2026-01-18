#!/bin/bash

# Configuration
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

# 1. Build Locally
if [ "$SKIP_BUILD" = false ]; then
    echo "📦 Building locally..."
    rm -rf .next
    npm run build -- --webpack 
    
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

# 3. Transfer Archive using rsync to Home Directory
echo "📤 Transferring files to $REMOTE_USER home..."
rsync -avP -e "ssh $SSH_OPTS" $ARCHIVE_NAME "$REMOTE_USER@$REMOTE_HOST:~/$ARCHIVE_NAME"

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

    # Unpack archive
    echo "📦 Unpacking archive..."
    sudo tar -I zstd -xf ~/$ARCHIVE_NAME -C $REMOTE_DIR
    
    # Cleanup remote archive
    rm ~/$ARCHIVE_NAME
    
    cd $REMOTE_DIR
    
    # Fix ownership
    sudo chown -R $REMOTE_USER:$REMOTE_USER .

    # Install dependencies
    echo "📥 Installing dependencies..."
    npm install --production --ignore-scripts
    
    # Restart PM2
    echo "🔄 Restarting Service..."
    pm2 reload crystalcred || pm2 start ecosystem.config.js --env production
    
    # Save PM2 list
    pm2 save
EOF

# Cleanup local archive
rm $ARCHIVE_NAME

echo "✅ Deployment Complete!"
