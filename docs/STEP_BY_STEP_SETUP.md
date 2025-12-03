# Step-by-Step Setup Instructions

## ✅ Step 1: Install Supabase Client (COMPLETED)
The `@supabase/supabase-js` package has been installed.

## 📋 Step 2: Create Supabase Project

### 2.1 Create Account
1. Go to https://supabase.com
2. Click "Start your project" or "Sign up"
3. Sign up using GitHub, Google, or email

### 2.2 Create New Project
1. Click "New Project" button
2. Fill in project details:
   - **Name**: `act-math-review` (or your preferred name)
   - **Database Password**: Create a strong password (⚠️ SAVE THIS - you'll need it!)
   - **Region**: Choose the region closest to your users
   - **Pricing Plan**: Select "Free" tier (sufficient for development)
3. Click "Create new project"
4. ⏳ Wait 2-3 minutes for the project to initialize

### 2.3 Get API Keys
1. Once the project is ready, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see:
   - **Project URL**: Something like `https://xxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
   - **service_role key**: (Keep this secret! Only for backend operations)

4. **Copy both the URL and anon key** - you'll need them in the next step

## 📝 Step 3: Configure Environment Variables

### 3.1 Create .env File
1. In your project root directory, create a file named `.env`
2. Add the following content (replace with your actual values):

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Important**: 
   - Replace `your-project-id.supabase.co` with your actual Project URL
   - Replace `your-anon-key-here` with your actual anon public key
   - Do NOT include quotes around the values

### 3.2 Verify .env is Ignored
The `.env` file should already be in `.gitignore` (we added it). Verify it's there to prevent committing secrets.

## 🗄️ Step 4: Set Up Database Schema

### 4.1 Open SQL Editor
1. In your Supabase dashboard, click on **SQL Editor** in the left sidebar
2. Click **New query**

### 4.2 Run Schema Script
1. Open the file `database/schema.sql` in your project
2. Copy the entire contents of that file
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

### 4.3 Verify Tables Created
1. Click on **Table Editor** in the left sidebar
2. You should see three tables:
   - `user_profiles`
   - `user_progress`
   - `practice_sessions`

✅ If you see these tables, the schema is set up correctly!

## 🔧 Step 5: Configure Authentication Settings

### 5.1 Email Settings
1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Email Auth**, verify:
   - ✅ "Enable email confirmations" is checked
   - ✅ "Enable email signup" is checked

### 5.2 Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. You can customize the confirmation email template if desired
3. The default template will work fine for now

### 5.3 Site URL Configuration
1. Still in **Authentication** → **Settings**
2. Under **URL Configuration**:
   - **Site URL**: Set to your local development URL (e.g., `http://localhost:5173`)
   - **Redirect URLs**: Add:
     - `http://localhost:5173/**` (for local development)
     - `http://localhost:5173/auth/verify` (for email verification)
     - Add your production URL when ready

## ✅ Step 6: Verify Setup

### 6.1 Test Connection
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Open the browser console (F12)
3. Check for any errors related to Supabase

### 6.2 Test Environment Variables
The app will throw an error if environment variables are missing. If you see:
```
Missing Supabase environment variables...
```
Then check your `.env` file and restart the dev server.

## 🎉 Next Steps

Once setup is complete, we'll:
1. ✅ Create authentication components (Registration & Login forms)
2. ✅ Implement email verification flow
3. ✅ Add protected routes
4. ✅ Build user dashboard for viewing results
5. ✅ Set up progress syncing

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
- **Solution**: Check that `.env` file exists and has correct values
- Restart your dev server after creating/updating `.env`

### Issue: "Invalid API key"
- **Solution**: Double-check you copied the **anon public key**, not the service_role key
- Verify there are no extra spaces or quotes in `.env`

### Issue: "Failed to create table"
- **Solution**: Make sure you're running the SQL in the Supabase SQL Editor
- Check for syntax errors in the SQL script
- Some functions might already exist - that's okay, the script handles that

### Issue: Email not sending
- **Solution**: Check Supabase → Authentication → Settings → Email Auth
- Verify email confirmations are enabled
- Check spam folder for verification emails

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

