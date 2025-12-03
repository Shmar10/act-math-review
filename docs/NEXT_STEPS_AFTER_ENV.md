# Next Steps After Creating .env File

Great! You've created your `.env` file. Now let's finish the setup.

## Step 3: Set Up Database Schema

### Step 3.1: Open SQL Editor in Supabase
1. Go to your Supabase dashboard: https://supabase.com
2. Make sure you're in your project (`act-math-review`)
3. In the **left sidebar**, click **SQL Editor**
4. Click the **"New query"** button (top of the page)

### Step 3.2: Get the Schema File
1. In VS Code, open the file: `database/schema.sql`
2. **Select all** the text (Ctrl+A)
3. **Copy** it (Ctrl+C)

### Step 3.3: Run the SQL
1. Go back to Supabase SQL Editor in your browser
2. **Paste** the SQL code (Ctrl+V) into the editor
3. Click the **"Run"** button (or press Ctrl+Enter)
4. You should see: **"Success. No rows returned"** ✅

### Step 3.4: Verify Tables
1. In Supabase, click **Table Editor** in the left sidebar
2. You should see **three tables**:
   - ✅ `user_profiles`
   - ✅ `user_progress`
   - ✅ `practice_sessions`
3. If you see these, the database is set up correctly!

---

## Step 4: Configure Authentication URLs

### Step 4.1: Open Authentication Settings
1. In Supabase dashboard, click **Authentication** (left sidebar)
2. Click **Settings** (under Authentication)

### Step 4.2: Set Site URL
1. Scroll to **"URL Configuration"**
2. Find **"Site URL"**
3. Enter: `http://localhost:5173`

### Step 4.3: Add Redirect URLs
1. Find **"Redirect URLs"** section
2. Click **"Add URL"** or the **+** button
3. Add this URL: `http://localhost:5173/**`
4. Click **"Add"** or press Enter
5. Add another URL: `http://localhost:5173/auth/verify`
6. Click **"Save"** (if there's a save button)

### Step 4.4: Verify Email Settings
1. Still in Authentication → Settings
2. Scroll to **"Email Auth"** section
3. Make sure these are **checked**:
   - ✅ "Enable email signup"
   - ✅ "Enable email confirmations"

---

## Step 5: Test Everything!

### Step 5.1: Start Your Dev Server
1. In VS Code, open the **Terminal** (View → Terminal, or `` Ctrl+` ``)
2. Make sure you're in the project directory
3. Type: `npm run dev`
4. Press **Enter**
5. Wait for it to start - you should see:
   ```
   ➜  Local:   http://localhost:5173/
   ```

### Step 5.2: Open Your App
1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see a **login/register page**! 🎉

### Step 5.3: Test Registration
1. Click **"Create one"** or the register button
2. Fill in:
   - First Name: Your name
   - Last Name: Your last name
   - Email: Your real email
   - Password: At least 8 characters
   - Confirm Password: Same password
3. Click **"Create Account"**
4. You should see: "Registration Successful! Check your email"

### Step 5.4: Verify Email
1. Check your **email inbox**
2. Look for email from Supabase
3. **Click the verification link**
4. You should be redirected and **logged in**! ✅

### Step 5.5: Test Login/Logout
1. Click **"Logout"** (top right)
2. You should see login page
3. Enter email and password
4. Click **"Sign In"**
5. You should be logged in again! ✅

---

## Troubleshooting

### Error: "Missing Supabase environment variables"
- **Solution**: Restart your dev server (stop with Ctrl+C, then `npm run dev` again)
- The server needs to be restarted after creating `.env` file

### Error: Can't see tables
- Make sure you ran the **entire** SQL script
- Check Table Editor to verify tables exist
- If not, run the SQL again

### Error: Email not received
- Check **spam/junk** folder
- Wait a few minutes (can be delayed)
- Try "Resend Verification Email" button

### Error: Can't login
- Make sure you **verified your email** (clicked the link)
- Check you're using the correct email and password
- Check browser console (F12) for error messages

---

## Success Checklist

Before moving on, verify:

- [ ] `.env` file created with correct values
- [ ] Database schema run successfully
- [ ] Three tables visible in Table Editor
- [ ] Authentication URLs configured
- [ ] Dev server starts without errors
- [ ] Can see login/register page
- [ ] Can register a new account
- [ ] Received verification email
- [ ] Can verify email and login
- [ ] Can logout and login again

If all checked, **you're done with setup!** 🎉

---

## What's Next?

Once everything is working:
- Users can now register and login
- Email verification is working
- Next features to build:
  - Results dashboard (view progress)
  - Progress syncing (save to server)
  - Profile page (edit account)

See `README_USER_ACCOUNTS.md` for more details!

