# Detailed Automation Options for Statistics Generation

## Overview

This guide explains how to automatically update the `PROBLEM_STATISTICS.md` file when you add new questions.

---

## Option 1: Git Pre-Commit Hook (Auto-update before each commit)

### What is it?

A Git hook is a script that runs automatically at certain points in your Git workflow. A **pre-commit hook** runs right before you commit changes. We can use it to automatically generate the statistics file and include it in your commit.

### How it works:

1. You add/edit question files
2. You run `git add` to stage your changes
3. You run `git commit`
4. **Before the commit completes**, Git automatically:
   - Runs `npm run generate-stats`
   - Adds the updated `PROBLEM_STATISTICS.md` file
   - Includes it in the commit
5. Your commit contains both the new questions AND the updated statistics

### Step-by-Step Setup:

#### Step 1: Navigate to your project's .git directory

Open a terminal in your project root and check if the hooks directory exists:

```bash
cd C:\Users\shama\act-math-review\act-math-review
ls .git/hooks  # On Windows: dir .git\hooks
```

You should see files like `pre-commit.sample`. This is normal - Git creates sample hooks.

#### Step 2: Create the pre-commit hook

Create a new file called `pre-commit` (no extension) in `.git/hooks/`:

**Windows (PowerShell):**
```powershell
# Navigate to hooks directory
cd .git\hooks

# Create the pre-commit file
@"
#!/bin/sh
# Auto-generate problem statistics before each commit
echo "📊 Generating problem statistics..."
npm run generate-stats
git add docs/PROBLEM_STATISTICS.md
"@ | Out-File -Encoding utf8 pre-commit
```

**Mac/Linux:**
```bash
cd .git/hooks
cat > pre-commit << 'EOF'
#!/bin/sh
# Auto-generate problem statistics before each commit
echo "📊 Generating problem statistics..."
npm run generate-stats
git add docs/PROBLEM_STATISTICS.md
EOF
```

#### Step 3: Make it executable (Mac/Linux only)

```bash
chmod +x pre-commit
```

On Windows, this step is usually not needed, but if you're using Git Bash, you might need to run:
```bash
chmod +x pre-commit
```

#### Step 4: Test it

1. Make a small change to a question file (or create a test commit)
2. Stage your changes: `git add .`
3. Try to commit: `git commit -m "Test commit"`
4. You should see the statistics generation message and the commit will include the updated stats file

### Example Workflow:

```bash
# 1. You add 5 new questions to algebra-quadratics.json
# 2. Stage your changes
git add public/content/questions/algebra-quadratics.json

# 3. Commit - the hook automatically runs!
git commit -m "Add 5 new quadratic equation problems"

# Output you'll see:
# 📊 Generating problem statistics...
# ✅ Statistics generated successfully!
#    Total problems: 187
#    Files processed: 22
# [main abc1234] Add 5 new quadratic equation problems
#  2 files changed: algebra-quadratics.json, PROBLEM_STATISTICS.md
```

### Pros:
- ✅ **Always up-to-date** - Statistics are automatically updated
- ✅ **Zero effort** - You don't have to remember to run the script
- ✅ **Commit includes stats** - Both questions and stats are in the same commit
- ✅ **Works everywhere** - Runs on your local machine automatically

### Cons:
- ⚠️ **Adds time to commits** - Each commit takes a few extra seconds
- ⚠️ **Requires npm/node** - Must have Node.js available when committing
- ⚠️ **Can't commit offline** - Needs to run the npm script

### Troubleshooting:

**Hook not running?**
- Make sure the file is in `.git/hooks/` (not `.git/hooks/pre-commit.sample`)
- On Mac/Linux, make sure it's executable: `chmod +x .git/hooks/pre-commit`
- Check that the file starts with `#!/bin/sh`

**Script fails?**
- Make sure you're in the project root when committing
- Ensure Node.js is installed and `npm run generate-stats` works manually
- Check that `docs/` directory exists

**Want to skip the hook?**
- Use `git commit --no-verify` to skip hooks (not recommended, but possible)

---

## Option 2: Add to Build Process (Update stats during build)

### What is it?

This adds the statistics generation to your build process, so every time you build the project (like when deploying), the stats are automatically regenerated.

### How it works:

1. You run `npm run build` (or deploy to GitHub Pages)
2. **Before building**, the script automatically runs `npm run generate-stats`
3. The statistics file is updated
4. Then the normal build continues

### Step-by-Step Setup:

#### Step 1: Open package.json

Find the `"scripts"` section in your `package.json` file.

#### Step 2: Modify the build script

**Before:**
```json
{
  "scripts": {
    "build": "tsc -b && vite build"
  }
}
```

**After:**
```json
{
  "scripts": {
    "build": "npm run generate-stats && tsc -b && vite build"
  }
}
```

The `&&` means "run this command, and only if it succeeds, run the next one."

#### Step 3: Test it

Run your build command:
```bash
npm run build
```

You should see:
```
> act-math-vite@0.0.0 build
> npm run generate-stats && tsc -b && vite build

> act-math-vite@0.0.0 generate-stats
> node scripts/generate-stats.js

✅ Statistics generated successfully!
   Total problems: 182
   ...
[vite] building...
```

### When it runs:

- ✅ Every time you run `npm run build` locally
- ✅ Every time you deploy to GitHub Pages (it runs during the build)
- ✅ Before preview builds (`npm run preview`)
- ❌ **NOT** when you just commit code (unless you build after committing)
- ❌ **NOT** during development (`npm run dev`)

### Example Workflow:

```bash
# 1. You add 5 new questions
# 2. You're ready to deploy, so you build:
npm run build

# Output:
# ✅ Statistics generated successfully!
#    Total problems: 187  (updated from 182)
# [vite] building for production...
# ✓ built in 4.2s

# 3. The dist/ folder now has your updated site
# 4. When deployed, the stats file will be up-to-date
```

### Pros:
- ✅ **Always current in production** - Stats are updated for every deployment
- ✅ **No extra commits needed** - Stats update during build, not commit
- ✅ **Works on CI/CD** - Perfect for GitHub Actions workflows
- ✅ **Less commit noise** - Stats file changes don't clutter your commit history

### Cons:
- ⚠️ **Stats file might be outdated locally** - The file in your repo might be old until you build
- ⚠️ **Build takes slightly longer** - Adds a few seconds to build time
- ⚠️ **Not updated on commits** - Only updates when you build

### Important Note:

If you use this option, you have two approaches:

**Approach A: Don't commit the stats file**
- Add `docs/PROBLEM_STATISTICS.md` to `.gitignore`
- Stats are generated fresh on each build
- The file only exists in built deployments

**Approach B: Commit the stats file (recommended)**
- Keep tracking `PROBLEM_STATISTICS.md` in git
- Stats are generated during build AND you can see them in your repo
- Best of both worlds

### Troubleshooting:

**Build fails?**
- Make sure `npm run generate-stats` works by itself
- Check that `docs/` directory exists
- Ensure Node.js is installed

**Stats not updating?**
- Make sure the build script includes the generate-stats step
- Check the build output for error messages

---

## Comparison Table

| Feature | Option 1 (Pre-Commit Hook) | Option 2 (Build Process) |
|---------|---------------------------|--------------------------|
| **When it runs** | Before every commit | During every build |
| **Stats in commits** | ✅ Yes, automatically | ❌ No (unless you commit separately) |
| **Stats in production** | ✅ Yes | ✅ Yes |
| **Local stats file** | ✅ Always current | ⚠️ Might be outdated until build |
| **Commit time** | +2-3 seconds | No impact |
| **Build time** | No impact | +1-2 seconds |
| **Setup complexity** | Medium | Easy |
| **Best for** | Always having current stats | Deployment-focused workflows |

---

## Recommendation

**For most users, I recommend Option 1 (Pre-Commit Hook)** because:
- Your statistics are always up-to-date in your repository
- You can see the stats file changes in your commit history
- It's automatic and requires no thought
- The few extra seconds per commit are worth it

**Use Option 2 (Build Process) if:**
- You deploy frequently and want fresh stats on every deployment
- You don't want stats changes cluttering your commit history
- You prefer stats to be generated only when building

**You can even use both!** Though that's usually overkill - the pre-commit hook is usually enough.

---

## Next Steps

1. Choose which option you prefer
2. Follow the step-by-step setup above
3. Test it with a small change
4. Adjust as needed

Need help setting it up? Let me know which option you'd like to use and I can guide you through it!

