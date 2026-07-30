# 🔐 Google Sign-In Setup Guide for Creatify

Google Sign-In is now integrated into Creatify! Follow these steps to enable it.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top left
3. Click "New Project"
4. Enter name: `Creatify` (or your choice)
5. Click "Create"
6. Wait for the project to be created

## Step 2: Create OAuth 2.0 Credentials

1. In the Cloud Console, go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. If prompted, click "Configure OAuth consent screen first"

### Configure OAuth Consent Screen:

1. Select **External** user type
2. Click **Create**
3. Fill in the form:
   - **App name**: Creatify
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **Save and Continue**
5. Click **Save and Continue** on Scopes page (no need to add scopes)
6. Click **Save and Continue** on Test users page (optional to add)
7. Click **Back to Dashboard**

### Create OAuth Client ID:

1. Go back to **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Add Name: `Creatify Web`
5. Under "Authorized redirect URIs", add these URLs:
   ```
   http://localhost:5173
   http://localhost:5174
   https://your-domain.com
   https://your-domain.com/auth
   ```
   (Update with your actual domain when deployed)
6. Click **Create**
7. Copy your **Client ID** (you'll need this)

## Step 3: Add Google Client ID to Frontend

1. Open `src/components/AuthPage.jsx`
2. Find this line at the top:
   ```javascript
   const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE";
   ```
3. Replace with your actual Client ID (paste the ID you copied):
   ```javascript
   const GOOGLE_CLIENT_ID = "YOUR_ACTUAL_ID_FROM_GOOGLE.apps.googleusercontent.com";
   ```

### Or use environment variable (recommended):

1. Create/update `.env` file in root:
   ```env
   VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_ID_FROM_GOOGLE.apps.googleusercontent.com
   ```

2. Update AuthPage.jsx:
   ```javascript
   const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_FALLBACK_ID";
   ```

## Step 4: Update Backend (Already Done!)

The backend route `POST /api/auth/google` already handles Google authentication. It:
- Receives user info from frontend
- Creates/updates user in database
- Returns JWT token
- Auto-creates accounts without email verification (since Google is trusted)

## Step 5: Test It Out

1. Rebuild frontend:
   ```bash
   npm run build
   ```

2. Start backend (if not running):
   ```bash
   cd server
   npm run dev
   ```

3. Start frontend (in new terminal):
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173
5. Click "Sign in with Google"
6. Select your Google account
7. You should be authenticated immediately!

## How It Works

```
User clicks "Sign in with Google"
        ↓
Google popup appears
        ↓
User selects account and consents
        ↓
Frontend receives JWT from Google
        ↓
Frontend decodes JWT to extract: name, email, picture, google_id
        ↓
Frontend sends to backend: POST /api/auth/google
        ↓
Backend creates/updates user in database
        ↓
Backend returns JWT token
        ↓
Frontend stores token & user info in localStorage
        ↓
User is logged in! ✓
```

## Features

✅ **No email verification needed** - Google handles authentication  
✅ **Instant signup** - No OTP flow  
✅ **One-click login** - Seamless experience  
✅ **Secure** - Uses OAuth 2.0 flow  
✅ **User data** - Auto-captures name, email, profile picture  

## Troubleshooting

### "Google is not defined"
- Make sure the Google Sign-In script loads (check browser console)
- Wait 2-3 seconds after page loads before clicking button

### "Sign in with Google button doesn't work"
- Check that `GOOGLE_CLIENT_ID` is set correctly
- Make sure Client ID is from the right Google project
- Verify localhost:5173 is in "Authorized redirect URIs"

### "User not created in database"
- Check backend logs for errors
- Make sure `/api/auth/google` endpoint is working
- Backend needs to be running on port 3001

### "CORS error"
- Verify backend CORS is configured for your frontend URL
- Check `server/index.js` CORS settings

## For Production Deployment

When deploying to production:

1. **Update Google Cloud Console:**
   - Add your production domain to "Authorized redirect URIs"
   - Example: `https://creatify.example.com`

2. **Update Environment Variables:**
   - Set `VITE_GOOGLE_CLIENT_ID` to your Client ID
   - Make sure backend CORS includes your production domain

3. **Backend Changes:**
   ```javascript
   // In server/index.js
   const CORS_ORIGINS = [
     process.env.FRONTEND_URL || 'http://localhost:5173',
     'https://creatify.example.com'  // Add your domain
   ];
   ```

4. **Restart Services:**
   ```bash
   npm run build
   npm start  # or use your deployment method
   ```

## Security Notes

- ✅ OAuth credentials are never exposed to the frontend
- ✅ JWT tokens are short-lived and signed by your backend
- ✅ Refresh tokens should be stored securely (server-side recommended)
- ✅ Always use HTTPS in production
- ✅ Keep your OAuth Client ID secret (don't commit it to git)

---

**Questions?** Check the backend console logs and browser DevTools Network tab for debugging.
