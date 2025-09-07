#!/bin/bash

# Ubuntu Server Setup Script for Palette Builder
# Run this script on your Ubuntu server to set up the environment

set -e

echo "🔧 Setting up Ubuntu server for Palette Builder..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Update system packages
print_header "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
print_header "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
print_header "Installing PM2..."
sudo npm install -g pm2

# Install PostgreSQL client tools
print_header "Installing PostgreSQL client tools..."
sudo apt install -y postgresql-client

# Install Git
print_header "Installing Git..."
sudo apt install -y git

# Install Nginx (optional, for reverse proxy)
print_header "Installing Nginx..."
sudo apt install -y nginx

# Create application directory
print_header "Creating application directory..."
sudo mkdir -p /var/www/palettebuilder
sudo chown $USER:$USER /var/www/palettebuilder

# Setup Nginx configuration
print_header "Setting up Nginx configuration..."
sudo tee /etc/nginx/sites-available/palettebuilder > /dev/null <<EOF
server {
    listen 80;
    server_name 192.168.1.12;

    location / {
        proxy_pass http://localhost:3101;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/palettebuilder /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Setup firewall
print_header "Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 3101/tcp
sudo ufw --force enable

print_status "Server setup completed successfully! 🎉"
print_status "Next steps:"
print_status "1. Clone your repository: git clone <your-repo-url> /var/www/palettebuilder"
print_status "2. Copy env.production.example to .env and update with your values"
print_status "3. Run ./scripts/deploy.sh to deploy the application"
print_status "4. Your application will be available at http://192.168.1.12:3101"
