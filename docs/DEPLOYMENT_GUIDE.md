# 🚀 Creatify Production Deployment Guide

Complete step-by-step guide to deploy Creatify to production with email authentication.

---

## 📋 Prerequisites

- [ ] Domain purchased (e.g., creatify.app)
- [ ] Server access (AWS, DigitalOcean, Heroku, or similar)
- [ ] Node.js v18+ installed
- [ ] Git repository setup
- [ ] Email service account (SendGrid recommended)
- [ ] Database setup (PostgreSQL recommended)
- [ ] SSL certificate (auto with Let's Encrypt)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────┐
│         End User (Browser)              │
│  http://creatify.app                    │
└─────────────────────────────────────────┘
                    ↓
        ┌───────────────────────┐
        │  CDN (Optional)       │
        │  Cloudflare / AWS CF  │
        └───────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Frontend Server (Port 3000)           │
│   React + Vite (Static Files)           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│   Backend API (Port 3001)               │
│   Node.js + Express                     │
├─────────────────────────────────────────┤
│   - Authentication                      │
│   - OTP Email Service                   │
│   - Project Management                  │
│   - User Database                       │
└─────────────────────────────────────────┘
           ↓                     ↓
     ┌─────────────┐      ┌──────────────┐
     │ PostgreSQL  │      │ SMTP Service │
     │  Database   │      │  (SendGrid)  │
     └─────────────┘      └──────────────┘
```

---

## 🌐 Option 1: Deploy on DigitalOcean (Recommended)

### 1. Create Droplet

```bash
# 1. Go to https://www.digitalocean.com
# 2. Create → Droplets
# 3. Select:
#    - OS: Ubuntu 22.04
#    - Size: Basic ($5-12/month)
#    - Region: Closest to users
#    - Authentication: SSH Key
# 4. Create Droplet
```

### 2. Initial Server Setup

```bash
# SSH into droplet
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Certbot (SSL certificates)
apt install -y certbot python3-certbot-nginx
```

### 3. Setup Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE creatify;

# Create user
CREATE USER creatify_user WITH ENCRYPTED PASSWORD 'strong-password-here';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE creatify TO creatify_user;

# Exit
\q
```

### 4. Clone Project

```bash
# Create app directory
mkdir -p /var/www/creatify
cd /var/www/creatify

# Clone repository
git clone https://github.com/yourusername/creatify.git .

# Install dependencies
npm install
cd server && npm install && cd ..
```

### 5. Setup Environment Variables

```bash
# Create backend .env
cat > server/.env << 'EOF'
PORT=3001
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_URL=postgresql://creatify_user:strong-password@localhost:5432/creatify
FRONTEND_URL=https://creatify.app
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_key_here
SMTP_FROM=noreply@creatify.app
EOF

# Create frontend .env
cat > .env << 'EOF'
VITE_API_URL=https://api.creatify.app/api
EOF

# Secure permissions
chmod 600 server/.env
```

### 6. Build Frontend

```bash
npm run build

# Output files in ./dist
ls dist/
```

### 7. Configure Nginx

```bash
# Create Nginx config
cat > /etc/nginx/sites-available/creatify << 'EOF'
# Frontend
server {
    listen 80;
    server_name creatify.app www.creatify.app;
    
    root /var/www/creatify/dist;
    index index.html;
    
    # React routing
    location / {
        try_files $uri /index.html;
    }
    
    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API
server {
    listen 80;
    server_name api.creatify.app;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/creatify /etc/nginx/sites-enabled/

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx
```

### 8. Setup SSL Certificate

```bash
# Get SSL with Let's Encrypt
certbot --nginx -d creatify.app -d www.creatify.app -d api.creatify.app

# Auto-renew
certbot renew --dry-run
```

### 9. Start Backend with PM2

```bash
# Start server
cd /var/www/creatify/server
pm2 start index.js --name creatify-api

# Save PM2 config
pm2 save

# Setup auto-restart on boot
pm2 startup
pm2 save
```

### 10. Verify Deployment

```bash
# Check services
pm2 status
systemctl status nginx
systemctl status postgresql

# Test API
curl https://api.creatify.app/api/health

# Check logs
pm2 logs creatify-api
```

---

## ☁️ Option 2: Deploy on AWS (EC2 + RDS)

### 1. Create EC2 Instance

```bash
# AWS Console → EC2 → Instances
# Launch Instance:
#   - AMI: Ubuntu 22.04 LTS
#   - Type: t3.medium
#   - Security Group: Allow 80, 443, 3001
#   - Key Pair: Create new (save .pem file)
#   - Storage: 30GB
```

### 2. Create RDS Database

```bash
# AWS Console → RDS → Databases
# Create Database:
#   - Engine: PostgreSQL 15
#   - Template: Free tier
#   - DB name: creatify
#   - Master user: postgres
#   - Password: Strong password
#   - Public accessibility: Yes (with security group)
```

### 3. Connect to EC2

```bash
# Change permissions on key file
chmod 400 your-key.pem

# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js (same as DigitalOcean step above)
```

### 4. Update Backend .env with RDS

```bash
cat > server/.env << 'EOF'
PORT=3001
JWT_SECRET=$(openssl rand -base64 32)
DATABASE_URL=postgresql://postgres:password@your-rds-endpoint:5432/creatify
FRONTEND_URL=https://creatify.app
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG.your_key
SMTP_FROM=noreply@creatify.app
EOF
```

### 5. Rest of Setup

Follow DigitalOcean steps 4-10 (identical)

---

## 🐳 Option 3: Deploy on Render (Easiest)

### 1. Connect Repository

```bash
# Push code to GitHub
git push origin main
```

### 2. Deploy Frontend

```
https://render.com
1. New → Static Site
2. Connect repository
3. Build command: npm run build
4. Publish directory: dist
5. Custom domain: creatify.app
6. Deploy
```

### 3. Deploy Backend

```
https://render.com
1. New → Web Service
2. Connect repository
3. Runtime: Node
4. Build command: cd server && npm install
5. Start command: cd server && npm start
6. Environment variables:
   PORT=3001
   DATABASE_URL=...
   SMTP_*=...
7. Custom domain: api.creatify.app
8. Deploy
```

---

## 🏠 Option 4: Deploy on Heroku

### 1. Prepare App

```bash
# Create Procfile
cat > Procfile << 'EOF'
web: cd server && npm start
EOF

# Create runtime.txt
echo "18.17.0" > runtime.txt
```

### 2. Deploy

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create creatify-app

# Add database
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set \
  JWT_SECRET="$(openssl rand -base64 32)" \
  SMTP_HOST=smtp.sendgrid.net \
  SMTP_USER=apikey \
  SMTP_PASS=SG.xxx \
  SMTP_FROM=noreply@creatify.app

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## 📧 Email Service Configuration

### SendGrid (Recommended)

```bash
# 1. Create SendGrid account
# 2. Generate API key
# 3. Verify domain
# 4. Add to environment:

heroku config:set SMTP_PASS=SG.your_key
# or
export SMTP_PASS=SG.your_key
# or
# Add to server/.env
```

### AWS SES

```bash
# 1. Create AWS account
# 2. Request production access
# 3. Verify domain
# 4. Add to environment:

export SMTP_HOST=email-smtp.us-east-1.amazonaws.com
export SMTP_USER=your_iam_user
export SMTP_PASS=your_iam_password
```

---

## 🔒 Security Setup

### 1. SSL/TLS Certificate

```bash
# DigitalOcean/AWS/Render: Auto with Let's Encrypt
# Heroku: Automatic HTTPS
```

### 2. Database Encryption

```bash
# Ensure ENCRYPTED PASSWORD in PostgreSQL
CREATE USER creatify_user 
WITH ENCRYPTED PASSWORD 'your-password';
```

### 3. Firewalls

```bash
# DigitalOcean Firewall Rules:
- HTTP (80): Allow All
- HTTPS (443): Allow All
- SSH (22): Allow Your IP
- Custom (3001): Allow Internal Only
```

### 4. Environment Variables

```bash
# Never commit secrets to git
# Always use:
echo "server/.env" >> .gitignore
echo ".env" >> .gitignore

# Verify .gitignore
git status --ignored
```

---

## 📊 Monitoring Setup

### 1. Application Logs

```bash
# DigitalOcean/AWS
pm2 logs creatify-api | tee logs.txt

# Heroku
heroku logs --tail

# AWS CloudWatch
# Console → CloudWatch → Logs
```

### 2. Database Monitoring

```bash
# PostgreSQL
sudo -u postgres psql -d creatify -c "\du"

# Check connections
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

### 3. Email Monitoring

```bash
# SendGrid Dashboard
# Check:
# - Delivery rate
# - Bounce rate
# - Spam reports
# - Click-through rate
```

### 4. Uptime Monitoring

```bash
# Use UptimeRobot (free)
# or DataDog (paid)

# Monitor endpoints:
# https://api.creatify.app/api/health
# https://creatify.app
```

---

## 🔄 Deployment Workflow

### Development

```bash
# Local testing
npm run dev
```

### Staging

```bash
# Push to staging branch
git push origin staging

# Staging deploys automatically (if CI/CD configured)
# Test at https://staging.creatify.app
```

### Production

```bash
# Create release
git tag -a v1.0.0 -m "Initial production release"
git push origin v1.0.0

# Deploy to production
git push origin main

# Production live at https://creatify.app
```

---

## 📱 Domain Setup

### DNS Configuration

```
Type    Name                    Value
A       creatify.app            your-server-ip
A       www.creatify.app        your-server-ip
A       api.creatify.app        your-api-server-ip
CNAME   mail                    sendgrid domain
TXT     SPF                     v=spf1 sendgrid.net ~all
TXT     _dmarc                  v=DMARC1; p=quarantine
```

### SSL Verification

```bash
# Check SSL certificate
curl -I https://creatify.app

# Should return:
# HTTP/2 200
# Certificate: Valid
```

---

## 🧪 Post-Deployment Testing

### 1. API Health Check

```bash
curl https://api.creatify.app/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-07-29T...","service":"Creatify API"}
```

### 2. Signup Flow

```bash
# Test complete signup
curl -X POST https://api.creatify.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@yourdomain.com",
    "password": "Test123456!"
  }'

# Check email inbox for OTP
# Test OTP verification
```

### 3. Database Connection

```bash
# From EC2/droplet
psql -U creatify_user -d creatify -h localhost
\dt  # List tables
\q   # Exit
```

### 4. Email Delivery

```bash
# Send test email
# Check provider dashboard:
# - SendGrid: app.sendgrid.com/email_activity
# - AWS SES: AWS Console → SES → Email Activity
```

### 5. Frontend Load

```bash
# Check performance
# https://creatify.app

# Browser DevTools:
# - Network tab: Check load times
# - Console: No errors
# - Application: LocalStorage works
```

---

## 🚨 Troubleshooting

### Connection Issues

```bash
# Test API connectivity
curl -I https://api.creatify.app/api/health

# Test database
sudo -u postgres psql -c "SELECT version();"

# Check firewall
sudo ufw status
```

### Database Issues

```bash
# Connection string wrong
# Fix: Update DATABASE_URL in .env

# No tables
# Fix: Run migrations (if using Prisma/Sequelize)

# Permission denied
# Fix: Grant privileges to user
```

### Email Not Sending

```bash
# Check SMTP credentials
echo $SMTP_USER
echo $SMTP_PASS

# Check logs
pm2 logs creatify-api | grep -i email

# Test with test service
# Use Ethereal email service for debugging
```

### High Load/Performance

```bash
# Enable caching
# Add Redis
# Use CDN for static files
# Implement database connection pooling
```

---

## 📈 Scaling Guide

### Stage 1: Single Server (0-1000 users)
- Single EC2/Droplet
- PostgreSQL on same server
- Sufficient for MVP

### Stage 2: Separated Services (1K-10K users)
- Frontend on CDN (CloudFront/Cloudflare)
- Backend on auto-scaling group
- RDS database (separate)

### Stage 3: Multi-Region (10K+ users)
- Global CDN
- Load balancer
- Multi-region database replication
- Message queue (Redis)
- Cache layer (Memcached)

---

## ✅ Production Checklist

Before deploying to production:

- [ ] Domain purchased & configured
- [ ] SSL certificate installed
- [ ] Database setup & tested
- [ ] Environment variables set
- [ ] Email service configured
- [ ] `.gitignore` configured (no secrets)
- [ ] Logging setup
- [ ] Monitoring configured
- [ ] Backup strategy defined
- [ ] Disaster recovery plan
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Load testing done
- [ ] Error handling tested
- [ ] Email delivery tested
- [ ] Database backups automated
- [ ] CI/CD pipeline configured
- [ ] Staging environment matches production

---

## 🔐 Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Database credentials encrypted
- [ ] API keys in environment variables (not code)
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] SQL injection protection (using parameterized queries)
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Input validation
- [ ] Output encoding
- [ ] Authentication tokens secure
- [ ] Password hashing implemented
- [ ] Secrets rotation scheduled
- [ ] Security headers configured
- [ ] Firewall rules configured

---

## 📞 Support

### Provider Support

| Service | Support |
|---------|---------|
| DigitalOcean | https://www.digitalocean.com/support |
| AWS | https://aws.amazon.com/support |
| Render | https://render.com/docs |
| Heroku | https://devcenter.heroku.com |
| SendGrid | https://sendgrid.com/docs |

### Monitoring Tools

- **UptimeRobot:** https://uptimerobot.com
- **New Relic:** https://newrelic.com
- **DataDog:** https://www.datadoghq.com
- **Sentry:** https://sentry.io

---

## 🎓 Next Steps

1. **Week 1:** Monitor for errors
2. **Week 2:** Optimize performance
3. **Week 3:** Setup backups
4. **Week 4:** Scale if needed

---

**Last Updated:** July 29, 2026
**Status:** ✅ Production Ready
**Recommended:** DigitalOcean or AWS for best balance
