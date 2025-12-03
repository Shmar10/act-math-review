# Troubleshooting: Blank Page Issue

If you're seeing a blank page (just the blue background), here's how to fix it:

## Most Common Cause: Missing .env File or Not Restarted Server

### Solution 1: Check Your .env File

1. **Verify the file exists:**
   - In VS Code, look in the left sidebar (File Explorer)
   - You should see `.env` file in the root folder
   - If you don't see it, it might be hidden - check "Show Hidden Files" in VS Code

2. **Check the file contents:**
   - Open `.env` file
   - It should have exactly these two lines (with YOUR values):
     ```
     VITE_SUPABASE_URL=https://your-project-id.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key-here
     ```
   - **No quotes** around values
   - **No spaces** around the `=` sign

### Solution 2: Restart Your Dev Server

**This is the most important step!**

1. In your terminal (where `npm run dev` is running):
   - Press **Ctrl+C** to stop the server
   - Wait for it to fully stop
   
2. Start it again:
   ```bash
   npm run dev
   ```

3. **Refresh your browser** (F5 or Ctrl+R)

**Why?** Vite (the dev server) only reads `.env` files when it starts. If you created the file after starting the server, it won't see it until you restart.

### Solution 3: Check Browser Console

1. Open your browser
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Look for any red error messages
5. Common errors:
   - "Missing Supabase environment variables" → Your `.env` file isn't being read
   - "Failed to fetch" → Network issue or wrong URL
   - Other errors → Share the error message

### Solution 4: Verify .env File Location

The `.env` file **must** be in the project root:
```
act-math-review/
├── .env              ← Must be here!
├── package.json
├── src/
├── public/
└── ...
```

**Not** in a subfolder like `src/.env` or `config/.env`

### Solution 5: Check File Format

Your `.env` file should look like this:

**✅ Correct:**
```
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**❌ Wrong (with quotes):**
```
VITE_SUPABASE_URL="https://xyzabc123.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**❌ Wrong (with spaces):**
```
VITE_SUPABASE_URL = https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Quick Fix Checklist

Run through these steps in order:

1. [ ] `.env` file exists in project root
2. [ ] `.env` file has correct format (no quotes, no spaces)
3. [ ] Dev server was **restarted** after creating `.env`
4. [ ] Browser was **refreshed** after restarting server
5. [ ] Checked browser console (F12) for errors
6. [ ] Verified Supabase URL and key are correct

## Still Not Working?

### Check Terminal Output

Look at your terminal where `npm run dev` is running. You should see:
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

If you see errors, share them.

### Verify Environment Variables Are Loaded

1. Open browser console (F12)
2. Type this in the console:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL)
   ```
3. If it shows `undefined`, your `.env` file isn't being read
4. If it shows your URL, the file is being read correctly

### Try This Test

1. Stop your dev server (Ctrl+C)
2. Delete `.env` file (or rename it to `.env.backup`)
3. Start server: `npm run dev`
4. You should see a warning banner at the top about missing env vars
5. If you see the warning, the app is working - just need to fix `.env`
6. If you still see blank page, there's a different issue

## Need More Help?

If none of these work:
1. Share the error message from browser console (F12)
2. Share what you see in the terminal
3. Verify your `.env` file contents (you can hide the actual keys, just show the format)

