# Supabase Setup Guide - Step by Step

## Step 1: Create Supabase Account and Project

1. **Go to Supabase**
   - Visit https://supabase.com
   - Click "Start your project" or "Sign up"

2. **Sign Up / Sign In**
   - Use GitHub, Google, or email to create an account
   - Complete the sign-up process

3. **Create a New Project**
   - Click "New Project" button
   - Fill in the project details:
     - **Name**: `act-math-review` (or your preferred name)
     - **Database Password**: Create a strong password (save this!)
     - **Region**: Choose closest to your users
     - **Pricing Plan**: Free tier is fine to start
   - Click "Create new project"
   - Wait 2-3 minutes for project to initialize

4. **Get Your API Keys**
   - Once project is ready, go to **Settings** → **API**
   - You'll need:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon/public key** (starts with `eyJ...`)
     - **service_role key** (keep this secret! Only for backend)
   - Copy these - we'll use them in the next step

## Step 2: Set Up Environment Variables

1. **Create `.env` file** in the project root
2. **Add your Supabase credentials**:
   ```
   VITE_SUPABASE_URL=your-project-url-here
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. **Important**: Add `.env` to `.gitignore` if not already there
4. **Never commit** `.env` file to git!

## Step 3: Install Supabase Client

Run this command in your project:
```bash
npm install @supabase/supabase-js
```

## Step 4: Set Up Database Schema

We'll create the database tables using SQL in Supabase dashboard:

1. **Go to SQL Editor** in Supabase dashboard
2. **Run the schema creation script** (provided in next steps)
3. **Enable Row Level Security (RLS)** policies

## Step 5: Configure Email Templates (Optional)

1. **Go to Authentication** → **Email Templates**
2. **Customize** the confirmation email template
3. **Set up** SMTP settings if you want custom email domain

---

## Next Steps After Setup

Once setup is complete, we'll:
1. Create Supabase client configuration
2. Build authentication components
3. Implement registration and login
4. Add email verification
5. Set up progress syncing

