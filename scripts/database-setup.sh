#!/bin/bash

# Database Setup Script for Palette Builder
# This script sets up the PostgreSQL database and runs migrations

set -e

echo "🗄️ Setting up database for Palette Builder..."

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

# Database connection details
DB_HOST="192.168.1.12"
DB_PORT="5432"
DB_USER="devuser"
DB_PASSWORD="devpass123"
DB_NAME="devdb"

# Check if PostgreSQL is accessible
print_status "Checking PostgreSQL connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; then
    print_error "Cannot connect to PostgreSQL at $DB_HOST:$DB_PORT"
    print_error "Please ensure PostgreSQL is running and accessible."
    exit 1
fi

print_status "PostgreSQL connection verified ✓"

# Test database connection
print_status "Testing database connection..."
export PGPASSWORD=$DB_PASSWORD
if ! psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    print_error "Cannot connect to database '$DB_NAME'"
    print_error "Please ensure the database exists and user has proper permissions."
    exit 1
fi

print_status "Database connection verified ✓"

# Install dependencies first
print_status "Installing dependencies..."
npm install

# Run database migrations
print_status "Running database migrations..."
npm run db:push

print_status "Database setup completed successfully! 🎉"
print_status "Database: $DB_NAME"
print_status "Host: $DB_HOST:$DB_PORT"
print_status "User: $DB_USER"
