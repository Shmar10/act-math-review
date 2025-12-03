# Complete Setup Walkthrough - From Zero to Working

This guide walks you through EVERY step, assuming you've never done this before.

---

## Part 1: Create Supabase Account and Project

### Step 1.1: Go to Supabase
1. Open your web browser
2. Go to: **https://supabase.com**
3. Click the **"Start your project"** button (usually in the top right)

### Step 1.2: Sign Up
1. Choose how to sign up:
   - **Option A**: Sign up with GitHub (if you have a GitHub account)
   - **Option B**: Sign up with Google
   - **Option C**: Sign up with Email (create a new account)
2. Complete the sign-up process

### Step 1.3: Create New Project
1. Once logged in, you'll see a dashboard
2. Click the **"New Project"** button (usually green, in the top right)
3. Fill in the form:
   - **Name**: Type `act-math-review`
   - **Database Password**: 
     - Create a strong password (you'll need this later)
     - **Write it down somewhere safe!**
     - Example: `MySecurePassword123!`
   - **Region**: Choose the one closest to you (e.g., "US East" if you're in the US)
   - **Pricing Plan**: Select **"Free"** (it's free forever for small projects)
4. Click **"Create new project"**
5. ⏳ **Wait 2-3 minutes** - Supabase is setting up your database

### Step 1.4: Get Your API Keys
1. Once your project is ready, you'll see a dashboard
2. In the **left sidebar**, click **Settings** (it looks like a gear icon ⚙️)
3. In the settings menu, click **API**
4. You'll see two important things:
   - **Project URL**: Something like `https://abcdefghijklmnop.supabase.co`
   - **anon public key**: A very long string starting with `eyJ...`
5. **Copy both of these** - you'll need them in the next step
   - You can click the copy icon next to each one
   - Or select and copy (Ctrl+C)

---

## Part 2: Create .env File

### Step 2.1: Open Your Project in VS Code
1. Open **Visual Studio Code** (VS Code)
2. Click **File** → **Open Folder**
3. Navigate to: `C:\Users\shama\act-math-review\act-math-review`
4. Click **Select Folder**

### Step 2.2: Create the .env File
1. In VS Code, look at the **left sidebar** (File Explorer)
2. You should see your project files
3. **Right-click** on the folder name at the top (the root folder)
4. Select **"New File"**
5. Type exactly: `.env` (that's a dot, then the letters "env")
6. Press **Enter**

### Step 2.3: Add Your Supabase Values
1. Click on the `.env` file you just created (it should be in the file list)
2. The file will open in the editor
3. Type or paste this (exactly as shown):
   ```
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```
4. Now add your values:
   - After `VITE_SUPABASE_URL=`, paste your **Project URL** (no spaces!)
   - After `VITE_SUPABASE_ANON_KEY=`, paste your **anon public key** (no spaces!)
5. Your file should look like this (but with YOUR values):
   ```
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.example
   ```
6. **Save the file**: Press **Ctrl+S** or click **File** → **Save**

### Step 2.4: Verify the File
1. Make sure there are **NO quotes** around your values
2. Make sure there are **NO spaces** before or after the `=` sign
3. Make sure each line has exactly one variable
4. The file should be in the **root** of your project (same folder as `package.json`)

---

## Part 3: Set Up Database

### Step 3.1: Open SQL Editor in Supabase
1. Go back to your Supabase dashboard in your browser
2. In the **left sidebar**, click **SQL Editor**
3. Click **"New query"** button (usually at the top)

### Step 3.2: Get the Schema File
1. Go back to VS Code
2. In your project, find the file: `database/schema.sql`
3. **Open** that file
4. **Select all** the text (Ctrl+A)
5. **Copy** it (Ctrl+C)

### Step 3.3: Run the SQL
1. Go back to Supabase SQL Editor in your browser
2. **Paste** the SQL code you just copied (Ctrl+V)
3. Click the **"Run"** button (or press Ctrl+Enter)
4. You should see a success message like "Success. No rows returned"

### Step 3.4: Verify Tables Were Created
1. In Supabase, click **Table Editor** in the left sidebar
2. You should see three tables:
   - `user_profiles`
   - `user_progress`
   - `practice_sessions`
3. If you see these, ✅ **Success!** Your database is set up

---

## Part 4: Configure Authentication

### Step 4.1: Open Authentication Settings
1. In Supabase dashboard, click **Authentication** in the left sidebar
2. Click **Settings** (in the Authentication submenu)

### Step 4.2: Configure URLs
1. Scroll down to **"URL Configuration"**
2. Find **"Site URL"**:
   - Delete whatever is there
   - Type: `http://localhost:5173`
3. Find **"Redirect URLs"**:
   - Click **"Add URL"** or the **+** button
   - Type: `http://localhost:5173/**`
   - Click **"Add"** or press Enter
   - Add another: `http://localhost:5173/auth/verify`
4. Scroll down and click **"Save"** (if there's a save button)

### Step 4.3: Verify Email Settings
1. Still in Authentication → Settings
2. Scroll to **"Email Auth"** section
3. Make sure these are checked:
   - ✅ "Enable email signup"
   - ✅ "Enable email confirmations"
4. If they're not checked, check them and save

---

## Part 5: Test Everything

### Step 5.1: Start Your Development Server
1. Go back to VS Code
2. Open the **Terminal** (View → Terminal, or press `` Ctrl+` ``)
3. Make sure you're in the project directory
4. Type: `npm run dev`
5. Press **Enter**
6. Wait for it to start - you should see something like:
   ```
   VITE v7.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

### Step 5.2: Open Your App
1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see a **login/register page**

### Step 5.3: Test Registration
1. Click **"Create one"** or the register button
2. Fill in the form:
   - **First Name**: Your first name
   - **Last Name**: Your last name
   - **Email**: Your real email address
   - **Password**: At least 8 characters
   - **Confirm Password**: Same password
3. Click **"Create Account"**
4. You should see a success message saying to check your email

### Step 5.4: Verify Your Email
1. Check your email inbox
2. Look for an email from Supabase
3. **Click the verification link** in the email
4. You should be redirected back to your app
5. You should now be **logged in**! ✅

### Step 5.5: Test Login
1. Click **"Logout"** (in the top right)
2. You should see the login page again
3. Enter your email and password
4. Click **"Sign In"**
5. You should be logged in again! ✅

---

## Troubleshooting

### Problem: "Missing Supabase environment variables"
**Solution:**
1. Check that `.env` file exists in project root
2. Check that values are correct (no quotes, no spaces)
3. **Restart your dev server** (stop with Ctrl+C, then run `npm run dev` again)

### Problem: Can't create .env file
**Solution:**
- Try Method 2 or 3 from `CREATE_ENV_FILE_GUIDE.md`
- Make sure you're in the project root folder

### Problem: Email not received
**Solution:**
1. Check spam/junk folder
2. Wait a few minutes (emails can be delayed)
3. In Supabase: Authentication → Settings → check email is enabled
4. Try clicking "Resend Verification Email" on the verification page

### Problem: Database errors
**Solution:**
1. Make sure you ran the entire SQL script
2. Check Table Editor to see if tables exist
3. If tables don't exist, run the SQL again

### Problem: Can't login after registration
**Solution:**
1. Make sure you verified your email (clicked the link)
2. Try logging in with the email and password you used
3. Check for error messages in the browser console (F12)

---

## Success Checklist

Before you consider setup complete, verify:

- [ ] Supabase project created
- [ ] API keys copied to `.env` file
- [ ] `.env` file saved in project root
- [ ] Database schema run successfully
- [ ] Tables visible in Table Editor
- [ ] Authentication URLs configured
- [ ] Dev server starts without errors
- [ ] Can register a new account
- [ ] Received verification email
- [ ] Can verify email and login
- [ ] Can logout and login again

If all these are checked, **you're all set!** 🎉

---

## Next Steps

Once everything is working:
1. You can start using the app with user accounts
2. Users can register, verify email, and login
3. Next features to build: Results dashboard, progress syncing, profile page

See `README_USER_ACCOUNTS.md` for what's next!

