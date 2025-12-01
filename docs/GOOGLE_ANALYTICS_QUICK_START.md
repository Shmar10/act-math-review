# Google Analytics Quick Start

## 3-Step Setup

### 1. Get Your Measurement ID
- Go to https://analytics.google.com/
- Create a property (or use existing)
- Copy your Measurement ID (looks like `G-XXXXXXXXXX`)

### 2. Add to Configuration

**Option A: Environment Variable (Recommended)**
Create a `.env` file in the project root:
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GA_ENABLED=true
```

**Option B: Direct Config**
Edit `src/config/analytics.ts`:
```typescript
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
```

### 3. Test It
1. Start your dev server: `npm run dev`
2. Open browser console - you should see `[GA] Initialized` message
3. Perform actions (start practice, answer questions)
4. Check Google Analytics Realtime reports

## What's Tracked

✅ Page views
✅ Practice sessions started
✅ Questions answered (correct/incorrect)
✅ Practice sessions completed
✅ Admin page access

## Verification

1. Open https://analytics.google.com/
2. Go to **Realtime** > **Events**
3. Perform actions on your site
4. Events should appear within seconds

## For GitHub Pages

Add to `.github/workflows/deploy-pages.yml`:
```yaml
- name: Build
  run: npm run build
  env:
    VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}
```

Then add `VITE_GA_MEASUREMENT_ID` as a GitHub Secret in your repo settings.

## Disable Tracking

Set in `.env`:
```env
VITE_GA_ENABLED=false
```

Or comment out `initGA()` in `src/main.tsx`

## Need More Details?

See `docs/GOOGLE_ANALYTICS_SETUP.md` for complete documentation.

