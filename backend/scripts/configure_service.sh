#!/bin/bash
set -e

SERVICE_FILE="/etc/systemd/system/fastapi.service"

# Create systemd service file
echo "Creating FastAPI service..."
sudo tee $SERVICE_FILE > /dev/null <<EOF
[Unit]
Description=FastAPI Backend Service
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/FinancialModelling/backend
ExecStart=/home/ec2-user/FinancialModelling/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable fastapi.service