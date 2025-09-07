#!/bin/bash

# Palette Builder Deployment Script for Ubuntu Server
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting Palette Builder deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_warning "PM2 is not installed. Installing PM2..."
    npm install -g pm2
fi

# Check if PostgreSQL is running
if ! pg_isready -h 192.168.1.12 -p 5432 -U devuser &> /dev/null; then
    print_error "PostgreSQL is not accessible at 192.168.1.12:5432"
    print_error "Please ensure PostgreSQL is running and accessible."
    exit 1
fi

print_status "PostgreSQL connection verified ✓"

# Install dependencies
print_status "Installing dependencies..."
npm install

# Run database migrations
print_status "Running database migrations..."
npm run db:push

# Build the application
print_status "Building the application..."
npm run build

# Stop existing PM2 process if running
print_status "Stopping existing PM2 process..."
pm2 stop palettebuilder 2>/dev/null || true
pm2 delete palettebuilder 2>/dev/null || true

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start npm --name "palettebuilder" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

print_status "Deployment completed successfully! 🎉"
print_status "Application is running on http://192.168.1.12:3000"
print_status "Use 'pm2 status' to check application status"
print_status "Use 'pm2 logs palettebuilder' to view logs"
print_status "Use 'pm2 restart palettebuilder' to restart the application"
