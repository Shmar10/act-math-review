# Authentication Architecture Proposal

## Current Issues

1. **Admin/Teacher links visible to everyone** - Links are shown on the main page
2. **URL-based routing with query parameters** - Uses `?admin=true`, `?teacher=true` which is messy
3. **Multiple password prompts** - Separate prompts for Admin Review, Admin Users, and Teacher
4. **No clear separation** - All routing logic in App.tsx
5. **Admin Users separate from Admin Review** - Two different passwords for related features

## Proposed Solution

### 1. Dedicated Login Pages

Create separate login pages for each user type:

- **`/auth/login`** - Student login (existing AuthPage, but make it a dedicated route)
- **`/auth/admin`** - Developer/Admin login (single password for all admin features)
- **`/auth/teacher`** - Teacher login (for printing worksheets)

### 2. Path-Based Routing

Instead of query parameters, use clean paths:
- `/admin` - Admin Review (after admin login)
- `/admin/users` - Admin User Management (after admin login)
- `/teacher` - Teacher Print Page (after teacher login)
- `/login` - Student login/register
- `/dashboard` - Student dashboard
- `/profile` - Student profile

### 3. Unified Admin Access

- Single admin password grants access to both:
  - Admin Review (view all questions/answers)
  - Admin Users (manage user accounts)
- Navigation between admin features via tabs/links within admin area

### 4. Remove Public Links

- Remove "Admin Review" and "Teacher Print" links from main page
- These features are only accessible via direct URL or login pages
- Main page focuses on student experience

### 5. Better UX Flow

**For Students:**
- Visit homepage → See login/register option → Access practice features

**For Teachers:**
- Visit `/auth/teacher` → Enter teacher password → Access print features

**For Admin:**
- Visit `/auth/admin` → Enter admin password → Access admin dashboard with tabs for Review/Users

## Implementation Plan

1. Create new login page components:
   - `AdminLoginPage.tsx` - Admin login form
   - `TeacherLoginPage.tsx` - Teacher login form (can reuse existing prompt)

2. Update routing in App.tsx:
   - Check pathname instead of query parameters
   - Route to appropriate pages based on path

3. Create Admin Dashboard:
   - Combined view with tabs for "Question Review" and "User Management"
   - Single authentication for both

4. Update navigation:
   - Remove admin/teacher links from main page
   - Add proper navigation within admin area

5. Update logout redirects:
   - All logout buttons redirect to homepage

## Benefits

✅ **Cleaner URLs** - `/admin` instead of `?admin=true`
✅ **Better Security** - Admin/teacher features not advertised on main page
✅ **Simpler Admin Access** - One password for all admin features
✅ **Better UX** - Clear separation between user types
✅ **Easier Maintenance** - Path-based routing is more standard

## Alternative Consideration

**Option: Single Login Page with Role Selection**

Instead of separate pages, have one login page where users select their role:
- Student (Supabase auth)
- Teacher (password)
- Admin (password)

This could be simpler but less secure (advertises admin access).

**Recommendation:** Go with separate login pages for better security and UX.

