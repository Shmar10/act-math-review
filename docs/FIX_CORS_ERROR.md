# Fixing CORS Error with Supabase

The "Cross-Origin Request Blocked" error means Supabase isn't allowing requests from your localhost. Here's how to fix it:

## Step 1: Configure Supabase URL Settings

### In Supabase Dashboard:

1. **Go to your Supabase project**: https://supabase.com
2. **Click Authentication** (left sidebar)
3. **Click Settings** (under Authentication)
4. **Scroll to "URL Configuration"**

### Configure These Settings:

1. **Site URL:**
   - Set to: `http://localhost:5173`
   - This is your local development URL

2. **Redirect URLs:**
   - Click **"Add URL"** or the **+** button
   - Add: `http://localhost:5173/**`
   - Click **"Add"** or press Enter
   - Add another: `http://localhost:5173/auth/verify`
   - Add: `http://localhost:5173/act-math-review/**`
   - Add: `http://localhost:5173/act-math-review/auth/verify`

3. **Click "Save"** (if there's a save button)

## Step 2: Verify Project is Active

1. In Supabase dashboard, check your project status
2. Make sure it shows **"Active"** (not "Paused")
3. If paused, click **"Resume"** or **"Restore"**
4. Wait a minute for it to fully start

## Step 3: Check API Settings

1. In Supabase: **Settings** → **API**
2. Verify:
   - **Project URL** matches what's in your `.env` file
   - **anon public key** matches what's in your `.env` file

## Step 4: Update Your .env File

Make sure your `.env` file has the correct URL format:

```
VITE_SUPABASE_URL=https://xlfaveiwrhtkjtwdriea.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:**
- No trailing slash after `.co`
- No `http://` - use `https://`
- Full URL including `https://`

## Step 5: Restart Everything

1. **Stop your dev server** (Ctrl+C)
2. **Restart dev server**: `npm run dev`
3. **Clear browser cache** or use incognito/private window
4. **Refresh the page**

## Common Issues

### Issue: "Project is Paused"
- Free tier projects pause after inactivity
- Go to Supabase dashboard and resume the project
- Wait 1-2 minutes for it to fully start

### Issue: Wrong Redirect URL Format
- Make sure you added: `http://localhost:5173/**`
- The `/**` at the end is important (allows all paths)
- Also add the specific paths: `/auth/verify`

### Issue: Site URL Not Set
- The Site URL must be set to your localhost
- Without this, Supabase blocks CORS requests

## Still Not Working?

### Check Browser Console Network Tab:
1. Press **F12** → **Network** tab
2. Try registering again
3. Look for the failed request
4. Check the **Response Headers** - do you see CORS headers?

### Verify Supabase Project:
1. Try accessing your Supabase URL directly in browser:
   - `https://xlfaveiwrhtkjtwdriea.supabase.co`
   - You should see some response (even if it's an API response)
2. If it fails, the project might be down

### Test with Different URL:
If your app is at `http://localhost:5173/act-math-review/`, make sure you added that path to Redirect URLs in Supabase.

