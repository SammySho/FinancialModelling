#!/bin/bash
# Update system packages
sudo yum update -y

# Install Git, Python 3, and virtualenv
sudo yum install -y git python3
python3 -m ensurepip --default-pip
pip3 install virtualenv

# Define the deployment directory and Git repo URL
DEPLOY_DIR="/home/ec2-user/FinancialModelling"
REPO_URL="https://github.com/SammySho/FinancialModelling.git"

# Clone the repository if it doesn't exist
if [ ! -d "$DEPLOY_DIR" ]; then
    git clone $REPO_URL $DEPLOY_DIR
fi

cd $DEPLOY_DIR/backend

# Create (or update) a Python virtual environment
if [ ! -d "venv" ]; then
    virtualenv venv
fi

# Activate the virtual environment and install dependencies
source venv/bin/activate
pip install -r requirements.txt

# Create a systemd service file for FastAPI
SERVICE_FILE="/etc/systemd/system/fastapi.service"
sudo tee $SERVICE_FILE > /dev/null <<EOL
[Unit]
Description=FastAPI Backend Service
After=network.target

[Service]
User=ec2-user
WorkingDirectory=$DEPLOY_DIR/backend
ExecStart=$DEPLOY_DIR/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOL

# Reload systemd and start the FastAPI service
sudo systemctl daemon-reload
sudo systemctl enable fastapi
sudo systemctl restart fastapi
