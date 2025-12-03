# Quick Fix: Create .env File

The `.env` file is missing! Here's how to fix it:

## Step 1: Create the File

I've created an empty `.env` file for you. Now you need to add your Supabase values.

## Step 2: Open and Edit the File

1. In VS Code, look in the left sidebar (File Explorer)
2. You should see `.env` file in the root folder
3. **Click on it** to open it

## Step 3: Add Your Supabase Values

Copy and paste this template into the `.env` file:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Then:
1. After `VITE_SUPABASE_URL=`, paste your Supabase Project URL
2. After `VITE_SUPABASE_ANON_KEY=`, paste your Supabase anon public key

It should look like this (with YOUR actual values):
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Save the File

Press **Ctrl+S** to save

## Step 5: Restart Dev Server

1. In terminal, press **Ctrl+C** to stop
2. Run: `npm run dev`
3. Refresh browser

## Where to Get Your Values

1. Go to https://supabase.com
2. Open your project
3. Click **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → goes after `VITE_SUPABASE_URL=`
   - **anon public key** → goes after `VITE_SUPABASE_ANON_KEY=`

## Important Notes

- **No quotes** around values
- **No spaces** around the `=` sign
- Each value on its own line
- File must be named exactly `.env` (with the dot)

