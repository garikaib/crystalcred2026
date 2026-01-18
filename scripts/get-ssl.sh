#!/bin/bash

# Run lego with Cloudflare DNS-01 challenge
# Note: Requires CLOUDFLARE_EMAIL and CLOUDFLARE_DNS_API_TOKEN environment variables

if [ -z "$CLOUDFLARE_DNS_API_TOKEN" ]; then
    echo "Error: CLOUDFLARE_DNS_API_TOKEN is not set."
    exit 1
fi

lego --email "$CLOUDFLARE_EMAIL" \
     --dns cloudflare \
     --domains "next.crystalcred.co.zw" \
     --domains "*.crystalcred.co.zw" \
     run
