.PHONY: install setup-venv configure-nginx setup-ssl configure-service deploy all

# Default target
all: install setup-venv configure-nginx setup-ssl configure-service deploy

# Install system dependencies
install:
	@echo "Installing system dependencies..."
	@chmod +x scripts/install_dependencies.sh
	@./scripts/install_dependencies.sh

# Setup virtual environment
setup-venv:
	@echo "Setting up virtual environment..."
	@chmod +x scripts/setup_venv.sh
	@./scripts/setup_venv.sh

# Configure Nginx
configure-nginx:
	@echo "Configuring Nginx..."
	@chmod +x scripts/configure_nginx.sh
	@./scripts/configure_nginx.sh

# Setup SSL
setup-ssl:
	@echo "Setting up SSL..."
	@chmod +x scripts/setup_ssl.sh
	@./scripts/setup_ssl.sh

# Configure systemd service
configure-service:
	@echo "Configuring FastAPI service..."
	@chmod +x scripts/configure_service.sh
	@./scripts/configure_service.sh

# Deploy/Restart services
deploy:
	@echo "Deploying services..."
	@sudo systemctl restart fastapi.service
	@sudo systemctl reload nginx 