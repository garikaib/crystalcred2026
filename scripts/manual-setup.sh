#!/bin/bash

# Configuration
DOMAIN="next.crystalcred.co.zw"
EMAIL="garikaib@gmail.com"
CF_TOKEN="5f2e114ea312d7fe910251b60f62e43ff892f" # Global Key from user
LEGO_VERSION="v4.17.1"

echo "Starting Manual Remote Setup..."

# 1. Install Lego (if missing)
if ! command -v lego &> /dev/null; then
    echo "Installing Lego..."
    curl -Ls https://github.com/go-acme/lego/releases/download/${LEGO_VERSION}/lego_${LEGO_VERSION}_linux_amd64.tar.gz | tar xz -C /usr/local/bin lego
    chmod +x /usr/local/bin/lego
fi

# 2. Request SSL Certificate (Cloudflare DNS)
echo "Requesting SSL for $DOMAIN..."
export CLOUDFLARE_DNS_API_TOKEN="$CF_TOKEN" # Lego uses this env var for CF DNS
# Or for Global Key:
export CLOUDFLARE_EMAIL="$EMAIL"
export CLOUDFLARE_API_KEY="$CF_TOKEN"

# Stop Nginx temporarily if using HTTP challenge (not needed for DNS, but good primarily)
# systemctl stop nginx

mkdir -p /etc/lego
lego --email "$EMAIL" --dns cloudflare --domains "$DOMAIN" --domains "*.$DOMAIN" --path /etc/lego run

# 3. Configure Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    server_name $DOMAIN *.$DOMAIN;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN *.$DOMAIN;

    ssl_certificate /etc/lego/certificates/$DOMAIN.crt;
    ssl_certificate_key /etc/lego/certificates/$DOMAIN.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test & Reload Nginx
nginx -t && systemctl reload nginx

echo "Manual Setup Complete!"
