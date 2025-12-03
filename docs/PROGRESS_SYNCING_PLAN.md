# Progress Syncing Implementation Plan

## Overview
Replace localStorage-based progress tracking with server-side storage in Supabase, enabling users to access their progress from any device.

## Current State
- Progress is stored in `localStorage` with key `amr.progress`
- Format: `Record<string, { correct: number; wrong: number; lastAt: number }>`
- Progress is updated when user answers questions

## Goal
- Save progress to Supabase `user_progress` table
- Sync progress on login
- Keep localStorage as cache/fallback
- Handle offline/online states

## Implementation Steps

### Step 1: Create Progress Service
- Create `src/services/progress.ts`
- Functions to:
  - Get progress from Supabase
  - Save progress to Supabase
  - Sync progress (batch updates)
  - Merge local and server progress

### Step 2: Create Progress Hook
- Create `src/hooks/useProgress.ts`
- Manages progress state
- Handles syncing
- Provides methods to update progress

### Step 3: Update App.tsx
- Replace `useLocalStorage` for progress with `useProgress`
- Sync progress on login
- Sync progress periodically
- Handle sync errors gracefully

### Step 4: Migration Strategy
- On first login, import existing localStorage data
- Merge with server data (if any)
- Clear localStorage after successful migration

## Database Schema (Already Created)
The `user_progress` table has:
- `user_id` - UUID (references auth.users)
- `question_id` - TEXT (question ID)
- `correct_count` - INTEGER
- `wrong_count` - INTEGER
- `last_attempt_at` - TIMESTAMP
- `last_correct` - BOOLEAN
- `first_seen_at` - TIMESTAMP

## API Functions Needed

### Get User Progress
```typescript
async function getUserProgress(userId: string): Promise<ProgressMap>
```

### Update Progress
```typescript
async function updateProgress(
  userId: string, 
  questionId: string, 
  correct: boolean
): Promise<void>
```

### Sync Progress (Batch)
```typescript
async function syncProgress(
  userId: string, 
  progress: ProgressMap
): Promise<void>
```

## Error Handling
- Network errors: Queue updates, retry later
- Conflict resolution: Server wins (or merge strategy)
- Offline mode: Use localStorage, sync when online

## Testing Checklist
- [ ] Progress saves to server on answer
- [ ] Progress loads from server on login
- [ ] Progress syncs across devices
- [ ] Offline mode works (localStorage fallback)
- [ ] Migration from localStorage works
- [ ] Error handling works (network failures)

