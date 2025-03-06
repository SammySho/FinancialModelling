#!/bin/bash
set -e

NGINX_CONF="/etc/nginx/conf.d/backend.conf"

# Create or update Nginx configuration
echo "Configuring Nginx..."
sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    server_name backend.sammyshorthouse.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
EOF

# Test and reload Nginx
echo "Testing Nginx configuration..."
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx