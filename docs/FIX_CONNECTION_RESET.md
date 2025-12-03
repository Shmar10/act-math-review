# Fixing ERR_CONNECTION_RESET Error

This error means the connection to Supabase is being reset. Here's how to fix it:

## Step 1: Verify Supabase Project is Active

1. Go to https://supabase.com
2. Open your project dashboard
3. **Check the project status** - it should show "Active"
4. If it shows "Paused" or "Inactive":
   - Click "Resume" or "Restore"
   - Wait 2-3 minutes for it to fully start
   - Free tier projects pause after inactivity

## Step 2: Test Direct Connection

1. Open a new browser tab
2. Try accessing your Supabase URL directly:
   - `https://xlfaveiwrhtkjtwdriea.supabase.co`
3. You should see some response (even if it's just an API response)
4. If it fails or times out, the project might be down

## Step 3: Check Network/Firewall

### Try Different Network:
- Switch to a different WiFi network
- Try mobile hotspot
- Some networks block certain connections

### Check Firewall/Antivirus:
- Temporarily disable firewall/antivirus
- Try registering again
- If it works, add an exception

## Step 4: Verify URL Configuration in Supabase

1. In Supabase: **Authentication** → **URL Configuration**
2. Make sure:
   - **Site URL**: `http://localhost:5173`
   - **Redirect URLs** includes:
     - `http://localhost:5173/**`
     - `http://localhost:5173/auth/verify`
     - `http://localhost:5173/act-math-review/**`
     - `http://localhost:5173/act-math-review/auth/verify`
3. **Save** the changes

## Step 5: Check Your .env File

Verify your `.env` file has the correct format:

```
VITE_SUPABASE_URL=https://xlfaveiwrhtkjtwdriea.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:**
- No trailing slash after `.co`
- Use `https://` not `http://`
- No quotes around values

## Step 6: Restart Everything

1. **Stop dev server** (Ctrl+C)
2. **Clear browser cache** (Ctrl+Shift+Delete) or use incognito
3. **Start dev server**: `npm run dev`
4. **Refresh browser** (F5)

## Step 7: Check Supabase Status

1. Go to https://status.supabase.com
2. Check if there are any service issues
3. If Supabase is having problems, wait and try again later

## Alternative: Test with Supabase Dashboard

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Try manually creating a test user
3. If that works, the project is fine - it's a connection issue
4. If that fails, the project might be paused or having issues

## Most Common Causes

1. **Project is Paused** (most common on free tier)
   - Solution: Resume the project in Supabase dashboard

2. **Network/Firewall Blocking**
   - Solution: Try different network or disable firewall temporarily

3. **Incorrect URL Configuration**
   - Solution: Double-check URL Configuration in Supabase

4. **Supabase Service Issues**
   - Solution: Check status.supabase.com

## Still Not Working?

Try these diagnostic steps:

1. **Test Supabase URL in browser:**
   - Go to: `https://xlfaveiwrhtkjtwdriea.supabase.co/rest/v1/`
   - You should see some response (even if it's an error about missing table)

2. **Check browser Network tab:**
   - Press F12 → Network tab
   - Try registering
   - Look at the failed request
   - Check the status code and response

3. **Try from different device/network:**
   - If it works elsewhere, it's a network/firewall issue on your machine

4. **Contact Supabase Support:**
   - If nothing works, there might be an issue with your specific project

