# Password Recovery Setup

## What's Been Implemented

✅ **Forgot Password Flow**
- "Forgot password?" link on login page
- Email form to request password reset
- Success message with instructions

✅ **Password Reset Flow**
- Reset password form (accessed via email link)
- New password with confirmation
- Validation and error handling

## Supabase Configuration Required

### Step 1: Update Redirect URLs

1. Go to Supabase dashboard
2. Click **Authentication** → **URL Configuration**
3. Under **Redirect URLs**, add:
   - `http://localhost:5173/act-math-review/auth/reset-password`
   - `http://localhost:5173/auth/reset-password`
4. **Save** the changes

### Step 2: Verify Email Templates

1. In Supabase: **Authentication** → **Email Templates**
2. Check that **"Reset Password"** template exists
3. You can customize it if desired

## How It Works

### Forgot Password Flow:
1. User clicks "Forgot your password?" on login page
2. Enters email address
3. Receives password reset email from Supabase
4. Clicks link in email

### Reset Password Flow:
1. User clicks link in email
2. Redirected to reset password page
3. Enters new password (twice for confirmation)
4. Password is updated
5. User can now login with new password

## Testing

1. **Test Forgot Password:**
   - Go to login page
   - Click "Forgot your password?"
   - Enter your email
   - Check email for reset link

2. **Test Reset Password:**
   - Click the reset link in email
   - Enter new password
   - Try logging in with new password

## Important Notes

- Reset links expire after 1 hour (Supabase default)
- Users must use the link from their email
- The reset link contains a secure token
- After reset, user must login again

