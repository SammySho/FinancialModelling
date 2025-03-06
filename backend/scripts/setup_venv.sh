#!/bin/bash
set -e

BACKEND_DIR="/home/ec2-user/FinancialModelling/backend"
cd $BACKEND_DIR

# Set up virtual environment
echo "Setting up virtual environment..."
rm -rf venv
python3 -m venv venv

# Activate and install dependencies
source venv/bin/activate
if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt
else
    echo "requirements.txt not found. Exiting."
    exit 1
fi