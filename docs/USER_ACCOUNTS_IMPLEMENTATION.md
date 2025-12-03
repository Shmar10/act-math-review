# User Accounts Feature - Implementation Plan

## Overview
This document outlines the implementation plan for adding user accounts to the ACT Math Review application. This will enable users to create accounts, verify their emails, and access their practice results across devices.

## Feature Requirements

### Core Features (MVP)
1. **User Registration**
   - First name, last name
   - Email address
   - Password (with strength requirements)
   - Email verification

2. **User Authentication**
   - Login with email/password
   - Logout
   - Session management (JWT tokens)
   - Protected routes

3. **Email Verification**
   - Send verification email on registration
   - Verification link with token
   - Resend verification email option
   - Optional: Restrict access until verified

4. **Results Access**
   - View practice history
   - View progress by topic
   - View overall statistics
   - Access results from any device

### Recommended Additional Features

1. **Profile Management**
   - View/edit profile information
   - Change password
   - Update email (with re-verification)

2. **Password Reset**
   - Forgot password flow
   - Email-based password reset
   - Secure token-based reset

3. **Progress Dashboard**
   - Visual progress charts
   - Topic-wise performance breakdown
   - Difficulty level analysis
   - Time spent tracking
   - Accuracy trends over time

4. **Session History**
   - View past practice sessions
   - Session details (questions answered, score, time)
   - Filter by date, topic, difficulty

5. **Preferences**
   - Default practice mode
   - Default topic/difficulty filters
   - Email notification preferences

6. **Account Security**
   - Two-factor authentication (future)
   - Login history
   - Active session management

## Architecture Decision

### Backend Approach
Since this is currently a static site, we have two options:

**Option 1: Backend-as-a-Service (Recommended for Quick Start)**
- Use services like:
  - **Supabase** (PostgreSQL + Auth + Storage)
  - **Firebase** (NoSQL + Auth)
  - **Auth0** (Auth only) + Custom backend
- Pros: Fast setup, managed infrastructure, built-in auth
- Cons: Vendor lock-in, potential costs at scale

**Option 2: Custom Backend**
- Node.js/Express with SQLite (start) or PostgreSQL
- Self-hosted on Synology or cloud
- Pros: Full control, no vendor lock-in
- Cons: More setup time, infrastructure management

**Recommendation: Start with Supabase** for rapid development, can migrate to custom backend later if needed.

### Database Schema (Supabase/PostgreSQL)

```sql
-- Users table (handled by Supabase Auth)
-- Additional user metadata
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Progress tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  question_id TEXT NOT NULL,
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP,
  last_correct BOOLEAN,
  first_seen_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Practice sessions
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  session_type TEXT NOT NULL, -- quick|standard|full|study
  topic_filter TEXT,
  difficulty_filter INTEGER,
  total_questions INTEGER,
  correct_count INTEGER DEFAULT 0,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  time_spent_seconds INTEGER
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_practice_sessions_user ON practice_sessions(user_id);
```

## Implementation Phases

### Phase 1: Setup & Infrastructure (Day 1-2)
1. Set up Supabase project (or custom backend)
2. Configure authentication
3. Set up database schema
4. Create API client in frontend
5. Add environment variables

### Phase 2: Registration & Login (Day 2-3)
1. Create registration form component
2. Implement email/password registration
3. Create login form component
4. Implement JWT token management
5. Add protected route wrapper

### Phase 3: Email Verification (Day 3-4)
1. Configure email templates
2. Implement verification flow
3. Add verification status UI
4. Resend verification option

### Phase 4: Progress Sync (Day 4-5)
1. Create progress API endpoints
2. Replace localStorage with API calls
3. Implement progress sync on login
4. Handle offline/online states

### Phase 5: Results Dashboard (Day 5-6)
1. Create dashboard component
2. Fetch user progress from API
3. Display statistics and charts
4. Add topic-wise breakdown

### Phase 6: Testing & Polish (Day 6-7)
1. Test all flows
2. Error handling
3. UI/UX improvements
4. Documentation

## Frontend Structure

### New Components
```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── EmailVerification.tsx
│   │   └── PasswordReset.tsx
│   ├── profile/
│   │   ├── ProfilePage.tsx
│   │   └── ProfileEdit.tsx
│   └── dashboard/
│       ├── Dashboard.tsx
│       ├── ProgressChart.tsx
│       └── SessionHistory.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useProgress.ts
│   └── useSession.ts
├── services/
│   ├── api.ts
│   └── supabase.ts (or auth.ts)
└── types/
    └── user.ts
```

## Next Steps

1. **Choose Backend Solution** - Supabase recommended for speed
2. **Set up Project** - Create Supabase project and get API keys
3. **Install Dependencies** - Add Supabase client library
4. **Start Phase 1** - Set up infrastructure

