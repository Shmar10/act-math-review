# Admin User Management - Implementation Plan

## Overview
Create an admin panel for managing user accounts, accessible via the existing admin system.

## Features to Implement

### Phase 1: User Management (Core)
1. **View All Users**
   - List all registered users
   - Show: name, email, verification status, account creation date
   - Search/filter functionality
   - Pagination for large user lists

2. **Delete Users**
   - Delete individual users
   - Confirmation dialog before deletion
   - Cascade delete (removes profile, progress, sessions)

3. **User Statistics**
   - Total user count
   - Verified vs unverified users
   - Recent signups
   - Active users (users with progress)

### Phase 2: User Details (Enhanced)
4. **View User Details**
   - Full profile information
   - Progress statistics
   - Practice session history
   - Last login time

5. **User Actions**
   - Manually verify email
   - Reset user password (send reset email)
   - View user's progress breakdown

## Implementation Approach

### Option 1: Supabase Service Role Key (Recommended)
- **Pros**: Full access, bypasses RLS, secure
- **Cons**: Requires storing service role key securely
- **Security**: Store in environment variable, never expose to client

### Option 2: Supabase Admin API via Edge Function
- **Pros**: More secure, server-side only
- **Cons**: Requires setting up Edge Functions, more complex

### Option 3: Database Functions with Admin Role
- **Pros**: Uses existing Supabase infrastructure
- **Cons**: More complex setup, requires database functions

**Recommendation**: Option 1 (Service Role Key) for simplicity and effectiveness.

## Security Considerations

1. **Admin Authentication**: Keep existing password system
2. **Service Role Key**: 
   - Store in `.env` as `VITE_SUPABASE_SERVICE_ROLE_KEY` (only for admin operations)
   - Only use in admin context, never expose to regular users
   - Consider using a separate admin-only Supabase client
3. **Confirmation Dialogs**: Required for destructive actions
4. **Audit Logging**: Log admin actions (optional, future enhancement)

## UI/UX Design

### Admin Navigation
- Add tabs or sidebar to existing admin panel:
  - "Questions" (existing AdminReview)
  - "Users" (new user management)
  - Maybe "Analytics" (future)

### User List View
- Table format with sortable columns
- Search bar
- Filter by verification status
- Pagination (50 users per page)
- Action buttons per row

### User Detail Modal/Page
- Show full user information
- Progress statistics
- Recent activity
- Action buttons

## Database Queries Needed

1. **List Users**: Query `auth.users` and `user_profiles`
2. **User Stats**: Aggregate queries on `user_profiles`, `user_progress`
3. **Delete User**: Delete from `auth.users` (cascades to related tables)

## Files to Create

1. `src/services/admin.ts` - Admin API functions
2. `src/components/admin/AdminUsers.tsx` - Main user management component
3. `src/components/admin/UserList.tsx` - User list table
4. `src/components/admin/UserDetail.tsx` - User detail view
5. `src/components/admin/DeleteUserDialog.tsx` - Confirmation dialog
6. `src/lib/supabaseAdmin.ts` - Admin Supabase client (service role)

## Integration Points

- Add to existing admin system (`?admin=true`)
- Add navigation tabs in AdminReview or create separate route
- Use existing admin password authentication

