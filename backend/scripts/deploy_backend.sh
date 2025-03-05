#!/bin/bash
set -e

# Define variables
DEPLOY_DIR="/home/ec2-user/FinancialModelling"
REPO_URL="https://github.com/SammySho/FinancialModelling.git"
BACKEND_DIR="$DEPLOY_DIR/backend"
SERVICE_FILE="/etc/systemd/system/fastapi.service"

# # Ensure git is installed
# if ! command -v git >/dev/null 2>&1; then
#     echo "Git not found. Installing git..."
#     sudo yum install -y git
# fi

# # Function to clean and update repository
# clean_and_update_repo() {
#     local dir=$1
#     echo "Cleaning and updating repository in $dir..."
#     cd "$dir"
#     # Reset any local changes
#     git reset --hard HEAD
#     # Clean untracked files and directories
#     git clean -fd
#     # Pull latest changes
#     git fetch origin
#     git reset --hard origin/main
# }

# # Create the deployment directory if it doesn't exist
# if [ ! -d "$DEPLOY_DIR" ]; then
#     echo "Deployment directory not found. Creating and cloning repo..."
#     mkdir -p $DEPLOY_DIR
#     cd $DEPLOY_DIR
#     git clone $REPO_URL backend
# else
#     echo "Deployment directory exists."
#     # If backend directory doesn't exist, clone it; otherwise pull latest changes.
#     if [ ! -d "$BACKEND_DIR" ]; then
#         echo "Backend directory not found. Cloning backend..."
#         cd $DEPLOY_DIR
#         git clone $REPO_URL backend
#     else
#         echo "Backend directory exists. Cleaning and pulling latest changes..."
#         clean_and_update_repo "$BACKEND_DIR"
#     fi
# fi

# Move into the backend directory
cd $BACKEND_DIR

# Set up virtual environment if not present
if [ ! -d "venv" ]; then
    echo "Setting up virtual environment..."
    # First ensure python3-venv is installed
    if ! command -v python3-venv &> /dev/null; then
        echo "Installing python3-venv..."
        sudo yum install -y python3-venv
    fi
    
    # Remove any partial venv if it exists
    rm -rf venv
    
    # Create fresh venv
    python3 -m venv venv
    
    echo "Virtual environment created."
fi

# Ensure venv activation script exists
if [ ! -f "venv/bin/activate" ]; then
    echo "Virtual environment activation script not found. Recreating venv..."
    rm -rf venv
    python3 -m venv venv
    
    echo "Virtual environment created."
fi

# Activate the virtual environment and install dependencies
source venv/bin/activate
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "requirements.txt not found. Exiting."
    exit 1
fi

echo "Virtual environment activated."

# Create systemd service file if it doesn't exist
if [ ! -f "$SERVICE_FILE" ]; then
    echo "Systemd service file not found. Creating fastapi.service..."
    sudo tee $SERVICE_FILE > /dev/null <<EOF
[Unit]
Description=FastAPI Backend Service
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/FinancialModelling/backend
ExecStart=/home/ec2-user/FinancialModelling/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF
    sudo systemctl daemon-reload
    sudo systemctl enable fastapi.service
fi

# Always restart the service after deployment
echo "Restarting FastAPI service..."
sudo systemctl daemon-reload
sudo systemctl restart fastapi.service

# Wait a moment to check the service status
sleep 2
sudo systemctl status fastapi.service

echo "Deployment complete. FastAPI backend is now running and listening on port 8000."