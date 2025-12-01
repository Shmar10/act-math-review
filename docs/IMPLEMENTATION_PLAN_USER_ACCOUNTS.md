# Implementation Plan: User Accounts & Server-Side Progress Tracking

## Overview
This document outlines the plan to add user authentication, account management, and server-side progress tracking to the ACT Math Review application for deployment on a Synology server.

## Current State Analysis

### What We Have
- ✅ Frontend React/Vite application
- ✅ LocalStorage-based progress tracking (`ProgressMap`)
- ✅ Question banks stored as JSON files
- ✅ Admin authentication (client-side)
- ✅ Practice sessions with progress tracking

### What We Need
- 🔐 User authentication (sign up, login, password reset)
- 📊 User profile with basic information collection
- 💾 Server-side progress persistence
- 🔄 Progress syncing between client and server
- 🎯 Resume practice sessions functionality
- 🗄️ Database for users and progress
- 🔒 API backend for authentication and data

---

## Architecture Design

### Technology Stack Recommendations

#### Backend Options for Synology

**Option 1: Node.js/Express (Recommended)**
- ✅ Synology supports Node.js via Package Center or Docker
- ✅ Same language as frontend (TypeScript)
- ✅ Easy integration with existing codebase
- ✅ Good performance and scalability

**Option 2: PHP**
- ✅ Synology has built-in PHP support
- ❌ Different language from frontend
- ✅ Good for simple APIs

**Option 3: Docker Container**
- ✅ Isolated environment
- ✅ Easy deployment and updates
- ✅ Can run Node.js, PostgreSQL, etc.

**Recommendation: Node.js/Express with Docker** for clean separation and easy Synology deployment.

### Database Options

**Option 1: SQLite (Simple Start)**
- ✅ No server setup required
- ✅ Perfect for small-medium user base
- ✅ File-based, easy backups
- ❌ Limited concurrent writes

**Option 2: PostgreSQL (Production)**
- ✅ Robust and scalable
- ✅ Great for concurrent users
- ✅ Synology supports via Docker
- ✅ Better for long-term growth

**Option 3: MySQL/MariaDB**
- ✅ Synology Package Center has built-in support
- ✅ Good middle ground

**Recommendation: Start with SQLite, migrate to PostgreSQL if needed.**

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  -- User Information Collection
  full_name TEXT,
  age INTEGER,
  grade_level TEXT, -- e.g., "11", "12", "College"
  school_name TEXT,
  target_act_score INTEGER,
  study_goals TEXT, -- JSON or TEXT
  -- Preferences
  default_topic TEXT DEFAULT 'All',
  default_difficulty INTEGER DEFAULT 0,
  default_question_mode TEXT DEFAULT 'sequential', -- sequential|shuffled|random
  default_practice_mode TEXT DEFAULT 'standard', -- quick|standard|full|study
  -- Metadata
  email_verified BOOLEAN DEFAULT 0,
  verification_token TEXT,
  reset_token TEXT,
  reset_token_expires DATETIME
);
```

### Progress Table
```sql
CREATE TABLE user_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  question_id TEXT NOT NULL, -- e.g., "number-ops-001"
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  last_attempt_at DATETIME,
  last_correct BOOLEAN,
  first_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, question_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_question ON user_progress(question_id);
```

### Practice Sessions Table (for resume functionality)
```sql
CREATE TABLE practice_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  session_type TEXT NOT NULL, -- quick|standard|full|study
  question_mode TEXT NOT NULL, -- sequential|shuffled|random
  topic_filter TEXT DEFAULT 'All',
  difficulty_filter INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  current_question_index INTEGER DEFAULT 0,
  questions_order TEXT, -- JSON array of question IDs for shuffled/sequential
  session_started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  session_paused_at DATETIME,
  session_completed_at DATETIME,
  time_limit_seconds INTEGER, -- NULL for study mode
  time_remaining_seconds INTEGER,
  completed_questions TEXT, -- JSON object: { questionId: boolean }
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_practice_sessions_user ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_active ON practice_sessions(user_id, session_completed_at) 
  WHERE session_completed_at IS NULL;
```

---

## API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register       - Create new account
POST   /api/auth/login          - User login
POST   /api/auth/logout         - User logout
GET    /api/auth/me             - Get current user info
POST   /api/auth/verify-email   - Verify email address
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password  - Reset password with token
```

### User Profile Endpoints
```
GET    /api/users/profile       - Get user profile
PUT    /api/users/profile       - Update user profile
GET    /api/users/stats         - Get user statistics (total questions, accuracy, etc.)
```

### Progress Endpoints
```
GET    /api/progress            - Get all user progress
PUT    /api/progress/:questionId - Update progress for specific question
POST   /api/progress/sync       - Sync client progress to server (batch update)
GET    /api/progress/summary    - Get progress summary (by topic, difficulty, etc.)
```

### Practice Session Endpoints
```
POST   /api/sessions/start      - Start new practice session
GET    /api/sessions/active     - Get active session (for resume)
PUT    /api/sessions/:id        - Update session (save progress, pause)
POST   /api/sessions/:id/complete - Complete session
GET    /api/sessions/history    - Get past sessions
```

---

## Implementation Phases

### Phase 1: Backend Setup & Database (Week 1)
**Goal:** Create backend infrastructure

1. **Set up Node.js/Express backend**
   - Create `server/` directory
   - Initialize Express app
   - Set up TypeScript for backend
   - Configure CORS for frontend
   - Add environment variables (.env)

2. **Database setup**
   - Choose database (SQLite to start)
   - Create migration scripts
   - Set up database connection
   - Create database models/helpers

3. **Basic API structure**
   - Set up route organization
   - Add error handling middleware
   - Add request validation
   - Add logging

**Deliverables:**
- ✅ Backend server running
- ✅ Database schema created
- ✅ Basic API structure in place

---

### Phase 2: Authentication System (Week 1-2)
**Goal:** User sign up and login

1. **Registration**
   - Password hashing (bcrypt)
   - Email validation
   - Basic validation rules
   - Duplicate email checking

2. **Login System**
   - JWT token generation
   - Session management
   - Password verification
   - Remember me functionality

3. **Email Verification** (Optional for MVP)
   - Email sending (using nodemailer or similar)
   - Verification token generation
   - Verification endpoint

4. **Password Reset** (Optional for MVP)
   - Reset token generation
   - Email sending
   - Token expiration
   - Password update

**Deliverables:**
- ✅ Users can register
- ✅ Users can login
- ✅ JWT authentication working
- ✅ Protected routes

---

### Phase 3: User Profile & Information Collection (Week 2)
**Goal:** Collect and store user information

1. **Registration Form Enhancement**
   - Add fields: name, age, grade, school, target score, goals
   - Validation
   - Optional vs required fields
   - Save to database

2. **Profile Management**
   - Profile view/edit page
   - Update preferences
   - Account settings

**Deliverables:**
- ✅ Registration collects user info
- ✅ Profile page functional
- ✅ Preferences saved

---

### Phase 4: Progress Syncing (Week 2-3)
**Goal:** Server-side progress tracking

1. **Progress API Implementation**
   - Create progress endpoints
   - Batch sync functionality
   - Conflict resolution (server wins or merge)

2. **Frontend Integration**
   - Create API service/client
   - Replace localStorage with API calls
   - Add sync on progress updates
   - Handle offline/online states
   - Queue updates when offline

3. **Progress Migration**
   - Import existing localStorage data
   - One-time migration on first login

**Deliverables:**
- ✅ Progress saved to server
- ✅ Progress synced from server on login
- ✅ Works offline with sync on reconnect

---

### Phase 5: Resume Practice Sessions (Week 3)
**Goal:** Users can resume where they left off

1. **Session API Implementation**
   - Create session endpoints
   - Save session state
   - Load active session

2. **Frontend Integration**
   - Detect active session on login
   - "Resume Practice" prompt
   - Save session state periodically
   - Auto-save on navigation away

3. **Session Management**
   - Expire old sessions (e.g., 24 hours)
   - Clear completed sessions
   - Session history view

**Deliverables:**
- ✅ Users can resume practice
- ✅ Sessions auto-saved
- ✅ Session history visible

---

### Phase 6: Testing & Polish (Week 4)
**Goal:** Production-ready application

1. **Testing**
   - API endpoint testing
   - Authentication flow testing
   - Progress sync testing
   - Session resume testing
   - Error handling testing

2. **Security**
   - Input sanitization
   - SQL injection prevention
   - Rate limiting
   - CORS configuration
   - HTTPS setup

3. **Performance**
   - Database indexing
   - API response caching (if needed)
   - Frontend optimization

4. **Deployment Preparation**
   - Environment configuration
   - Database backup strategy
   - Logging and monitoring
   - Documentation

**Deliverables:**
- ✅ Application tested
- ✅ Security hardened
- ✅ Ready for deployment

---

## Frontend Changes Required

### New Components Needed

1. **Auth Components**
   - `LoginForm.tsx` - Login page
   - `RegisterForm.tsx` - Registration with info collection
   - `PasswordReset.tsx` - Password reset flow
   - `ProfilePage.tsx` - User profile view/edit

2. **API Integration**
   - `api/client.ts` - API client with authentication
   - `hooks/useAuth.ts` - Authentication hook
   - `hooks/useProgress.ts` - Progress sync hook
   - `hooks/useSession.ts` - Session management hook

3. **Updated Components**
   - `App.tsx` - Add authentication checks
   - `WelcomePage.tsx` - Show login/register if not authenticated
   - `QuestionCard.tsx` - Sync progress on answer

### State Management Updates

Replace `useLocalStorage` with:
- `useServerStorage` - Syncs with backend
- `useAuth` - Manages authentication state
- Keep localStorage as fallback/cache

---

## Synology Deployment Considerations

### Docker Approach (Recommended)
1. **Frontend Container**
   - Build React app (`npm run build`)
   - Serve with nginx
   - Or use Node.js to serve static files

2. **Backend Container**
   - Node.js/Express API
   - Environment variables via .env
   - Port mapping (e.g., 3001 for API)

3. **Database Container** (if using PostgreSQL)
   - PostgreSQL container
   - Volume for data persistence
   - Backup strategy

4. **Reverse Proxy**
   - Synology's built-in reverse proxy
   - Route `/api/*` to backend
   - Route `/*` to frontend
   - SSL certificate setup

### Alternative: Direct Node.js Installation
1. Install Node.js via Package Center
2. Run backend as Node.js application
3. Use Synology Web Station for frontend
4. SQLite database in shared folder

---

## File Structure (Proposed)

```
act-math-review/
├── client/                    # Frontend (rename from root)
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                    # Backend
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.ts
│   ├── migrations/
│   ├── .env.example
│   └── package.json
├── docker-compose.yml         # Docker setup
├── .dockerignore
└── README.md
```

---

## Security Considerations

1. **Password Security**
   - Use bcrypt with salt rounds ≥ 10
   - Enforce password strength
   - Rate limit login attempts

2. **Authentication**
   - JWT with reasonable expiration
   - Refresh tokens
   - Secure cookie storage (if using)

3. **API Security**
   - Input validation on all endpoints
   - SQL injection prevention (use parameterized queries)
   - Rate limiting
   - CORS configuration

4. **Data Privacy**
   - Hash sensitive data
   - GDPR compliance considerations
   - Data retention policies

---

## Data Migration Strategy

1. **Existing Users (localStorage)**
   - On first login, prompt to migrate data
   - Import progress from localStorage
   - Clear localStorage after migration

2. **Question IDs**
   - Ensure question IDs are consistent
   - May need migration script if IDs change

---

## Future Enhancements (Post-MVP)

1. **Analytics Dashboard**
   - User progress analytics
   - Topic mastery visualization
   - Time spent tracking

2. **Social Features**
   - Leaderboards (optional)
   - Study groups
   - Progress sharing

3. **Advanced Features**
   - Custom practice sets
   - Goal tracking
   - Study reminders
   - Email progress reports

---

## Next Steps

1. **Review & Approve Plan** - Confirm approach and priorities
2. **Choose Technology Stack** - Finalize database and deployment method
3. **Set Up Development Environment** - Backend + database locally
4. **Begin Phase 1** - Backend infrastructure

---

## Questions to Decide

1. **Email Service**: Use SMTP from Synology or third-party (SendGrid, etc.)?
2. **Database**: Start with SQLite or go straight to PostgreSQL?
3. **Session Expiration**: How long before sessions expire? (Recommendation: 24 hours)
4. **Offline Support**: How important is offline functionality?
5. **Email Verification**: Required or optional for MVP?
6. **Password Reset**: Required for MVP or can wait?

---

## Estimated Timeline

- **Phase 1-2**: 1-2 weeks (Backend + Auth)
- **Phase 3**: 3-5 days (Profile & Info)
- **Phase 4**: 1 week (Progress Sync)
- **Phase 5**: 3-5 days (Resume Sessions)
- **Phase 6**: 1 week (Testing & Deployment)

**Total: 4-6 weeks** for full implementation

For MVP (Core features only): **2-3 weeks**

