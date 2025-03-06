# #!/bin/bash
# set -e

# # Define variables
# DEPLOY_DIR="/home/ec2-user/FinancialModelling"
# REPO_URL="https://github.com/SammySho/FinancialModelling.git"
# BACKEND_DIR="$DEPLOY_DIR/backend"
# SERVICE_FILE="/etc/systemd/system/fastapi.service"
# NGINX_CONF="/etc/nginx/conf.d/backend.conf"

# # Move into the backend directory
# cd $BACKEND_DIR

# # Set up virtual environment if not present
# if [ ! -d "venv" ]; then
#     echo "Setting up virtual environment..."
#     # First ensure python3-venv is installed
#     if ! command -v python3-venv &> /dev/null; then
#         echo "Installing python3-venv..."
#         sudo yum install -y python3 python3-pip
#     fi
    
#     # Remove any partial venv if it exists
#     rm -rf venv
    
#     # Create fresh venv
#     python3 -m venv venv
    
#     echo "Virtual environment created."
# fi

# # Ensure venv activation script exists
# if [ ! -f "venv/bin/activate" ]; then
#     echo "Virtual environment activation script not found. Recreating venv..."
#     rm -rf venv
#     python3 -m venv venv
# fi

# # Activate the virtual environment and install dependencies
# echo "Activating virtual environment..."
# source venv/bin/activate
# if [ -f "requirements.txt" ]; then
#     echo "Installing dependencies..."
#     pip install -r requirements.txt
# else
#     echo "requirements.txt not found. Exiting."
#     exit 1
# fi

# echo "Virtual environment activated."

# # Install nginx and certbot if not present
# if ! command -v nginx &> /dev/null; then
#     echo "Installing nginx..."
#     sudo yum install -y nginx
# fi

# if ! command -v certbot &> /dev/null; then
#     echo "Installing certbot..."
#     sudo yum install -y certbot python3-certbot-nginx
# fi

# # Create systemd service file if it doesn't exist
# if [ ! -f "$SERVICE_FILE" ]; then
#     echo "Systemd service file not found. Creating fastapi.service..."
#     sudo tee $SERVICE_FILE > /dev/null <<EOF
# [Unit]
# Description=FastAPI Backend Service
# After=network.target

# [Service]
# User=ec2-user
# WorkingDirectory=/home/ec2-user/FinancialModelling/backend
# ExecStart=/home/ec2-user/FinancialModelling/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
# Restart=always

# [Install]
# WantedBy=multi-user.target
# EOF
#     sudo systemctl daemon-reload
#     sudo systemctl enable fastapi.service
# fi

# # Create or update Nginx configuration
# echo "Configuring Nginx..."
# sudo tee $NGINX_CONF > /dev/null <<EOF
# server {
#     server_name backend.sammyshorthouse.com;
    
#     location / {
#         proxy_pass http://127.0.0.1:8000;
#         proxy_set_header Host \$host;
#         proxy_set_header X-Real-IP \$remote_addr;
#         proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto \$scheme;
#     }

#     # Additional recommended security headers
#     add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
#     add_header X-Content-Type-Options nosniff;
#     add_header X-Frame-Options DENY;
#     add_header X-XSS-Protection "1; mode=block";
# }
# EOF

# # Test Nginx configuration
# echo "Testing Nginx configuration..."
# sudo nginx -t

# # Start and enable Nginx if not already running
# sudo systemctl start nginx
# sudo systemctl enable nginx

# # Request SSL certificate if not already present
# if [ ! -f "/etc/letsencrypt/live/backend.sammyshorthouse.com/fullchain.pem" ]; then
#     echo "Requesting SSL certificate..."
#     # Using a temporary email for registration
#     sudo certbot --nginx -d backend.sammyshorthouse.com --non-interactive --agree-tos --email sammy.shorthouse0@gmail.com --preferred-challenges http
# fi

# # Always restart the services after deployment
# echo "Restarting services..."
# sudo systemctl daemon-reload
# sudo systemctl restart fastapi.service
# sudo systemctl reload nginx

# # Wait a moment to check the service status
# sleep 2
# sudo systemctl status fastapi.service

# echo "Deployment complete. FastAPI backend is now running securely with HTTPS on backend.sammyshorthouse.com"