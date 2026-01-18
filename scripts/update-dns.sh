#!/bin/bash

# Configuration
SERVER_IP="51.195.252.90"
DOMAIN="next.crystalcred.co.zw"
CF_EMAIL="garikaib@gmail.com"
CF_KEY="5f2e114ea312d7fe910251b60f62e43ff892f"

if [ -z "$SERVER_IP" ]; then
    echo "Error: SERVER_IP is not set."
    exit 1
fi

if [ -z "$CF_KEY" ]; then
    echo "Error: CF_KEY (Cloudflare Global Key) is not set."
    exit 1
fi

echo "Updating DNS for $DOMAIN to point to $SERVER_IP..."

# Get Zone ID
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=crystalcred.co.zw" \
     -H "X-Auth-Email: $CF_EMAIL" \
     -H "X-Auth-Key: $CF_KEY" \
     -H "Content-Type: application/json" | jq -r '.result[0].id')

if [ "$ZONE_ID" == "null" ]; then
    echo "Error: Could not find zone for crystalcred.co.zw"
    exit 1
fi

echo "Found Zone ID: $ZONE_ID"

# Get Record ID (if exists)
RECORD_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?type=A&name=$DOMAIN" \
     -H "X-Auth-Email: $CF_EMAIL" \
     -H "X-Auth-Key: $CF_KEY" \
     -H "Content-Type: application/json" | jq -r '.result[0].id')

if [ "$RECORD_ID" != "null" ]; then
    echo "Updating existing record $RECORD_ID..."
    curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$RECORD_ID" \
         -H "X-Auth-Email: $CF_EMAIL" \
         -H "X-Auth-Key: $CF_KEY" \
         -H "Content-Type: application/json" \
         --data "{\"type\":\"A\",\"name\":\"$DOMAIN\",\"content\":\"$SERVER_IP\",\"ttl\":1,\"proxied\":true}"
else
    echo "Creating new record..."
    curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
         -H "X-Auth-Email: $CF_EMAIL" \
         -H "X-Auth-Key: $CF_KEY" \
         -H "Content-Type: application/json" \
         --data "{\"type\":\"A\",\"name\":\"$DOMAIN\",\"content\":\"$SERVER_IP\",\"ttl\":1,\"proxied\":true}"
fi

echo -e "\nDNS Update Complete."
