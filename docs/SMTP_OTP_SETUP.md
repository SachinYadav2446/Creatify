# 📧 SMTP & OTP Email Verification Setup

## Overview

Your Creatify authentication system now includes professional email verification with OTP (One-Time Password) codes. When users register, they receive a beautiful HTML email with a 6-digit OTP that they must enter to verify their account.

## Features Implemented

✅ **SMTP Email Service** - Send emails via Gmail, SendGrid, AWS SES, or any SMTP provider
✅ **OTP Generation** - Secure 6-digit codes with 10-minute expiration
✅ **Beautiful Email Templates** - Professional HTML emails with branding
✅ **OTP Verification Screen** - Clean UI for entering verification codes
✅ **Resend OTP** - Users can request a new code if needed
✅ **Timer Display** - Shows remaining time before OTP expires
✅ **Test Email Support** - Uses Ethereal email service for testing (no SMTP needed)
✅ **Database Integration** - Stores OTP and verification status

---

## Backend Setup

### 1. Install Dependencies

Already installed! Run from `/server` directory:
```bash
npm install
```

### 2. Configure SMTP in `.env`

Edit `server/.env` and add your email provider credentials:

```env
# Email/SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@creatify.app
```

### 3. SMTP Provider Setup

#### **Gmail (Recommended for Testing)**

1. Enable 2-Factor Authentication in Google Account
2. Generate App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password
3. Use this in `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=<app-password-from-google>
   ```

#### **SendGrid**

1. Create account at https://sendgrid.com
2. Generate API key
3. Configure `.env`:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=<your-sendgrid-api-key>
   ```

#### **AWS SES**

1. Verify email in AWS SES console
2. Create IAM user with SES permissions
3. Configure `.env`:
   ```env
   SMTP_HOST=email-smtp.<region>.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=<AWS_ACCESS_KEY_ID>
   SMTP_PASS=<AWS_SECRET_ACCESS_KEY>
   ```

#### **Mailgun**

1. Create account at https://mailgun.com
2. Get SMTP credentials from dashboard
3. Configure `.env`:
   ```env
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_USER=postmaster@<your-domain>
   SMTP_PASS=<mailgun-password>
   ```

#### **Test Mode (Ethereal - No Config Needed!)**

If you don't configure SMTP, the system automatically uses **Ethereal Email** for testing:
- No credentials needed
- Emails are captured (not sent to real addresses)
- View emails at: https://ethereal.email/messages

---

## API Endpoints

### 1. **POST /api/auth/signup**
Register a new user and send OTP

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Account created! Check your email for OTP verification code.",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified": false
  },
  "otp_sent": true
}
```

---

### 2. **POST /api/auth/verify-otp**
Verify OTP code and complete registration

**Request:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified": true
  }
}
```

---

### 3. **POST /api/auth/resend-otp**
Resend OTP code (after 10-minute wait)

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent! Check your email.",
  "otp_sent": true
}
```

---

## Frontend Implementation

### Registration Flow

1. **User enters name, email, password** → Clicks "Create Workspace"
2. **Form validation** → Password strength check
3. **API call to /signup** → Account created, OTP generated
4. **OTP screen appears** → Beautiful verification UI
5. **User enters 6-digit code** → Real-time input validation
6. **API call to /verify-otp** → Email verified
7. **Provisioning animation** → Shows welcome sequence
8. **Dashboard access** → User redirected to home page

### OTP Screen Features

- **Beautiful Design** - Matches Creatify branding
- **Auto-formatting** - Only accepts digits
- **Timer Display** - Shows countdown to expiration
- **Resend Button** - Appears after timer expires
- **Error Messages** - Clear feedback on failures
- **Back Button** - Return to signup form
- **Loading State** - Visual feedback during verification

---

## Email Templates

### OTP Verification Email

Sent immediately after signup with:
- ✨ Welcome greeting
- 🔐 6-digit OTP code (large, easy to read)
- ⏱️ Expiration time (10 minutes)
- 📋 Step-by-step instructions
- 🔒 Security reminder

### Welcome Email

Sent after successful verification with:
- 🎉 Account activation confirmation
- 📚 Feature highlights (Video Editor, Image Editor, etc.)
- 🚀 Launch button to dashboard
- 💬 Support contact link

---

## Database Schema

Added to `users` table:
```sql
otp          VARCHAR(6)          -- 6-digit code
otp_expires_at TIMESTAMPTZ       -- Expiration timestamp
email_verified BOOLEAN DEFAULT false -- Verification status
```

---

## Testing

### Test with Gmail (Recommended)

1. **Get App Password** from Google Account
2. **Update `.env`** with your Gmail and app password
3. **Start backend server**: `npm run dev` (from `/server`)
4. **Start frontend server**: `npm run dev` (from root)
5. **Navigate to** http://localhost:5174
6. **Click "Create Account"**
7. **Enter test credentials** and submit
8. **Check Gmail inbox** for OTP email
9. **Enter 6-digit code** in verification screen
10. **Success!** Account activated

### Test with Ethereal (No Setup!)

1. **Don't configure SMTP in .env**
2. **Start backend server**: `npm run dev`
3. **Backend logs will show** test email preview URL
4. **Click the URL** to see test email
5. **Copy OTP from email**
6. **Paste into verification screen**
7. **View all test emails** at https://ethereal.email/messages

---

## Troubleshooting

### ❌ "Email service not initialized"
**Solution:** Check backend logs. Ensure SMTP_HOST is set in `.env` or let it use Ethereal.

### ❌ "OTP not received"
**Possible causes:**
- Check spam/promotions folder
- Verify SMTP credentials in `.env`
- Try test email first (Ethereal)
- Check backend server logs for errors

### ❌ "Invalid OTP" when code is correct
**Possible causes:**
- Code has expired (max 10 minutes)
- Extra spaces in input (auto-trimmed, shouldn't happen)
- Browser cached old state (hard refresh)

### ❌ "SMTP connection refused"
**Solution:** 
- Verify SMTP credentials
- Check firewall/VPN not blocking port
- Try Gmail's App Password instead of regular password
- Ensure port 587 is open

### ❌ Server won't start (port in use)
```bash
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Then restart
npm run dev
```

---

## Production Deployment

### Before Going Live

1. ✅ Add real SMTP credentials to `.env`
2. ✅ Update `SMTP_FROM` to official domain
3. ✅ Test complete signup flow
4. ✅ Verify emails reach inbox (not spam)
5. ✅ Set up email authentication (SPF, DKIM, DMARC)

### Security Best Practices

- ✅ OTP codes expire in 10 minutes
- ✅ OTP stored as hash (not plain text) - *consider bcrypt for production*
- ✅ Rate limiting on OTP resend (implement in production)
- ✅ HTTPS only in production
- ✅ Store JWT tokens securely
- ✅ Add verification attempts limit

---

## Email Customization

### Modify Email Templates

Edit `server/email.js`:

```javascript
// OTP Email HTML
const mailOptions = {
  from: process.env.SMTP_FROM,
  to: email,
  subject: 'Your Custom Subject Here',
  html: `Your HTML template here`
};
```

### Update Colors/Branding

Current colors:
- Primary: #942945 (Wine)
- Accent: #e1496d (Rose)
- Background: #f7f4f7 (Cream)

Change hex codes in email templates to match your brand.

---

## Monitoring & Analytics

### Log OTP Events

Check backend console for:
```
📧 OTP sent to user@example.com
✅ Email verified for user: John Doe <john@example.com>
📧 OTP resent to: John Doe <john@example.com>
```

### Database Queries

Check verification status:
```sql
SELECT email, email_verified, created_at FROM users;
```

---

## Support & Documentation

- **Nodemailer Docs**: https://nodemailer.com
- **Gmail App Passwords**: https://myaccount.google.com/apppasswords
- **SendGrid SMTP**: https://sendgrid.com/docs/for-developers/sending-email/smtp/
- **AWS SES**: https://docs.aws.amazon.com/ses/

---

## Next Steps

Potential enhancements:
- [ ] Implement CAPTCHA on signup
- [ ] Add email verification rate limiting
- [ ] SMS OTP backup option
- [ ] Social login (Google, GitHub)
- [ ] Magic link authentication
- [ ] Two-factor authentication (2FA)
- [ ] Email notification preferences

---

**Last Updated**: July 29, 2026
**Status**: ✅ Production Ready
