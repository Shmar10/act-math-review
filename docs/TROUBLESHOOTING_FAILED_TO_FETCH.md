# Troubleshooting: "Failed to Fetch" Error

If you're getting a "Failed to fetch" error when trying to create an account, here's how to fix it:

## Common Causes & Solutions

### 1. Environment Variables Not Loaded

**Problem:** The `.env` file isn't being read by the dev server.

**Solution:**
1. **Stop your dev server** (Ctrl+C in terminal)
2. **Verify your `.env` file:**
   - Open `.env` in VS Code
   - Make sure it has exactly these two lines (with YOUR values):
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```
   - No quotes, no spaces around `=`
3. **Restart dev server:**
   ```bash
   npm run dev
   ```
4. **Refresh browser** (F5)

### 2. Incorrect Supabase URL

**Problem:** The URL in your `.env` file is wrong.

**Solution:**
1. Go to Supabase dashboard: https://supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (should look like `https://xxxxx.supabase.co`)
5. Update your `.env` file with the correct URL
6. Restart dev server

### 3. Incorrect or Missing API Key

**Problem:** The anon key is wrong or missing.

**Solution:**
1. In Supabase: **Settings** → **API**
2. Copy the **anon public** key (the long string starting with `eyJ...`)
3. Make sure you copied the **entire** key (it's very long!)
4. Update your `.env` file
5. Restart dev server

### 4. Supabase Project Not Active

**Problem:** Your Supabase project might be paused or inactive.

**Solution:**
1. Go to Supabase dashboard
2. Check if your project shows as "Active"
3. If it's paused, click "Resume" or "Restore"
4. Wait a minute for it to start up

### 5. Network/Firewall Issue

**Problem:** Your network is blocking the connection.

**Solution:**
1. Check your internet connection
2. Try accessing your Supabase URL directly in browser:
   - Go to: `https://your-project-id.supabase.co`
   - You should see a Supabase page (even if it's just an API response)
3. If you can't access it, there might be a firewall blocking it

### 6. CORS Configuration

**Problem:** Supabase CORS settings might be blocking your localhost.

**Solution:**
1. In Supabase: **Settings** → **API**
2. Under **CORS**, make sure your localhost is allowed
3. Or check **Authentication** → **Settings** → **URL Configuration**
4. Make sure `http://localhost:5173` is in the allowed URLs

## Quick Diagnostic Steps

### Step 1: Check Browser Console
1. Press **F12** to open Developer Tools
2. Click **Console** tab
3. Look for error messages
4. Check the **Network** tab to see if the request is being made

### Step 2: Verify Environment Variables
1. In browser console (F12), type:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   ```
2. It should show your Supabase URL (not `undefined`)
3. If it shows `undefined`, your `.env` file isn't being read

### Step 3: Test Supabase Connection
1. In browser console, type:
   ```javascript
   fetch('https://your-project-id.supabase.co/rest/v1/', {
     headers: {
       'apikey': 'your-anon-key-here'
     }
   }).then(r => console.log('Connection:', r.status))
   ```
2. Replace with your actual URL and key
3. If it fails, there's a connection issue

## Step-by-Step Fix

1. **Verify `.env` file exists and is correct**
   - File location: project root (same folder as `package.json`)
   - Format: No quotes, no spaces
   - Values: Correct URL and key from Supabase

2. **Restart dev server**
   - Stop: Ctrl+C
   - Start: `npm run dev`
   - Wait for it to fully start

3. **Clear browser cache**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Or try incognito/private window

4. **Check Supabase project**
   - Log into Supabase dashboard
   - Verify project is active
   - Check API keys are correct

5. **Try again**
   - Refresh browser
   - Try registering again

## Still Not Working?

### Check These:

1. **Is your Supabase project on the free tier?**
   - Free tier projects can be paused after inactivity
   - Check dashboard to see if it's active

2. **Are you using the correct keys?**
   - Make sure you're using **anon public** key, not service_role key
   - The anon key starts with `eyJ...`

3. **Is the URL correct?**
   - Should be: `https://xxxxx.supabase.co`
   - No trailing slash
   - No extra characters

4. **Check terminal output**
   - Look for any errors when starting dev server
   - Check if Vite is reading the `.env` file

### Get More Help:

If none of these work, share:
1. The exact error message from browser console
2. What you see in the Network tab (F12 → Network)
3. Your `.env` file format (you can hide the actual keys, just show the structure)
4. Whether you can access your Supabase URL directly in browser

