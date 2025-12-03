# Deployment Checklist for GitHub Pages

## Before Deployment

### 1. Supabase Configuration ✅

- [ ] **Update Site URL** in Supabase:
  - Go to: Authentication → URL Configuration
  - Set to: `https://yourusername.github.io/act-math-review/`
  - (Replace `yourusername` with your GitHub username)

- [ ] **Add Redirect URLs** in Supabase:
  - `https://yourusername.github.io/act-math-review/**`
  - `https://yourusername.github.io/act-math-review/auth/verify`
  - `https://yourusername.github.io/act-math-review/auth/reset-password`
  - Keep localhost URLs for development

### 2. GitHub Repository Setup ✅

- [ ] Repository is created on GitHub
- [ ] Repository name matches base path in `vite.config.ts` (`/act-math-review/`)
- [ ] Code is pushed to `main` branch

### 3. GitHub Secrets Setup ✅

- [ ] Go to repo: **Settings** → **Secrets and variables** → **Actions**
- [ ] Add secret: `VITE_SUPABASE_URL`
  - Value: Your Supabase project URL (from `.env` file)
- [ ] Add secret: `VITE_SUPABASE_ANON_KEY`
  - Value: Your Supabase anon public key (from `.env` file)

### 4. GitHub Pages Settings ✅

- [ ] Go to repo: **Settings** → **Pages**
- [ ] Source: Select **GitHub Actions**
- [ ] Save

### 5. Verify Build Configuration ✅

- [ ] Check `vite.config.ts` has correct `base` path
- [ ] Test build locally: `npm run build`
- [ ] Verify `dist/` folder is created

## Deployment Steps

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Add user accounts and authentication"
git push origin feature/progress-syncing
# Then merge to main and push
```

### Step 2: GitHub Actions Will Deploy

- GitHub Actions workflow will run automatically
- Check **Actions** tab in GitHub repo
- Wait for deployment to complete

### Step 3: Verify Deployment

- Visit: `https://yourusername.github.io/act-math-review/`
- Test all features:
  - [ ] Registration works
  - [ ] Email verification works
  - [ ] Login works
  - [ ] Dashboard loads
  - [ ] Profile page works
  - [ ] Password reset works

## Post-Deployment

### Update Documentation

- [ ] Update any hardcoded URLs in documentation
- [ ] Update README with production URL

### Monitor

- [ ] Check Supabase dashboard for new users
- [ ] Monitor for errors in browser console
- [ ] Test on different devices/browsers

## Troubleshooting

### Build Fails

- Check GitHub Actions logs
- Verify environment variables are set in Secrets
- Check for TypeScript/build errors

### Site Doesn't Load

- Verify GitHub Pages is enabled
- Check repository name matches base path
- Verify `dist/` folder structure

### Authentication Doesn't Work

- Verify Supabase redirect URLs are correct
- Check environment variables in build
- Test in browser console: `console.log(import.meta.env.VITE_SUPABASE_URL)`

### CORS Errors

- Verify Supabase Site URL matches production URL
- Check all redirect URLs are added
- Verify no trailing slash issues

## Custom Domain (Optional)

If you have a custom domain:

1. Update Supabase URLs to use custom domain
2. Update `vite.config.ts` base path if needed
3. Configure DNS settings in GitHub Pages
4. Update all redirect URLs in Supabase

