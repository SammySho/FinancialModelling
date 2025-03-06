#!/bin/bash
set -e

# Request SSL certificate if not already present
if [ ! -f "/etc/letsencrypt/live/backend.sammyshorthouse.com/fullchain.pem" ]; then
    echo "Requesting SSL certificate..."
    sudo certbot --nginx \
        -d backend.sammyshorthouse.com \
        --non-interactive \
        --agree-tos \
        --email sammy.shorthouse0@gmail.com \
        --preferred-challenges http
fi