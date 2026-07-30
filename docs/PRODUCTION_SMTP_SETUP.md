# 🚀 Production SMTP Setup Guide

Complete step-by-step instructions for setting up professional email services for production deployment.

---

## 📋 Table of Contents

1. [Gmail (SMTP)](#gmail-smtp)
2. [SendGrid](#sendgrid)
3. [AWS SES](#aws-ses)
4. [Mailgun](#mailgun)
5. [Brevo (Sendinblue)](#brevo)
6. [Production Security Checklist](#production-security-checklist)
7. [DNS Configuration](#dns-configuration)
8. [Email Authentication](#email-authentication)
9. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## 1️⃣ Gmail SMTP

### Best For: Small to medium projects (up to 500 emails/day)

### Step 1: Enable 2-Factor Authentication

1. Go to https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click "Enable 2-Step Verification"
4. Follow the setup process
5. Verify your phone number

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" from dropdown
3. Select "Windows Computer" (or your device type)
4. Click "Generate"
5. Copy the 16-character password

### Step 3: Update `.env` File

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM=noreply@yourcompany.com
```

### Step 4: Create Business Email (Recommended)

For professional use, create a Gmail account specifically for your app:
```
Example: noreply@yourcompany.com (using Google Workspace)
```

### Step 5: Test Configuration

```bash
# From server directory
npm run dev

# Check logs for:
# ✅ Email service initialized with SMTP: smtp.gmail.com
```

### Limitations

- ⚠️ Max 500 emails/day (free Gmail)
- ⚠️ Not ideal for high-volume applications
- ⚠️ May have rate limiting

### Cost: **FREE** ✅

---

## 2️⃣ SendGrid

### Best For: Production applications (40,000 free emails/month + paid plans)

### Step 1: Create SendGrid Account

1. Go to https://sendgrid.com/pricing
2. Click "Try for Free"
3. Sign up with your email
4. Verify your email address
5. Complete profile setup

### Step 2: Create API Key

1. Dashboard → Settings → API Keys
2. Click "Create API Key"
3. Choose "Restricted Access"
4. Enable "Mail Send" permission
5. Copy the API key
6. Name it something like "Creatify Production"

### Step 3: Verify Sender Email

1. Settings → Sender Authentication
2. Click "Authenticate Your Domain"
3. Choose "Using CNAME"
4. Enter your domain (e.g., `mail.creatify.app`)
5. Copy the CNAME records to your DNS provider
6. Wait for verification (usually 5-30 minutes)

### Step 4: Update `.env` File

```env
# SendGrid SMTP Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM=noreply@yourdomain.com
```

### Step 5: Test Configuration

```bash
npm run dev

# Send test email from backend:
# Check SendGrid dashboard → Email Activity
```

### Step 6: Configure Email Settings

1. Settings → Mail Settings
2. Enable "Click Tracking"
3. Enable "Open Tracking"
4. Enable "Bounce Purge"
5. Set bounce purge to 30 days

### Advanced: Setup Subuser (Optional)

For multiple environments:
```
Production Subuser: sendgrid-prod
Staging Subuser: sendgrid-staging
Development: Separate API key
```

### Cost: **FREE (100/day) → $14.95/month (40K emails)**

---

## 3️⃣ AWS SES (Simple Email Service)

### Best For: Enterprise applications, AWS infrastructure

### Step 1: Create AWS Account

1. Go to https://aws.amazon.com
2. Click "Create an AWS Account"
3. Complete registration
4. Add payment method

### Step 2: Request Production Access

1. AWS Console → SES
2. Note: Default is "Sandbox" mode
3. Request Production Access:
   - Go to SES → Account Dashboard
   - Click "Request Production Access"
   - Describe your use case
   - Wait for approval (usually 1-2 hours)

### Step 3: Verify Email Address

1. SES Dashboard → Email Addresses
2. Click "Verify a New Email Address"
3. Enter: `noreply@yourdomain.com`
4. Check email inbox
5. Click verification link

### Step 4: Verify Domain (Recommended)

1. SES Dashboard → Domains
2. Click "Verify a New Domain"
3. Enter your domain: `yourdomain.com`
4. Add DNS records (DKIM, SPF)
5. Wait for verification

### Step 5: Create SMTP Credentials

1. SES Dashboard → Account Dashboard
2. Click "SMTP Settings"
3. Copy SMTP endpoint (e.g., `email-smtp.us-east-1.amazonaws.com`)
4. Click "Create My SMTP Credentials"
5. Create new IAM user or use existing
6. Copy username & password

### Step 6: Update `.env` File

```env
# AWS SES Configuration
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=AKIAIOSFODNN7EXAMPLE
SMTP_PASS=BEntqrr2X1234567890abcdefghijklmn1234567
SMTP_FROM=noreply@yourdomain.com
```

### Step 7: Configure DKIM Signing

1. SES → Domains → Your Domain
2. Enable DKIM signing
3. Add DKIM tokens to DNS

### Advanced: Setup Dedicated IP

For high volume (50K+ emails/month):
```
Lease dedicated IP: $24.95/month
Improves deliverability and reputation
```

### Cost: **Pay-as-you-go ($0.10 per 1,000 emails)**

---

## 4️⃣ Mailgun

### Best For: Developers, excellent documentation

### Step 1: Create Mailgun Account

1. Go to https://www.mailgun.com
2. Sign up (free tier available)
3. Verify email address
4. Create account

### Step 2: Verify Domain

1. Dashboard → Domains
2. Click "Add New Domain"
3. Enter: `mail.yourdomain.com`
4. Add DNS records:
   - MX records
   - SPF record
   - DKIM record
5. Wait for verification

### Step 3: Get SMTP Credentials

1. Dashboard → Domains → Your Domain
2. Copy SMTP credentials:
   - SMTP Host
   - SMTP Username
   - SMTP Password

### Step 4: Update `.env` File

```env
# Mailgun Configuration
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@mail.yourdomain.com
SMTP_PASS=xxxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM=noreply@yourdomain.com
```

### Step 5: Configure Domain Settings

1. Domain Settings → General
2. Enable "Track Opens"
3. Enable "Track Clicks"
4. Set "Bounce Unsubscribe"

### Advanced: API Integration

For more control, use Mailgun API instead of SMTP:
```javascript
// Alternative: Use Mailgun API
const mailgun = require('mailgun.js');
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});
```

### Cost: **FREE (100/day) → $35/month (10K emails)**

---

## 5️⃣ Brevo (Sendinblue)

### Best For: Email marketing + transactional emails

### Step 1: Create Brevo Account

1. Go to https://www.brevo.com
2. Sign up with your email
3. Verify email
4. Create account

### Step 2: Get SMTP Credentials

1. Settings → SMTP & API
2. Copy SMTP Settings:
   - SMTP Server
   - Port
   - Username
   - Password

### Step 3: Verify Sender Email

1. Senders → My Senders
2. Click "Add a Sender"
3. Enter `noreply@yourdomain.com`
4. Verify email (click link)

### Step 4: Update `.env` File

```env
# Brevo (Sendinblue) Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=xsmtpsib-xxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM=noreply@yourdomain.com
```

### Step 5: Configure Settings

1. Settings → Advanced → SMTP Relay
2. Enable SMTP Relay
3. Whitelist IP addresses (optional)

### Cost: **FREE (300/day) → €20/month**

---

## 🔐 Production Security Checklist

### Before Going Live

- [ ] Use dedicated email address (noreply@domain.com)
- [ ] Configure email authentication (SPF, DKIM, DMARC)
- [ ] Verify domain ownership
- [ ] Enable SSL/TLS (port 587 with STARTTLS or 465)
- [ ] Store credentials in environment variables
- [ ] Never commit `.env` to version control
- [ ] Rotate API keys periodically
- [ ] Setup monitoring and alerts
- [ ] Configure bounce handling
- [ ] Implement rate limiting
- [ ] Add unsubscribe links to emails
- [ ] Setup email templates properly
- [ ] Test with real email addresses
- [ ] Monitor bounce rates
- [ ] Setup complaint handling

### `.env` File Security

```bash
# Create .env file
cat > server/.env << 'EOF'
PORT=3001
JWT_SECRET=your-super-secret-key-change-in-production
DATABASE_URL=postgresql://user:pass@host/db
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx
SMTP_FROM=noreply@yourdomain.com
FRONTEND_URL=https://yourdomain.com
EOF

# Secure permissions
chmod 600 server/.env

# Add to .gitignore
echo "server/.env" >> .gitignore
```

---

## 📧 DNS Configuration

### SPF Record

Prevents email spoofing. Add to your DNS provider:

**For SendGrid:**
```
v=spf1 sendgrid.net ~all
```

**For AWS SES:**
```
v=spf1 email-smtp.us-east-1.amazonaws.com ~all
```

**For Mailgun:**
```
v=spf1 mailgun.org ~all
```

**For multiple providers:**
```
v=spf1 sendgrid.net email-smtp.us-east-1.amazonaws.com mailgun.org ~all
```

### DKIM Records

Authenticate emails. Get from your email service provider and add to DNS.

**Example:**
```
default._domainkey.yourdomain.com  CNAME  mailgun.org
```

### DMARC Record

Policy for handling authentication failures:

```
_dmarc.yourdomain.com  TXT  v=DMARC1; p=quarantine; rua=mailto:admin@yourdomain.com
```

### MX Records

Tell mail servers where to send emails:

```
yourdomain.com  MX  10  inbound-smtp.us-east-1.amazonaws.com
```

---

## 🔒 Email Authentication

### Implement in Backend

Add authentication headers to emails:

```javascript
// server/email.js - Already implemented!
const mailOptions = {
  from: process.env.SMTP_FROM || 'noreply@creatify.app',
  to: email,
  subject: '🔐 Verify Your Creatify Account',
  html: emailHTML,
  text: emailText,
  
  // Authentication headers
  headers: {
    'List-Unsubscribe': '<https://creatify.app/unsubscribe?email=' + email + '>',
    'X-Mailer': 'Creatify',
    'X-Priority': '3'
  }
};
```

### Add Unsubscribe Link

Required by law (CAN-SPAM):

```html
<p style="text-align: center; font-size: 11px; color: #999;">
  <a href="https://creatify.app/unsubscribe?email=user@example.com">
    Unsubscribe from emails
  </a>
</p>
```

### Monitor Bounce Rates

Keep below 5%:
- 0-2% - Excellent
- 2-5% - Good
- 5-10% - Needs attention
- 10%+ - Major issue

---

## 🚀 Deployment Steps

### 1. Choose Email Provider

**Quick Decision Tree:**
```
High Volume (50K+/month)?
  → YES: AWS SES or SendGrid Pro
  → NO: Continue

Need API Features?
  → YES: Mailgun or SendGrid
  → NO: Continue

Budget Conscious?
  → YES: Brevo or AWS SES
  → NO: SendGrid or Mailgun
```

### 2. Set Up Email Service

Follow provider-specific steps above.

### 3. Update Production `.env`

```bash
# SSH into production server
ssh user@production-server

# Edit .env
nano ~/creatify/server/.env

# Add production SMTP credentials
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx_your_key
SMTP_FROM=noreply@creatify.app

# Save (Ctrl+O, Enter, Ctrl+X)
```

### 4. Restart Backend

```bash
# Stop current process
pm2 stop all

# Install dependencies
cd ~/creatify/server
npm install

# Start with PM2
pm2 start index.js --name "creatify-api"

# Verify
pm2 logs
```

### 5. Test Production Email

```bash
# Send test email via API
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@yourdomain.com",
    "password": "testpass123"
  }'

# Check email provider dashboard for sent email
```

### 6. Monitor Email Delivery

```bash
# SendGrid: https://app.sendgrid.com/email_activity
# AWS SES: AWS Console → SES → Email Activity
# Mailgun: app.mailgun.com/app/logs
# Brevo: https://app-smtp.brevo.com/dashboard
```

---

## 📊 Recommended Production Setup

### Small to Medium Apps (< 10K emails/month)

**Provider:** SendGrid
**Cost:** FREE
**Pros:**
- Easy setup
- Excellent documentation
- Good reliability
- Free tier sufficient
- Built-in bounce management

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx
```

### Large Apps (10K - 100K emails/month)

**Provider:** AWS SES
**Cost:** ~$10-50/month
**Pros:**
- Pay-as-you-go pricing
- High deliverability
- Integrates with AWS stack
- Domain verification included
- Advanced settings

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIA...
SMTP_PASS=...
```

### Enterprise Apps (100K+ emails/month)

**Provider:** SendGrid Enterprise or Mailgun
**Cost:** Custom pricing
**Pros:**
- Dedicated support
- Whitelabeling
- Custom IP addresses
- Advanced analytics
- Highest reliability

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.enterprise_key
```

---

## 🔍 Monitoring & Troubleshooting

### Monitor Email Metrics

```bash
# Create monitoring script
cat > server/monitor-email.js << 'EOF'
const cron = require('node-cron');

// Every hour, check email stats
cron.schedule('0 * * * *', async () => {
  // Query database for sent emails
  const emailStats = await db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered,
      SUM(CASE WHEN status = 'bounced' THEN 1 ELSE 0 END) as bounced,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
    FROM email_logs
    WHERE sent_at > NOW() - INTERVAL '1 hour'
  `);
  
  console.log('📊 Email Stats:', emailStats);
  
  // Alert if bounce rate > 5%
  const bounceRate = emailStats.bounced / emailStats.total;
  if (bounceRate > 0.05) {
    console.error('⚠️ High bounce rate detected:', bounceRate);
    // Send alert to Slack, PagerDuty, etc.
  }
});
EOF
```

### Common Issues & Solutions

**Issue: "Authentication failed"**
```
Solution:
1. Verify credentials in .env
2. Check API key hasn't expired
3. Confirm SMTP username format
4. For SendGrid: username should be "apikey"
```

**Issue: "Connection timeout"**
```
Solution:
1. Verify correct SMTP host
2. Check port (587 for STARTTLS, 465 for SSL)
3. Verify firewall allows outbound port
4. Test from production server: telnet smtp.host 587
```

**Issue: "High bounce rate"**
```
Solution:
1. Review email list for invalid addresses
2. Check HTML email formatting
3. Verify SPF/DKIM/DMARC setup
4. Remove hard bounces from list
5. Implement double opt-in
```

**Issue: "Emails going to spam"**
```
Solution:
1. Add unsubscribe link
2. Configure SPF/DKIM/DMARC
3. Verify sender domain
4. Use consistent sender address
5. Avoid spam words in subject/body
6. Test with mail-tester.com
```

### Test Email Deliverability

```bash
# Use Mail-Tester
curl "https://api.mail-tester.com/v1/sendEmail" \
  -H "Content-Type: application/json" \
  -d '{"email": "test-xxxxx@mail-tester.com"}'

# Score:
# 10/10 - Perfect
# 8-10 - Very good
# 6-8 - Needs work
# <6 - Major issues
```

---

## 🎯 Best Practices

### Email Content

✅ **DO:**
- Keep subject line under 50 characters
- Include unsubscribe link
- Test with multiple clients
- Use professional templates
- Include company name and address
- Plain text fallback

❌ **DON'T:**
- Use ALL CAPS subject lines
- Excessive links/images
- Misleading sender name
- Asking user to disable filters
- Multiple unsubscribe methods
- Suspicious links

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many OTP requests. Please try again later.'
});

app.post('/api/auth/resend-otp', otpLimiter, async (req, res) => {
  // Handle resend OTP
});
```

### Database Logging

```javascript
// Log all emails
async function logEmail(email, subject, status) {
  await db.query(`
    INSERT INTO email_logs (email, subject, status, sent_at)
    VALUES ($1, $2, $3, NOW())
  `, [email, subject, status]);
}
```

### Bounce Handling

```javascript
// Automatically remove bounced emails
async function handleBounce(email) {
  await db.query(`
    UPDATE users 
    SET email_verified = false
    WHERE email = $1
  `, [email]);
  
  // Or delete from list
  // Or mark as invalid
}
```

---

## 📞 Support Contacts

| Provider | Support | Docs | Status Page |
|----------|---------|------|------------|
| **SendGrid** | 24/7 support | https://sendgrid.com/docs | https://status.sendgrid.com |
| **AWS SES** | AWS Support | https://docs.aws.amazon.com/ses | https://status.aws.amazon.com |
| **Mailgun** | https://mailgun.com/support | https://documentation.mailgun.com | https://status.mailgun.com |
| **Brevo** | https://www.brevo.com/support | https://brevo.com/documentation | https://status.brevo.com |

---

## ✅ Production Deployment Checklist

Before deploying to production:

- [ ] Email service account created and verified
- [ ] Domain verified with email provider
- [ ] SPF record added to DNS
- [ ] DKIM records configured
- [ ] DMARC policy set
- [ ] SMTP credentials added to `.env`
- [ ] `.env` not committed to git
- [ ] Unsubscribe link added to templates
- [ ] Test email sent successfully
- [ ] Email appears in inbox (not spam)
- [ ] Bounce handling implemented
- [ ] Rate limiting configured
- [ ] Error logging setup
- [ ] Monitoring alerts configured
- [ ] Support contact info documented
- [ ] Backup email provider identified
- [ ] Disaster recovery plan created

---

## 🚀 Quick Start: SendGrid (Recommended)

```bash
# 1. Go to https://sendgrid.com
# 2. Create free account
# 3. Generate API key
# 4. Update server/.env

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your_api_key_here
SMTP_FROM=noreply@yourdomain.com

# 5. Verify sender email
# 6. Restart backend: npm run dev
# 7. Test signup: http://localhost:5174
# 8. Check SendGrid dashboard for email
```

---

**Last Updated:** July 29, 2026
**Status:** ✅ Production Ready
**Recommended for Production:** SendGrid or AWS SES
