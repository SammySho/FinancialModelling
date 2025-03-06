#!/bin/bash
set -e

# Ensure system dependencies are installed
echo "Installing system dependencies..."
if ! command -v git &> /dev/null; then
    sudo yum install -y git
fi

if ! command -v nginx &> /dev/null; then
    sudo yum install -y nginx
fi

if ! command -v certbot &> /dev/null; then
    sudo yum install -y certbot python3-certbot-nginx
fi

if ! command -v python3-venv &> /dev/null; then
    sudo yum install -y python3 python3-pip
fi