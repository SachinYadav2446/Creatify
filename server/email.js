require('dotenv').config();
const nodemailer = require('nodemailer');

// Email configuration - supports both test and production
let transporter = null;

async function initEmailService() {
  try {
    // Check for SMTP credentials in environment
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Production SMTP (Gmail, SendGrid, AWS SES, etc.)
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      // Verify connection
      await transporter.verify();
      console.log('✅ Email service initialized with SMTP:', process.env.SMTP_HOST);
    } else {
      // Test account (for development/testing)
      console.log('⚠️  SMTP credentials not found. Using Ethereal test email service...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('✅ Email service initialized with Ethereal test account');
      console.log('   📧 Test Email Inbox: https://ethereal.email/messages');
    }
  } catch (err) {
    console.error('❌ Email service initialization failed:', err.message);
    transporter = null;
  }
}

/**
 * Generate a random OTP (6 digits)
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp, name = 'Creator') {
  try {
    console.log(`📧 [OTP EMAIL] Starting OTP email send to ${email}, OTP: ${otp}`);
    if (!transporter) {
      console.error('❌ Email service not initialized');
      return { success: false, error: 'Email service not available' };
    }

    console.log(`📧 [OTP EMAIL] Building email template...`);
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@creatify.app',
      to: email,
      subject: '🔐 Verify Your Creatify Account - OTP: ' + otp,
      html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial,sans-serif;background:#f7f4f7;margin:0;padding:20px;}.container{max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 20px 60px rgba(148,41,69,0.1);}.header{background:linear-gradient(135deg,#942945 0%,#e1496d 100%);padding:40px 20px;text-align:center;color:#fff;}.logo{font-size:28px;font-weight:800;margin-bottom:10px;}.content{padding:40px;text-align:center;}.greeting{font-size:22px;font-weight:700;color:#2d2d2d;margin-bottom:10px;}.message{font-size:14px;color:#666;margin-bottom:30px;line-height:1.6;}.otp-box{background:rgba(148,41,69,0.08);border:2px solid rgba(148,41,69,0.2);border-radius:16px;padding:24px;margin:30px 0;}.otp-label{font-size:12px;color:#942945;text-transform:uppercase;font-weight:700;margin-bottom:10px;}.otp-code{font-size:42px;font-weight:800;color:#942945;letter-spacing:8px;font-family:'Courier New',monospace;margin:0;}</style></head><body><div class="container"><div class="header"><div class="logo">Creatify</div></div><div class="content"><div class="greeting">Welcome, ${name}! 👋</div><div class="message">Verify your email with the code below:</div><div class="otp-box"><div class="otp-label">Your Code</div><div class="otp-code">${otp}</div></div></div></div></body></html>`,
      text: `Your Creatify OTP: ${otp}`
    };

    console.log(`📧 [OTP EMAIL] Sending email via transporter...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [OTP SENT] Email successfully sent to ${email} | MessageID: ${info.messageId}`);

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ [OTP FAILED] Exception caught:', err.message);
    console.error('❌ [OTP FAILED] Stack:', err.stack);
    return { success: false, error: err.message };
  }
}

/**
 * Send welcome email after verification
 */
async function sendWelcomeEmail(email, name = 'Creator') {
  try {
    if (!transporter) {
      return { success: false, error: 'Email service not available' };
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@creatify.app',
      to: email,
      subject: '🎉 Welcome to Creatify - Your Creative Studio Awaits!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f7f4f7 0%, #fdf2f4 50%, #f7f4f7 100%); margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(148, 41, 69, 0.1); }
            .header { background: linear-gradient(135deg, #942945 0%, #e1496d 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
            .logo { font-size: 28px; font-weight: 800; margin-bottom: 10px; letter-spacing: -0.02em; }
            .content { padding: 40px; text-align: center; }
            .greeting { font-size: 24px; font-weight: 700; color: #2d2d2d; margin-bottom: 12px; letter-spacing: -0.02em; }
            .message { font-size: 14px; color: #666; margin-bottom: 30px; line-height: 1.6; }
            .features { background: #f7f4f7; border-radius: 16px; padding: 24px; margin: 30px 0; }
            .feature-item { text-align: left; margin-bottom: 16px; display: flex; gap: 12px; }
            .feature-icon { font-size: 24px; min-width: 24px; }
            .feature-text { font-size: 13px; color: #555; line-height: 1.6; }
            .button { background: linear-gradient(135deg, #942945, #e1496d); color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; display: inline-block; margin: 20px 0; }
            .footer { background: #f7f4f7; padding: 24px; text-align: center; border-top: 1px solid rgba(148, 41, 69, 0.1); font-size: 12px; color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Creat<span style="color: #fdf2f4;">ify</span></div>
              <p style="margin: 0; font-size: 14px; opacity: 0.9;">Account Verified ✓</p>
            </div>
            <div class="content">
              <div class="greeting">You're All Set, ${name}! 🎉</div>
              <div class="message">
                Your Creatify account has been successfully activated. You now have access to all our creative tools and features.
              </div>
              <a href="https://creatify.app/app" class="button">Launch Creatify Studio</a>
              <div class="features">
                <div class="feature-item">
                  <div class="feature-icon">🎬</div>
                  <div class="feature-text"><strong>Video Editor:</strong> Professional multi-track timeline with WebGL color grading</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">🎨</div>
                  <div class="feature-text"><strong>Image Editor:</strong> Layers, masks, filters, and pro-grade photo editing</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">📊</div>
                  <div class="feature-text"><strong>Presentations:</strong> Animated slides with 500K+ templates</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">✦</div>
                  <div class="feature-text"><strong>Logo Maker:</strong> Vector-based studio with AI suggestions</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">📄</div>
                  <div class="feature-text"><strong>Documents:</strong> Rich docs with embedded media and tables</div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">✏️</div>
                  <div class="feature-text"><strong>Whiteboard:</strong> Freehand canvas with live multiplayer</div>
                </div>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">Need help? <a href="https://creatify.app/support" style="color: #942945; text-decoration: none; font-weight: 600;">Contact Support</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to Creatify, ${name}! Your account has been verified and you now have access to all our creative tools.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ Failed to send welcome email:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  initEmailService,
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail
};
