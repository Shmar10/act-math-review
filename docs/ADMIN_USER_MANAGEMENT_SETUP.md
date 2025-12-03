# Admin User Management Setup

## Overview

The admin user management system allows you to:
- View all registered users
- See user statistics (total, verified, active users)
- Delete user accounts (with confirmation)
- Search and filter users

## Setup Instructions

### Step 1: Get Your Supabase Service Role Key

1. Go to your Supabase dashboard: https://supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Find the **service_role** key (NOT the anon key)
5. **Important**: This key has full admin access - keep it secret!

### Step 2: Add to Environment Variables

Add the service role key to your `.env` file:

```env
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Security Note**: 
- The service role key bypasses Row Level Security (RLS)
- Only use it in admin context
- Never expose it to regular users
- Never commit it to git (it's already in `.gitignore`)

### Step 3: Restart Dev Server

After adding the key:
1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. The admin user management will now be available

## Accessing User Management

1. Go to your site: `http://localhost:5173`
2. Add `?admin=true` to the URL (or click the Admin link)
3. Enter the admin password (configured in `src/config/admin.ts`)
4. Click the **"Users"** button in the top right
5. Or directly access: `?admin=users`

## Features

### User List
- View all registered users
- See name, email, verification status
- View progress statistics per user
- See account creation date

### Statistics Overview
- Total users
- Verified vs unverified count
- Users with progress (active users)
- Recent signups (last 7 days)

### Search & Filter
- Search by name or email
- Filter by verification status
- Real-time filtering

### Delete Users
- Click "Delete" button on any user
- Confirmation dialog shows what will be deleted
- Cascades to:
  - User account (auth.users)
  - User profile (user_profiles)
  - All progress (user_progress)
  - All sessions (practice_sessions)

## Security

### Admin Authentication
- Uses existing admin password system
- Password stored in `src/config/admin.ts`
- Change it to something secure!

### Service Role Key
- Only used in admin context
- Never exposed to client-side code for regular users
- Admin client only created when key is available

### Best Practices
1. **Change admin password** from default
2. **Keep service role key secret**
3. **Don't share admin access** with others
4. **Use confirmation dialogs** for destructive actions

## Troubleshooting

### "Admin client not configured" Error

**Problem**: Service role key not set or not loaded

**Solution**:
1. Check `.env` file has `VITE_SUPABASE_SERVICE_ROLE_KEY`
2. Make sure you copied the **service_role** key (not anon key)
3. Restart dev server after adding the key
4. Check browser console for errors

### Can't See Users

**Problem**: No users showing up

**Possible Causes**:
1. No users have registered yet
2. Service role key is incorrect
3. Network/firewall blocking Supabase

**Solution**:
1. Check Supabase dashboard → Authentication → Users
2. Verify service role key is correct
3. Check browser console for errors

### Delete Not Working

**Problem**: User deletion fails

**Possible Causes**:
1. Service role key doesn't have permissions
2. Network error
3. User doesn't exist

**Solution**:
1. Check browser console for error messages
2. Verify service role key is correct
3. Try refreshing and deleting again

## For Production (GitHub Pages)

When deploying to GitHub Pages:

1. Add `VITE_SUPABASE_SERVICE_ROLE_KEY` as a GitHub Secret
2. Update `.github/workflows/deploy.yml` to include it in build env
3. **Never** commit the service role key to git

Example workflow addition:
```yaml
- name: Build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    VITE_SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.VITE_SUPABASE_SERVICE_ROLE_KEY }}
  run: npm run build
```

## Future Enhancements

Potential features to add:
- View detailed user progress breakdown
- Manually verify user emails
- Send password reset emails
- Export user data
- Bulk user operations
- User activity logs

