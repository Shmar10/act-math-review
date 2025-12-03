# Fixing ERR_QUIC_PROTOCOL_ERROR

This error is related to the HTTP/3 (QUIC) protocol. Here are solutions:

## Quick Fixes (Try These First)

### Solution 1: Disable HTTP/3 in Chrome
1. Open Chrome
2. Go to: `chrome://flags/#enable-quic`
3. Find "Experimental QUIC protocol"
4. Set it to **Disabled**
5. Click **Relaunch** (Chrome will restart)
6. Try registering again

### Solution 2: Try a Different Browser
- Try Firefox or Edge
- If it works there, it's a Chrome/QUIC issue

### Solution 3: Check Your Network
- Try a different network (mobile hotspot, different WiFi)
- Sometimes corporate/school networks block QUIC

## Verify Supabase Configuration

### Step 1: Check Project is Active
1. Go to https://supabase.com
2. Open your project
3. Make sure it shows as **"Active"** (not paused)

### Step 2: Verify URL Configuration
1. In Supabase: **Authentication** → **Settings**
2. Under **URL Configuration**:
   - **Site URL**: Should be `http://localhost:5173`
   - **Redirect URLs**: Should include `http://localhost:5173/**`

### Step 3: Test Direct Connection
1. Open a new browser tab
2. Try accessing: `https://xlfaveiwrhtkjtwdriea.supabase.co` (your Supabase URL)
3. You should see some response (even if it's just an API response)
4. If it fails, there's a network/firewall issue

## Alternative: Use HTTP/2 Instead

The QUIC error happens when Chrome tries to use HTTP/3. You can force HTTP/2:

### In Chrome:
1. Go to: `chrome://flags/`
2. Search for "quic"
3. Disable all QUIC-related flags
4. Restart Chrome

## Check Firewall/Antivirus

Sometimes security software blocks QUIC:
- Temporarily disable firewall/antivirus
- Try registering
- If it works, add an exception for your browser

## Network Troubleshooting

### If on School/Corporate Network:
- QUIC might be blocked
- Try from home network or mobile hotspot
- Contact IT if needed

### Check Internet Connection:
- Try other websites
- Check if other HTTPS sites work
- Restart your router if needed

## Still Not Working?

Try these in order:
1. ✅ Disable QUIC in Chrome flags
2. ✅ Try different browser
3. ✅ Try different network
4. ✅ Check Supabase project is active
5. ✅ Verify Supabase URL settings

