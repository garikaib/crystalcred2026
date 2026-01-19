#!/bin/bash

# Configuration
CF_EMAIL="garikaib@gmail.com"
CF_KEY="5f2e114ea312d7fe910251b60f62e43ff892f"
DOMAIN="crystalcred.co.zw"

# Get Zone ID
ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$DOMAIN" \
     -H "X-Auth-Email: $CF_EMAIL" \
     -H "X-Auth-Key: $CF_KEY" \
     -H "Content-Type: application/json" | jq -r '.result[0].id')

if [ "$ZONE_ID" == "null" ] || [ -z "$ZONE_ID" ]; then
    echo "❌ Could not find Zone ID for $DOMAIN"
    exit 1
fi

status() {
    echo "🔍 Cloudflare Proxy Status for $DOMAIN:"
    curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
         -H "X-Auth-Email: $CF_EMAIL" \
         -H "X-Auth-Key: $CF_KEY" \
         -H "Content-Type: application/json" | jq -r '.result[] | select(.type=="A" or .type=="CNAME") | "\(.proxied | if . then "🟠 ON " else "🌑 OFF" end) | \(.name) (\(.type)) -> \(.content)"'
    
    echo ""
    echo "🔒 SSL Setting:"
    curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
         -H "X-Auth-Email: $CF_EMAIL" \
         -H "X-Auth-Key: $CF_KEY" \
         -H "Content-Type: application/json" | jq -r '.result.value'
}

set_ssl() {
    local target_mode=$1
    echo "🔐 Setting SSL mode to $target_mode..."
    curl -s -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
         -H "X-Auth-Email: $CF_EMAIL" \
         -H "X-Auth-Key: $CF_KEY" \
         -H "Content-Type: application/json" \
         --data "{\"value\":\"$target_mode\"}" | jq -r '"Result: \(.success)"'
}

case "$1" in
    status)
        status
        ;;
    on)
        set_proxy true
        status
        ;;
    off)
        set_proxy false
        status
        ;;
    ssl)
        if [ -n "$2" ]; then
            set_ssl "$2"
        else
            echo "Current SSL mode:"
            curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
                 -H "X-Auth-Email: $CF_EMAIL" \
                 -H "X-Auth-Key: $CF_KEY" \
                 -H "Content-Type: application/json" | jq -r '.result.value'
        fi
        ;;
    *)
        echo "Usage: $0 {status|on|off|ssl [mode]}"
        echo "Modes: flexible, full, strict"
        exit 1
        ;;
esac
