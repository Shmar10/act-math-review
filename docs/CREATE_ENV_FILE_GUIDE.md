# How to Create a .env File - Step by Step Guide

## What is a .env file?

A `.env` file is a simple text file that stores environment variables (like API keys and URLs) for your project. It's kept secret and not shared in git.

## Method 1: Using VS Code (Easiest)

### Step 1: Open Your Project in VS Code
1. Make sure VS Code is open with your project
2. You should see your project files in the left sidebar

### Step 2: Create the File
1. **Right-click** in the left sidebar (File Explorer) on the root folder (`act-math-review`)
2. Select **"New File"** from the menu
3. Type exactly: `.env` (that's a dot, then env, nothing else)
4. Press **Enter**

### Step 3: Add Your Content
1. Click on the `.env` file you just created
2. Copy and paste this into the file:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. **Replace the values** with your actual Supabase values:
   - Replace `https://your-project-id.supabase.co` with your actual Project URL
   - Replace `your-anon-key-here` with your actual anon public key
4. **Save the file** (Ctrl+S or File → Save)

### Step 4: Verify It's Correct
Your `.env` file should look like this (with YOUR actual values):
```
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.example
```

**Important Notes:**
- No quotes around the values
- No spaces around the `=` sign
- Each line should have exactly one variable
- Make sure there are no extra spaces at the beginning or end of lines

---

## Method 2: Using Windows File Explorer

### Step 1: Open File Explorer
1. Press **Windows Key + E** to open File Explorer
2. Navigate to your project folder: `C:\Users\shama\act-math-review\act-math-review`

### Step 2: Create the File
1. In the project folder, **right-click** in an empty area
2. Select **"New"** → **"Text Document"**
3. Name it exactly: `.env` (including the dot at the beginning)
4. Windows might warn you about changing the file extension - click **"Yes"**

### Step 3: Open and Edit
1. **Right-click** the `.env` file
2. Select **"Open with"** → **"Notepad"** (or your preferred text editor)
3. Paste this content:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Replace with your actual values
5. **Save** (Ctrl+S) and close

---

## Method 3: Using PowerShell (Command Line)

### Step 1: Open PowerShell in Your Project
1. In VS Code, open the terminal (View → Terminal, or press `` Ctrl+` ``)
2. Make sure you're in the project directory (you should see the path ending with `act-math-review`)

### Step 2: Create the File
Type this command and press Enter:
```powershell
New-Item -Path .env -ItemType File
```

### Step 3: Add Content
Type this command (replace with your actual values):
```powershell
@"
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
"@ | Out-File -FilePath .env -Encoding utf8
```

**Or** open it in VS Code and edit manually:
```powershell
code .env
```

---

## How to Get Your Supabase Values

### Step 1: Go to Supabase Dashboard
1. Go to https://supabase.com
2. Sign in to your account
3. Click on your project (`act-math-review`)

### Step 2: Get Project URL
1. In the left sidebar, click **Settings** (gear icon)
2. Click **API** in the settings menu
3. Find **Project URL** - it looks like: `https://abcdefghijklmnop.supabase.co`
4. **Copy this entire URL**

### Step 3: Get Anon Key
1. Still in Settings → API
2. Find **anon public** key - it's a long string starting with `eyJ...`
3. **Copy this entire key** (it's very long, make sure you get it all)

### Step 4: Paste Into .env File
1. Open your `.env` file
2. Replace `https://your-project-id.supabase.co` with your Project URL
3. Replace `your-anon-key-here` with your anon public key

---

## Example of a Correct .env File

Here's what a real `.env` file should look like (with example values):

```
VITE_SUPABASE_URL=https://xyzabc123456789.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMzQ1Njc4OSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjM4OTY3MjkwLCJleHAiOjE5NTQ1NDMyOTB9.abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

**Notice:**
- ✅ No quotes
- ✅ No spaces around `=`
- ✅ Each value on its own line
- ✅ Real-looking URLs and keys

---

## Common Mistakes to Avoid

### ❌ Wrong: Using Quotes
```
VITE_SUPABASE_URL="https://xyz.supabase.co"  ← Don't use quotes!
VITE_SUPABASE_ANON_KEY="eyJ..."  ← Don't use quotes!
```

### ❌ Wrong: Spaces Around Equals
```
VITE_SUPABASE_URL = https://xyz.supabase.co  ← No spaces!
```

### ❌ Wrong: Missing Values
```
VITE_SUPABASE_URL=  ← Don't leave empty!
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### ✅ Correct Format
```
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## Verify Your .env File is Working

### Step 1: Restart Your Dev Server
1. If your dev server is running, **stop it** (Ctrl+C in terminal)
2. Start it again: `npm run dev`

### Step 2: Check for Errors
1. Open your browser console (F12)
2. Look for any errors about "Missing Supabase environment variables"
3. If you see that error, check your `.env` file again

### Step 3: Test Registration
1. Try to register a new account
2. If it works, your `.env` file is correct! ✅
3. If you get errors, double-check your values

---

## Still Having Trouble?

### Can't See the File?
- In VS Code, the `.env` file might be hidden
- Click the "Explorer" icon in the left sidebar
- Look for `.env` in the file list
- If you don't see it, click the "Refresh" icon

### File Won't Save?
- Make sure you have write permissions to the folder
- Try saving with a different name first (like `env.txt`), then rename it to `.env`

### Getting "File Not Found" Error?
- Make sure the `.env` file is in the **root** of your project
- The path should be: `act-math-review/act-math-review/.env`
- Not in a subfolder!

### Need More Help?
- Check that the file is named exactly `.env` (with the dot)
- Make sure there are no extra characters in the filename
- Verify the file is in the same folder as `package.json`

---

## Quick Checklist

Before moving to Step 3 (Set Up Database), make sure:

- [ ] `.env` file exists in project root
- [ ] File contains `VITE_SUPABASE_URL=...` (with your actual URL)
- [ ] File contains `VITE_SUPABASE_ANON_KEY=...` (with your actual key)
- [ ] No quotes around values
- [ ] No spaces around `=` signs
- [ ] File is saved
- [ ] You've restarted your dev server after creating the file

Once all these are checked, you're ready for the next step! 🎉

