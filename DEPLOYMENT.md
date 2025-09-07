# Ubuntu Server Deployment Guide

This guide will help you deploy Palette Builder on your Ubuntu server with PostgreSQL database.

## Prerequisites

- Ubuntu Server (18.04 or later)
- PostgreSQL running on `192.168.1.12:5432`
- Database: `devdb`
- User: `devuser`
- Password: `devpass123`

## Quick Setup

### 1. Initial Server Setup

Run the server setup script to install all required dependencies:

```bash
# On your Ubuntu server
git clone <your-repository-url> /var/www/palettebuilder
cd /var/www/palettebuilder
npm run setup-server
```

### 2. Environment Configuration

Copy the production environment file and update with your values:

```bash
cp env.production.example .env
# Edit .env with your specific configuration
```

### 3. Database Setup

Set up the database and run migrations:

```bash
npm run setup-db
```

### 4. Deploy Application

Deploy the application with PM2:

```bash
npm run deploy
```

## Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install PostgreSQL client
sudo apt install -y postgresql-client

# Install Git
sudo apt install -y git
```

### 2. Clone Repository

```bash
sudo mkdir -p /var/www/palettebuilder
sudo chown $USER:$USER /var/www/palettebuilder
git clone <your-repository-url> /var/www/palettebuilder
cd /var/www/palettebuilder
```

### 3. Install Application Dependencies

```bash
npm install
```

### 4. Configure Environment

```bash
cp env.production.example .env
# Edit .env file with your configuration
```

### 5. Setup Database

```bash
npm run db:push
```

### 6. Build Application

```bash
npm run build
```

### 7. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Management Commands

### PM2 Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs palettebuilder

# Restart application
pm2 restart palettebuilder

# Stop application
pm2 stop palettebuilder

# Delete application
pm2 delete palettebuilder
```

### Database Commands

```bash
# Run migrations
npm run db:push

# Generate new migration
npm run db:generate

# View database
psql -h 192.168.1.12 -p 5432 -U devuser -d devdb
```

## Nginx Configuration (Optional)

If you want to use Nginx as a reverse proxy:

```bash
# Install Nginx
sudo apt install -y nginx

# Copy configuration
sudo cp /etc/nginx/sites-available/palettebuilder /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/palettebuilder /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

## Accessing Your Application

- **Application**: http://192.168.1.12:3000
- **Nginx Proxy**: http://192.168.1.12 (if configured)
- **Database**: 192.168.1.12:5432
- **Adminer**: http://192.168.1.12:8080
- **pgAdmin**: http://192.168.1.12:5050

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
pg_isready -h 192.168.1.12 -p 5432 -U devuser

# Test database access
psql -h 192.168.1.12 -p 5432 -U devuser -d devdb -c "SELECT 1;"
```

### Application Issues

```bash
# Check PM2 logs
pm2 logs palettebuilder

# Check application status
pm2 status

# Restart application
pm2 restart palettebuilder
```

### Port Issues

```bash
# Check if port 3000 is in use
sudo netstat -tlnp | grep :3000

# Kill process on port 3000
sudo fuser -k 3000/tcp
```

## Security Considerations

1. **Firewall**: Ensure only necessary ports are open
2. **Database**: Use strong passwords and limit access
3. **SSL**: Consider setting up SSL certificates
4. **Updates**: Keep system and dependencies updated

## Backup

### Database Backup

```bash
# Create backup
pg_dump -h 192.168.1.12 -p 5432 -U devuser devdb > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -h 192.168.1.12 -p 5432 -U devuser devdb < backup_file.sql
```

### Application Backup

```bash
# Backup application files
tar -czf palettebuilder_backup_$(date +%Y%m%d_%H%M%S).tar.gz /var/www/palettebuilder
```
