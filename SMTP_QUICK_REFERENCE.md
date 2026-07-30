# 📧 SMTP Quick Reference - Production Setup

## 🏃 Quick Start (5 Minutes)

### Choose Your Provider

| Provider | Setup Time | Cost | Best For |
|----------|-----------|------|----------|
| **SendGrid** ⭐ | 5 min | FREE (100/day) | General use |
| **AWS SES** | 10 min | $0.10/1K emails | High volume |
| **Gmail** | 5 min | FREE (500/day) | Testing |
| **Mailgun** | 8 min | FREE (100/day) | Developers |
| **Brevo** | 7 min | FREE (300/day) | Email marketing |

---

## 🎯 SendGrid - Fastest Setup

### 1. Create Account (2 minutes)
```
https://sendgrid.com/pricing → "Try for Free"
```

### 2. Generate API Key (1 minute)
```
Dashboard → Settings → API Keys → Create API Key
Name: "Creatify Production"
Restrict to: Mail Send only
Copy the key (starts with SG.)
```

### 3. Update `.env` (1 minute)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx
SMTP_FROM=noreply@yourdomain.com
```

### 4. Verify Sender (1 minute)
```
Settings → Sender Authentication → Verify Email
Enter: noreply@yourdomain.com
Check email inbox → Click link
```

### 5. Test (1 minute)
```
npm run dev
Sign up at http://localhost:5174
Check inbox for OTP email
```

**✅ You're Done!**

---

## 🏗️ AWS SES - Enterprise Setup

### 1. Create Account (2 minutes)
```
https://aws.amazon.com → Create Account
Add payment method
```

### 2. Request Production Access (2 minutes)
```
AWS Console → SES → Account Dashboard
"Request Production Access"
Describe: "Transactional emails for Creatify app"
Wait for approval (1-2 hours)
```

### 3. Verify Domain (3 minutes)
```
SES → Domains → "Verify a New Domain"
Enter: yourdomain.com
Add DNS records to your provider
Wait for verification (usually 5-30 min)
```

### 4. Get SMTP Credentials (1 minute)
```
SES → Account Dashboard → SMTP Settings
Create My SMTP Credentials
Copy username & password
```

### 5. Update `.env`
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=AKIAIOSFODNN7EXAMPLE
SMTP_PASS=BEntqrr2X1234567890abcdefghijklmn
SMTP_FROM=noreply@yourdomain.com
```

### 6. Enable DKIM
```
SES → Domains → Your Domain
Enable DKIM signing
Add DKIM tokens to DNS
```

---

## 🚀 Environment Setup Across Environments

### Development
```env
# Use Ethereal (no config needed) OR Gmail test account
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-test@gmail.com
SMTP_PASS=app-password
```

### Staging
```env
# Use SendGrid free tier
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.staging_key
SMTP_FROM=staging@yourdomain.com
```

### Production
```env
# Use SendGrid Pro or AWS SES
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.production_key
SMTP_FROM=noreply@yourdomain.com
```

---

## 🔐 DNS Configuration Cheat Sheet

### For SendGrid

**SPF Record:**
```
yourdomain.com  TXT  v=spf1 sendgrid.net ~all
```

**DKIM Record:**
```
sendgrid._domainkey.yourdomain.com  CNAME  sendgrid.net
```

### For AWS SES

**SPF Record:**
```
yourdomain.com  TXT  v=spf1 email-smtp.us-east-1.amazonaws.com ~all
```

**MX Record:**
```
yourdomain.com  MX  10  inbound-smtp.us-east-1.amazonaws.com
```

### For Mailgun

**SPF Record:**
```
yourdomain.com  TXT  v=spf1 mailgun.org ~all
```

**DKIM Record:**
```
default._domainkey.yourdomain.com  CNAME  mailgun.org
```

---

## 📋 Configuration Matrix

```
┌─────────┬──────────┬──────────┬─────────┬──────────────┐
│Provider │ Host     │ Port     │ User    │ Pass Format  │
├─────────┼──────────┼──────────┼─────────┼──────────────┤
│SendGrid │ smtp.    │ 587      │ apikey  │ SG.xxxxx     │
│         │sendgrid │          │         │              │
│         │.net     │          │         │              │
├─────────┼──────────┼──────────┼─────────┼──────────────┤
│AWS SES  │ email-   │ 587      │ AKIA... │ (IAM Secret) │
│         │smtp.    │          │         │              │
│         │region.  │          │         │              │
│         │amazonaws│          │         │              │
│         │.com     │          │         │              │
├─────────┼──────────┼──────────┼─────────┼──────────────┤
│Gmail    │ smtp.    │ 587      │ your@   │ App Pwd      │
│         │gmail    │          │gmail.   │ (16 chars)   │
│         │.com     │          │com      │              │
├─────────┼──────────┼──────────┼─────────┼──────────────┤
│Mailgun  │ smtp.    │ 587      │ postm@  │ (Random)     │
│         │mailgun  │          │mail.    │              │
│         │.org     │          │yourdm   │              │
├─────────┼──────────┼──────────┼─────────┼──────────────┤
│Brevo    │ smtp-    │ 587      │ your@   │ (xsmtpsib-) │
│         │relay.   │          │email    │              │
│         │brevo    │          │.com     │              │
│         │.com     │          │         │              │
└─────────┴──────────┴──────────┴─────────┴──────────────┘
```

---

## ⚡ Common Commands

### Test Backend Connection
```bash
# Start backend with logs
npm run dev

# Should show:
# ✅ Email service initialized with SMTP: [your-host]
```

### Verify .env is Loaded
```javascript
// server/index.js
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_FROM:', process.env.SMTP_FROM);
```

### Test Email Send
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@yourdomain.com",
    "password": "test123"
  }'
```

### Monitor Logs in Production
```bash
# With PM2
pm2 logs creatify-api

# With systemd
journalctl -u creatify -f

# Watch .env is loaded
grep -i smtp server/.env
```

---

## 🚨 Troubleshooting

| Error | Solution |
|-------|----------|
| `Authentication failed` | Check SMTP_USER & SMTP_PASS format. For SendGrid, SMTP_USER must be "apikey" |
| `Connection timeout` | Verify port 587 is open. Try telnet: `telnet smtp.host 587` |
| `Email not received` | Check spam folder. Verify sender domain. Add SPF/DKIM records. |
| `Rate limited` | Provider rate limits. Wait before retrying. Implement backoff. |
| `TLS error` | Ensure SMTP_SECURE=false for port 587. Use SMTP_SECURE=true for 465. |
| `Invalid credentials` | Verify API key hasn't expired. Regenerate if needed. |

---

## 📊 Pricing Comparison

```
                Free Limit    Paid Plan         Cost/1000
SendGrid        100/day       Pro: 40K/month   $14.95/month
AWS SES         FREE          Pay-as-you-go    $0.10
Gmail           500/day       N/A              FREE
Mailgun         100/day       Pro: 10K/month   $35/month
Brevo           300/day       Pro: Unlimited   €20/month
```

---

## ✅ Pre-Production Checklist

- [ ] Email service account created
- [ ] Domain verified
- [ ] API key/password generated
- [ ] SPF record added to DNS
- [ ] DKIM configured (if available)
- [ ] DMARC policy set
- [ ] `.env` updated with credentials
- [ ] `.env` added to `.gitignore`
- [ ] Test email sent successfully
- [ ] Email received in inbox (not spam)
- [ ] Unsubscribe link in template
- [ ] Bounce handling implemented
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] Monitoring alerts setup

---

## 🎯 Deployment Command

```bash
# 1. SSH into production server
ssh user@prod-server

# 2. Navigate to project
cd ~/creatify

# 3. Pull latest code
git pull origin main

# 4. Update backend .env
nano server/.env
# Add SMTP credentials here

# 5. Restart backend
pm2 restart all

# 6. Verify logs
pm2 logs

# 7. Test signup
curl http://localhost:3001/api/auth/signup \
  -d '{"name":"Test","email":"test@domain.com","password":"test123"}'
```

---

## 🔍 Verification Steps

### After Configuration

1. **Check environment variables loaded**
   ```
   Backend logs should show:
   ✅ Email service initialized with SMTP: [provider]
   ```

2. **Test OTP email**
   - Sign up on your app
   - Check email inbox
   - Look for "[Provider] Email Activity" dashboard

3. **Verify sender authenticity**
   - Check email headers
   - Should show your domain in "From"
   - No warnings/red flags

4. **Test bounce handling** (optional)
   - Send to invalid address
   - Verify bounce logged
   - Check provider bounce stats

---

## 📱 Dashboard Links

| Provider | Dashboard |
|----------|-----------|
| SendGrid | https://app.sendgrid.com/email_activity |
| AWS SES | AWS Console → SES → Email Activity |
| Mailgun | https://app.mailgun.com/app/logs |
| Brevo | https://app-smtp.brevo.com/dashboard |
| Gmail | https://myaccount.google.com/device-activity |

---

## 🎓 Next Steps

1. **Monitor email metrics** daily first week
2. **Setup alerts** for delivery failures
3. **Track bounce rates** (target: < 2%)
4. **Test from different email clients** (Gmail, Outlook, etc.)
5. **Implement double opt-in** for signup
6. **Add email preferences** for users
7. **Setup A/B testing** for email content
8. **Implement email templates** for different scenarios

---

## 📞 Support Resources

- **SendGrid Docs:** https://sendgrid.com/docs
- **AWS SES Guide:** https://docs.aws.amazon.com/ses
- **Mailgun API:** https://documentation.mailgun.com
- **Brevo Help:** https://www.brevo.com/support
- **Email Testing:** https://www.mail-tester.com

---

**Quick Decision:** 
- **Just starting?** → Use **SendGrid** (easiest, free tier sufficient)
- **AWS infrastructure?** → Use **AWS SES** (integrates well, cheap)
- **High volume?** → Use **SendGrid Pro** or **Mailgun** (better deliverability)

---

Generated: July 29, 2026
Last Updated: Production Ready ✅
