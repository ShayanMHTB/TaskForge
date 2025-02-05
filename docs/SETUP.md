# ⚙️ TaskForge Setup & Deployment Guide

**Complete guide for setting up TaskForge in development and production environments**

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Development Setup](#-development-setup)
- [Production Setup](#-production-setup)
- [Docker Setup](#-docker-setup)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)

---

## 🛠️ Prerequisites

### System Requirements

**Development:**

- **PHP 8.3+** with extensions:
  - BCMath, Ctype, cURL, DOM, Fileinfo, JSON, Mbstring, OpenSSL, PCRE, PDO, SQLite3, Tokenizer, XML
- **Node.js 20+** (LTS recommended)
- **Composer 2.x**
- **Git**
- **SQLite** (included with PHP) or **PostgreSQL 13+**

**Production (Additional):**

- **Web Server:** Nginx 1.20+ or Apache 2.4+
- **Process Manager:** Supervisor or systemd
- **SSL Certificate** (Let's Encrypt recommended)

### Package Managers

```bash
# Verify installations
php --version        # Should show 8.3+
node --version       # Should show 20+
composer --version   # Should show 2.x
git --version        # Any recent version
```

---

## 🚀 Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/taskforge.git
cd taskforge
```

### 2. Backend Setup (srv/)

```bash
cd srv

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create SQLite database
touch database/database.sqlite

# Run migrations and seed data
php artisan migrate --seed

# Optional: Create symbolic link for storage
php artisan storage:link

# Start development server
php artisan serve --port=8000
```

The backend will be available at: `http://localhost:8000`

### 3. Frontend Setup (web/)

```bash
cd ../web

# Install Node.js dependencies
npm install
# or with yarn
yarn install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
# or with yarn
yarn dev
```

The frontend will be available at: `http://localhost:5173`

### 4. Verify Installation

1. **Backend Health Check:**

   ```bash
   curl http://localhost:8000/api/health
   ```

2. **Frontend Access:**
   Open `http://localhost:5173` in your browser

3. **API Documentation:**
   Visit `http://localhost:8000/docs` (if API docs are enabled)

---

## 🏭 Production Setup

### 1. Server Preparation

**Ubuntu 22.04 LTS Example:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.3 and extensions
sudo apt install software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install php8.3 php8.3-fpm php8.3-cli php8.3-common \
  php8.3-mysql php8.3-sqlite3 php8.3-curl php8.3-xml \
  php8.3-mbstring php8.3-zip php8.3-bcmath php8.3-intl

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs

# Install Nginx
sudo apt install nginx

# Install PostgreSQL (optional)
sudo apt install postgresql postgresql-contrib
```

### 2. Application Deployment

```bash
# Clone to production directory
sudo git clone https://github.com/yourusername/taskforge.git /var/www/taskforge
cd /var/www/taskforge

# Set permissions
sudo chown -R www-data:www-data /var/www/taskforge
sudo chmod -R 755 /var/www/taskforge
sudo chmod -R 775 /var/www/taskforge/srv/storage
sudo chmod -R 775 /var/www/taskforge/srv/bootstrap/cache
```

### 3. Backend Production Setup

```bash
cd /var/www/taskforge/srv

# Install dependencies (production)
composer install --optimize-autoloader --no-dev

# Copy and configure environment
sudo cp .env.example .env
sudo nano .env  # Configure production settings

# Generate key and optimize
php artisan key:generate
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Set final permissions
sudo chown -R www-data:www-data storage bootstrap/cache
```

### 4. Frontend Production Build

```bash
cd /var/www/taskforge/web

# Install dependencies
npm ci --only=production

# Build for production
npm run build

# The built files will be in /dist directory
```

### 5. Nginx Configuration

Create `/etc/nginx/sites-available/taskforge`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Frontend (SPA)
    root /var/www/taskforge/web/dist;
    index index.html;

    # Frontend routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        alias /var/www/taskforge/srv/public;
        try_files $uri $uri/ @backend;

        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $request_filename;
            include fastcgi_params;
        }
    }

    location @backend {
        rewrite ^/api/(.*)$ /api/index.php?/$1 last;
    }

    # Laravel public assets
    location /storage {
        alias /var/www/taskforge/srv/storage/app/public;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/taskforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Process Management

Create `/etc/supervisor/conf.d/taskforge-worker.conf`:

```ini
[program:taskforge-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/taskforge/srv/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/taskforge/srv/storage/logs/worker.log
stopwaitsecs=3600
```

Start the worker:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start taskforge-worker:*
```

---

## 🐳 Docker Setup

### Docker Compose Configuration

Create `docker-compose.yml` in the project root:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./srv
      dockerfile: Dockerfile
    container_name: taskforge-backend
    ports:
      - '8000:8000'
    volumes:
      - ./srv:/var/www/html
      - ./srv/storage:/var/www/html/storage
    environment:
      - APP_ENV=local
      - DB_CONNECTION=pgsql
      - DB_HOST=database
      - DB_PORT=5432
      - DB_DATABASE=taskforge
      - DB_USERNAME=taskforge
      - DB_PASSWORD=password
    depends_on:
      - database
    networks:
      - taskforge

  frontend:
    build:
      context: ./web
      dockerfile: Dockerfile
    container_name: taskforge-frontend
    ports:
      - '3000:3000'
    volumes:
      - ./web:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:8000/api
    depends_on:
      - backend
    networks:
      - taskforge

  database:
    image: postgres:15
    container_name: taskforge-database
    ports:
      - '5432:5432'
    environment:
      POSTGRES_DB: taskforge
      POSTGRES_USER: taskforge
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - taskforge

  redis:
    image: redis:7-alpine
    container_name: taskforge-redis
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - taskforge

  nginx:
    image: nginx:alpine
    container_name: taskforge-nginx
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./web/dist:/var/www/frontend
      - ./srv/public:/var/www/backend
    depends_on:
      - backend
      - frontend
    networks:
      - taskforge

volumes:
  postgres_data:
  redis_data:

networks:
  taskforge:
    driver: bridge
```

### Backend Dockerfile

Create `srv/Dockerfile`:

```dockerfile
FROM php:8.3-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql pdo_pgsql pdo_sqlite mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 8000

# Start PHP-FPM server
CMD php artisan serve --host=0.0.0.0 --port=8000
```

### Frontend Dockerfile

Create `web/Dockerfile`:

```dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build for production (commented out for development)
# RUN npm run build

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Docker Usage

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Run Laravel commands
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed

# Stop services
docker-compose down

# Rebuild services
docker-compose build --no-cache
docker-compose up -d
```

---

## 🔧 Environment Configuration

### Backend Environment (.env)

**Development (`srv/.env`):**

```env
APP_NAME="TaskForge"
APP_ENV=local
APP_KEY=base64:GENERATED_KEY_HERE
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_TIMEZONE=UTC

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite
# For PostgreSQL:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=taskforge
# DB_USERNAME=taskforge
# DB_PASSWORD=password

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
FRONTEND_URL=http://localhost:5173

VITE_APP_NAME="${APP_NAME}"
```

**Production (`srv/.env`):**

```env
APP_NAME="TaskForge"
APP_ENV=production
APP_KEY=base64:GENERATED_PRODUCTION_KEY
APP_DEBUG=false
APP_URL=https://yourdomain.com
APP_TIMEZONE=UTC

LOG_CHANNEL=daily
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=taskforge_production
DB_USERNAME=taskforge_user
DB_PASSWORD=secure_production_password

BROADCAST_DRIVER=redis
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=redis_password
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourdomain.com"
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
SESSION_DOMAIN=yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Additional production settings
TELESCOPE_ENABLED=false
DEBUGBAR_ENABLED=false
```

### Frontend Environment (.env)

**Development (`web/.env`):**

```env
VITE_APP_NAME="TaskForge"
VITE_API_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:5173
VITE_APP_ENV=development
```

**Production (`web/.env`):**

```env
VITE_APP_NAME="TaskForge"
VITE_API_URL=https://yourdomain.com/api
VITE_APP_URL=https://yourdomain.com
VITE_APP_ENV=production
```

---

## 🗄️ Database Setup

### SQLite (Development)

```bash
cd srv

# Create database file
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed with sample data
php artisan db:seed
```

### PostgreSQL (Production)

```bash
# Create database and user
sudo -u postgres psql
```

```sql
CREATE DATABASE taskforge_production;
CREATE USER taskforge_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE taskforge_production TO taskforge_user;
\q
```

```bash
# Update .env with PostgreSQL settings
cd srv
php artisan migrate --force
```

### Database Backup & Restore

**SQLite Backup:**

```bash
# Backup
cp srv/database/database.sqlite backup_$(date +%Y%m%d).sqlite

# Restore
cp backup_20250720.sqlite srv/database/database.sqlite
```

**PostgreSQL Backup:**

```bash
# Backup
pg_dump -h localhost -U taskforge_user taskforge_production > backup_$(date +%Y%m%d).sql

# Restore
psql -h localhost -U taskforge_user taskforge_production < backup_20250720.sql
```

---

## 🧪 Testing

### Backend Testing

```bash
cd srv

# Run all tests
php artisan test

# Run with coverage
php artisan test --coverage

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run specific test file
php artisan test tests/Feature/AuthTest.php

# Run with parallel execution
php artisan test --parallel

# Create test database
php artisan migrate --env=testing
```

**Test Environment (`srv/.env.testing`):**

```env
APP_ENV=testing
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
CACHE_DRIVER=array
QUEUE_CONNECTION=sync
SESSION_DRIVER=array
```

### Frontend Testing

```bash
cd web

# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test TaskCard.test.js

# Run E2E tests
npm run test:e2e

# Run tests in watch mode
npm run test:watch
```

### Testing Commands

**Backend Test Commands:**

```bash
# Generate test
php artisan make:test UserCanCreateTaskTest

# Generate feature test
php artisan make:test --feature TaskManagementTest

# Generate unit test
php artisan make:test --unit TaskServiceTest
```

**Frontend Test Commands:**

```bash
# Generate component test
npm run test:generate ComponentName

# Update snapshots
npm run test -- --update-snapshots
```

---

## 🔍 Troubleshooting

### Common Issues

**1. Permission Errors (Laravel)**

```bash
# Fix storage permissions
sudo chown -R www-data:www-data srv/storage srv/bootstrap/cache
sudo chmod -R 775 srv/storage srv/bootstrap/cache

# Clear all caches
cd srv
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

**2. CORS Issues**

```bash
# Check SANCTUM_STATEFUL_DOMAINS in .env
# Ensure it matches your frontend URL
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

**3. Database Connection Issues**

```bash
# SQLite - Check file permissions
ls -la srv/database/database.sqlite
sudo chown www-data:www-data srv/database/database.sqlite

# PostgreSQL - Test connection
php srv/artisan tinker
DB::connection()->getPdo();
```

**4. Frontend Build Issues**

```bash
# Clear node modules and reinstall
cd web
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run build -- --force
```

**5. Session/Authentication Issues**

```bash
# Generate new app key
cd srv
php artisan key:generate

# Clear sessions
php artisan session:flush

# Check session configuration
php artisan config:show session
```

### Debugging Tools

**Backend Debugging:**

```bash
# Enable query logging
cd srv
php artisan tinker
DB::enableQueryLog();
// Run some operations
DB::getQueryLog();

# Check application logs
tail -f srv/storage/logs/laravel.log

# Debug with Tinker
php artisan tinker
```

**Frontend Debugging:**

```bash
# Check build output
cd web
npm run build

# Analyze bundle size
npm run build -- --analyze

# Check for linting issues
npm run lint
```

### Performance Optimization

**Backend Optimization:**

```bash
cd srv

# Enable OPcache (production)
# Add to php.ini:
# opcache.enable=1
# opcache.memory_consumption=256
# opcache.max_accelerated_files=20000

# Optimize Composer autoloader
composer install --optimize-autoloader --no-dev

# Cache everything (production)
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

**Frontend Optimization:**

```bash
cd web

# Analyze bundle
npm run build -- --analyze

# Enable compression in Nginx
# Add to nginx.conf:
# gzip on;
# gzip_types text/css application/javascript application/json;
```

### Monitoring & Logs

**Log Files:**

- Laravel: `srv/storage/logs/laravel.log`
- Nginx: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- PHP-FPM: `/var/log/php8.3-fpm.log`
- System: `/var/log/syslog`

**Health Checks:**

```bash
# Backend health
curl http://localhost:8000/api/health

# Database connection
cd srv && php artisan tinker
DB::connection()->getPdo();

# Frontend build verification
cd web && npm run build
```

This completes the comprehensive setup and deployment guide for TaskForge!
