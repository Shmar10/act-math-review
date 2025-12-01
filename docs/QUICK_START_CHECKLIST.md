# Quick Start Checklist: User Accounts Implementation

## Pre-Implementation Questions

Before starting, please answer these to customize the implementation:

### Synology Setup
- [ ] Do you have SSH access to your Synology?
- [ ] Do you have Docker installed on Synology? (Recommended: Yes)
- [ ] Do you have a domain name pointing to your Synology?
- [ ] Can you install Node.js packages on Synology?
- [ ] Do you have SSL/HTTPS set up?

### Email Service
- [ ] Do you want email verification for users? (Y/N)
- [ ] Do you have SMTP server access? (Synology mail server or external)
- [ ] If external, which service? (Gmail, SendGrid, etc.)

### Database Preference
- [ ] Start simple with SQLite? (Recommended for MVP)
- [ ] Or use PostgreSQL from the start?

### Feature Priorities
- [ ] MVP: Just auth + progress sync? (Fastest)
- [ ] Full: Auth + progress + resume sessions? (Complete)
- [ ] Everything: Auth + progress + resume + analytics? (Full featured)

---

## Decision Matrix

### Recommended MVP Path (Fastest to Deploy)
- ✅ SQLite database (no setup needed)
- ✅ Basic auth (register, login, no email verification)
- ✅ Progress syncing
- ⏸️ Resume sessions (Phase 2)
- ⏸️ Email verification (Phase 2)

**Timeline: 2-3 weeks**

### Full Featured Path (Most Complete)
- ✅ PostgreSQL database
- ✅ Full auth with email verification
- ✅ Progress syncing
- ✅ Resume sessions
- ✅ User analytics

**Timeline: 4-6 weeks**

---

## Step-by-Step Implementation Order

### Week 1: Backend Foundation
1. [ ] Create `server/` directory
2. [ ] Set up Express.js backend
3. [ ] Set up TypeScript for backend
4. [ ] Initialize database (SQLite or PostgreSQL)
5. [ ] Create database schema
6. [ ] Set up database migrations
7. [ ] Create basic API structure

### Week 2: Authentication
1. [ ] Implement registration endpoint
2. [ ] Implement login endpoint
3. [ ] Add JWT token generation
4. [ ] Create authentication middleware
5. [ ] Build login/register UI components
6. [ ] Test authentication flow

### Week 3: Progress & Profile
1. [ ] Implement progress API endpoints
2. [ ] Create user profile endpoints
3. [ ] Build profile collection form
4. [ ] Integrate progress syncing in frontend
5. [ ] Test progress sync functionality

### Week 4: Resume & Polish
1. [ ] Implement session save/resume
2. [ ] Add "Resume Practice" feature
3. [ ] Testing & bug fixes
4. [ ] Security review
5. [ ] Deployment preparation

---

## File Structure Setup

```bash
# Create new directories
mkdir server
mkdir server/src
mkdir server/src/routes
mkdir server/src/models
mkdir server/src/middleware
mkdir server/src/utils
mkdir server/migrations
mkdir server/db

# Move frontend files (optional reorganization)
# Current structure is fine, or rename root to 'client'
```

---

## Dependencies Needed

### Backend (server/package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "sqlite3": "^5.1.6",  // or "pg" for PostgreSQL
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.4",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "ts-node": "^10.9.2",
    "nodemon": "^3.0.2"
  }
}
```

### Frontend (client/package.json additions)
```json
{
  "dependencies": {
    // Add if not already present
    "axios": "^1.6.2"  // or use fetch API
  }
}
```

---

## Environment Variables Needed

Create `server/.env`:
```env
# Server
PORT=3001
NODE_ENV=production

# Database
DB_PATH=./db/database.sqlite  # For SQLite
# Or for PostgreSQL:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=actmath
# DB_USER=actmath_user
# DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173  # Development
# FRONTEND_URL=https://your-domain.com  # Production

# Email (if using email verification)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
SMTP_FROM=noreply@your-domain.com
```

---

## Testing Checklist

### Authentication
- [ ] User can register with email/password
- [ ] Duplicate email registration fails
- [ ] User can login with correct credentials
- [ ] Login fails with wrong password
- [ ] JWT token is generated on login
- [ ] Protected routes require authentication
- [ ] Logout clears session

### Progress
- [ ] Progress saves to database on answer
- [ ] Progress loads from database on login
- [ ] Progress syncs correctly after offline
- [ ] Multiple devices sync progress correctly
- [ ] Progress migration from localStorage works

### Sessions (if implemented)
- [ ] Session saves when starting practice
- [ ] Active session loads on login
- [ ] User can resume practice
- [ ] Session expires after 24 hours
- [ ] Completed sessions don't resume

---

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database initialized
- [ ] SSL certificate installed
- [ ] Domain name configured
- [ ] Firewall rules set

### Synology Setup
- [ ] Docker installed (if using Docker)
- [ ] Reverse proxy configured
- [ ] Ports opened (3001 for API, 80/443 for web)
- [ ] SSL certificate added
- [ ] Backup strategy configured

### Post-Deployment
- [ ] Site accessible via HTTPS
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] Progress saving correctly
- [ ] Error logging configured
- [ ] Monitoring set up

---

## Rollback Plan

If something goes wrong:
1. Keep GitHub Pages version as backup
2. Database backups (automatic or manual)
3. Version control for easy rollback
4. Feature flags for gradual rollout

---

## First Steps (Right Now)

1. **Read the full implementation plan**: `IMPLEMENTATION_PLAN_USER_ACCOUNTS.md`
2. **Answer the pre-implementation questions** above
3. **Choose your path**: MVP vs Full Featured
4. **Set up development environment**: 
   - Install Node.js locally (if not already)
   - Set up database (SQLite is easiest to start)
5. **Create the backend directory structure**
6. **Start with Phase 1**: Backend setup

---

## Getting Help

If you need clarification on any part:
- Review the detailed plan in `IMPLEMENTATION_PLAN_USER_ACCOUNTS.md`
- Check the database schema design
- Review API endpoint specifications
- Ask specific questions about your Synology setup

---

## Recommended Reading Before Starting

1. **Express.js Documentation**: https://expressjs.com/
2. **JWT Authentication**: https://jwt.io/
3. **SQLite Documentation**: https://www.sqlite.org/docs.html
4. **Synology Docker Guide**: Synology's Docker documentation
5. **CORS Setup**: For API security

---

## Success Metrics

You'll know it's working when:
- ✅ Users can create accounts
- ✅ Users can log in and see their progress
- ✅ Progress persists across devices
- ✅ Users can resume practice sessions
- ✅ Site is accessible on your Synology server

