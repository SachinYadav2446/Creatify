# ⚡ Quick Google OAuth Setup (5 Minutes)

You're already in Google Cloud! Follow these exact steps:

## Step 1: Enable Google Sign-In API

1. In the left sidebar, click **APIs & Services** 
2. Click **Enable APIs and Services** (top blue button)
3. Search for: `Google+ API`
4. Click on it
5. Click **Enable**
6. Wait for it to enable (1-2 seconds)

## Step 2: Create OAuth Consent Screen

1. Go back to **APIs & Services**
2. Click **OAuth consent screen** (left menu)
3. Choose **External** user type
4. Click **Create**
5. Fill the form:
   - **App name**: `Creatify`
   - **User support email**: Your email
   - **Developer contact info**: Your email
6. Click **Save and Continue**
7. Click **Save and Continue** (skip scopes)
8. Click **Save and Continue** (skip test users)
9. Click **Back to Dashboard**

## Step 3: Create OAuth Client ID

1. Click **Credentials** (left menu)
2. Click **+ Create Credentials** (top)
3. Select **OAuth client ID**
4. Choose **Web application**
5. Name: `Creatify Web`
6. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:5173
   http://localhost:5174
   ```
7. Click **Create**
8. **COPY YOUR CLIENT ID** (the long string that looks like: `xxxxxx.apps.googleusercontent.com`)

## Step 4: Add Client ID to Your App

1. Open this file: `src/components/AuthPage.jsx`
2. Find line 5 (near top):
   ```javascript
   const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";
   ```
3. Replace with your Client ID:
   ```javascript
   const GOOGLE_CLIENT_ID = "1234567890-abcdefghijk.apps.googleusercontent.com";
   ```
4. Save the file

## Step 5: Test It!

The frontend already hot-reloads, so:

1. Open http://localhost:5173
2. Click **Sign in with Google**
3. Select your Google account
4. ✅ You should be authenticated!

---

## That's It! 🎉

You now have Google Sign-In working!

### What happens:
- Click Google button
- Google popup appears
- Select account & consent
- Instant login ✓
- No email verification needed
- Instant workspace access

---

## If you get errors:

**"Google is not defined"**
- Wait 2 seconds after page loads
- Try clicking again

**"Google Sign-In button doesn't appear"**
- Check browser console for errors (F12)
- Refresh the page

**"Sign in fails silently"**
- Make sure Client ID is correct (no extra spaces)
- Check backend is running (http://localhost:3001)
- Check browser console for network errors

---

**Questions?** Check the full guide: `GOOGLE_SIGNIN_SETUP.md`
