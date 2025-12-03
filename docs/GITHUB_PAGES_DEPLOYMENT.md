# GitHub Pages Deployment Guide

## Overview
This guide covers deploying your ACT Math Review app with user accounts to GitHub Pages.

## Pre-Deployment Checklist

### 1. Update Supabase Redirect URLs

**Before deploying, you MUST update Supabase to allow your production URL:**

1. Go to Supabase dashboard: https://supabase.com
2. Click **Authentication** → **URL Configuration**
3. Under **Site URL**, change to your GitHub Pages URL:
   - Format: `https://yourusername.github.io/act-math-review/`
   - Or your custom domain if you have one
4. Under **Redirect URLs**, add:
   - `https://yourusername.github.io/act-math-review/**`
   - `https://yourusername.github.io/act-math-review/auth/verify`
   - `https://yourusername.github.io/act-math-review/auth/reset-password`
   - Keep your localhost URLs for development
5. **Save** the changes

### 2. Environment Variables for Production

**GitHub Pages doesn't support `.env` files directly.** You have two options:

#### Option A: GitHub Secrets + GitHub Actions (Recommended)
- Store environment variables as GitHub Secrets
- Use GitHub Actions to inject them during build
- More secure, automated

#### Option B: Build-time Environment Variables
- Set environment variables in your build script
- Less secure (visible in build output)
- Simpler setup

We'll use **Option B** for simplicity, but you can upgrade to Option A later.

### 3. Update Build Configuration

The `vite.config.ts` already has the base path set correctly for GitHub Pages.

## Step-by-Step Deployment

### Step 1: Prepare Environment Variables

Since GitHub Pages is a static site, we need to embed environment variables at build time.

**Option 1: Use GitHub Secrets (Recommended for security)**

1. In your GitHub repo, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add:
   - Name: `VITE_SUPABASE_URL`
   - Value: Your Supabase project URL
4. Add another:
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon public key

**Option 2: Build Script (Simpler, less secure)**

We'll create a build script that sets environment variables.

### Step 2: Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml` to automate deployment.

### Step 3: Build and Deploy

1. Build the project locally to test
2. Push to GitHub
3. GitHub Actions will deploy automatically

## Important Notes

### Security Considerations

⚠️ **Important**: The `VITE_` prefix means these variables are exposed in the client-side code. This is normal for Supabase anon keys (they're meant to be public), but be aware:
- Never commit your `service_role` key
- The anon key is safe to expose (it's designed for client-side use)
- Row Level Security (RLS) in Supabase protects your data

### Base URL

Your `vite.config.ts` already has:
```typescript
base: "/act-math-review/",
```

This matches your GitHub repo name. If your repo has a different name, update this.

## Post-Deployment

After deployment, verify:
1. ✅ Site loads correctly
2. ✅ Users can register
3. ✅ Email verification works
4. ✅ Login works
5. ✅ Password reset works
6. ✅ Dashboard loads
7. ✅ Progress saves correctly

## Troubleshooting

### Issue: Environment variables not working
- Check GitHub Secrets are set correctly
- Verify build script uses the secrets
- Check browser console for errors

### Issue: Redirect URLs not working
- Verify Supabase redirect URLs include production URL
- Check URL format matches exactly (with trailing slash if needed)

### Issue: CORS errors
- Verify Supabase Site URL is set to production URL
- Check all redirect URLs are added

