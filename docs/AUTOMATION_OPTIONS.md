# Automation Options for Statistics Generation

## Quick Reference

Run manually:
```bash
npm run generate-stats
```

## Automation Options

### Option 1: Git Pre-Commit Hook (Auto-update on commit)

Create `.git/hooks/pre-commit`:

```bash
#!/bin/sh
# Auto-generate statistics before each commit
npm run generate-stats
git add docs/PROBLEM_STATISTICS.md
```

**Pros:** Always up-to-date  
**Cons:** Adds time to every commit

### Option 2: Add to Build Process

Update `package.json`:

```json
{
  "scripts": {
    "build": "npm run generate-stats && tsc -b && vite build"
  }
}
```

**Pros:** Stats updated for every build  
**Cons:** Adds time to build

### Option 3: CI/CD Check (Recommended)

Add to `.github/workflows/deploy-pages.yml` before build:

```yaml
- name: Check statistics are up-to-date
  run: |
    npm run generate-stats
    git diff --exit-code docs/PROBLEM_STATISTICS.md || (echo "❌ Statistics file outdated! Run 'npm run generate-stats' and commit." && exit 1)
```

**Pros:** Fails build if stats are outdated (good reminder)  
**Cons:** Requires manual update when adding questions

### Option 4: Manual with Reminder (Simplest)

Just run `npm run generate-stats` when you add questions. Set a reminder or add it to your workflow checklist.

**Recommended:** Start with Option 4, then move to Option 3 if you find yourself forgetting.

