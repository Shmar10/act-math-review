# Solutions for School Network Issues

If you're experiencing "Failed to Fetch" errors when trying to create an account on a school or work network, this guide will help you resolve it.

## Why This Happens

School and corporate networks often have:
- **Firewalls** that block external API connections
- **Proxy servers** that interfere with HTTPS requests
- **Content filters** that restrict certain domains
- **Protocol restrictions** (blocking HTTP/3 QUIC)
- **CORS policies** that prevent cross-origin requests

## Solutions (Try in Order)

### Solution 1: Use a Mobile Hotspot ⭐ (Easiest)

**Best option if available:**
1. Disconnect from school WiFi
2. Enable mobile hotspot on your phone
3. Connect your computer to the hotspot
4. Try creating an account again

**Why it works:** Mobile networks don't have the same restrictions as school networks.

---

### Solution 2: Use Home Network

If you're at school, try again when you're at home:
- Home networks typically don't block external services
- This is the most reliable long-term solution

---

### Solution 3: Contact IT Department

**Ask your IT department to whitelist:**
- **Supabase domain**: `*.supabase.co`
- **Specific URL**: Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)

**What to tell them:**
- "I need to access a learning application that uses Supabase for authentication"
- "The domain is `*.supabase.co` and needs HTTPS access"
- "It's a legitimate educational tool for ACT math practice"

**Why this helps:** IT can add Supabase to the allowed list, making it work for all students.

---

### Solution 4: Use a VPN (If Allowed)

**Important:** Only use if your school allows VPNs!

1. Install a reputable VPN service
2. Connect to a VPN server
3. Try creating an account again

**Why it works:** VPNs route traffic through different servers, bypassing local restrictions.

**Note:** Some schools block VPNs too, so this may not work.

---

### Solution 5: Browser Settings

Try these browser-specific fixes:

#### Chrome:
1. Go to `chrome://flags/`
2. Search for "quic"
3. Set "Experimental QUIC protocol" to **Disabled**
4. Restart Chrome
5. Try again

#### Firefox:
1. Go to `about:config`
2. Search for `network.http.http3.enabled`
3. Set it to `false`
4. Restart Firefox
5. Try again

**Why it works:** Forces HTTP/2 instead of HTTP/3, which some networks block.

---

### Solution 6: Disable Proxy Settings

If your school uses a proxy:

1. **Chrome/Edge:**
   - Settings → Advanced → System
   - Turn off "Use a proxy server"

2. **Firefox:**
   - Settings → Network Settings
   - Select "No proxy"

**Note:** This may break other school network features.

---

### Solution 7: Try Different Browser

Sometimes one browser works while another doesn't:
- Try Chrome if you're using Firefox
- Try Firefox if you're using Chrome
- Try Edge as a third option

---

## For IT Administrators

If you're an IT administrator wanting to allow this application:

### Required Whitelist Entries:

1. **Supabase API Domain:**
   ```
   *.supabase.co
   ```

2. **Specific Project URL:**
   ```
   https://[project-id].supabase.co
   ```

3. **Allow HTTPS on port 443** for these domains

4. **CORS Headers:** Allow cross-origin requests from your school domain

### Firewall Rules:

- **Outbound HTTPS (443)** to `*.supabase.co`
- **Allow** WebSocket connections (for real-time features)
- **No content filtering** for Supabase domains

### Proxy Configuration:

If using a proxy:
- Add Supabase domains to bypass list
- Ensure SSL inspection doesn't break certificates
- Allow WebSocket upgrades

---

## Testing Your Connection

To test if Supabase is accessible:

1. Open browser console (F12)
2. Run this command:
   ```javascript
   fetch('https://your-project-id.supabase.co/rest/v1/', {
     headers: { 'apikey': 'your-anon-key' }
   }).then(r => console.log('Success:', r.status))
     .catch(e => console.error('Failed:', e))
   ```

3. If you see "Success: 200" → Connection works
4. If you see "Failed" → Network is blocking it

---

## Alternative: Offline Mode (Future Feature)

We're considering adding an offline mode that:
- Allows practice without authentication
- Syncs progress when network is available
- Works entirely offline for practice sessions

**This would solve the school network issue completely!**

---

## Summary

**Quick Fix:** Use mobile hotspot or home network

**Long-term Fix:** Contact IT to whitelist Supabase

**Workaround:** Use VPN (if allowed) or different browser

**Best Solution:** IT whitelisting (helps all students)

---

## Still Having Issues?

If none of these solutions work:
1. Check browser console for specific error messages
2. Try accessing Supabase dashboard directly: https://supabase.com
3. Test on a completely different network (coffee shop, library)
4. Contact support with:
   - Your network type (school/work/home)
   - Browser and version
   - Exact error message
   - Whether mobile hotspot works

