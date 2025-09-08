#!/bin/bash

# Install Dependencies Script for Palette Builder
# This script ensures all required dependencies are installed

set -e

echo "📦 Installing dependencies for Palette Builder..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Install dependencies
print_status "Installing project dependencies..."
npm install

# Check if drizzle-kit is available
if ! npx drizzle-kit --version &> /dev/null; then
    print_warning "drizzle-kit not found in node_modules. Installing globally..."
    npm install -g drizzle-kit
fi

print_status "Dependencies installed successfully! 🎉"
print_status "You can now run: npm run db:push"
