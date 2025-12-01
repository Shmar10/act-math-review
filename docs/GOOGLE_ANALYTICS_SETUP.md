# Google Analytics Setup Guide

This guide explains how to set up Google Analytics tracking for the ACT Math Review application.

## Quick Setup

### Step 1: Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Create a new property (or use an existing one)
   - Property name: "ACT Math Review" (or your preferred name)
   - Time zone: Your time zone
   - Currency: Your currency
4. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)
   - It will be shown in the property setup or admin settings

### Step 2: Configure the Application

#### Option A: Environment Variable (Recommended)

1. Create a `.env` file in the root directory (copy from `.env.example`)
2. Add your Measurement ID:

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GA_ENABLED=true
```

3. Restart your development server

#### Option B: Direct Configuration

Edit `src/config/analytics.ts` and replace the empty string:

```typescript
export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Your ID here
```

### Step 3: Build and Deploy

For production deployment:

1. Make sure your `.env` file is configured (or update `analytics.ts`)
2. Build the application: `npm run build`
3. Deploy to your hosting service

**Note:** For GitHub Pages, you'll need to set environment variables in your GitHub Actions workflow or use the direct configuration method.

## Events Tracked

The application automatically tracks the following events:

### Page Views
- Initial page load
- Page navigation (if using routing in future)

### Practice Events
- **`practice_started`**: When a user starts a practice session
  - Parameters: mode (quick/standard/full/study), topic, difficulty
  
- **`question_correct`**: When a user answers correctly
  - Parameters: question ID, topic
  
- **`question_incorrect`**: When a user answers incorrectly
  - Parameters: question ID, topic
  
- **`practice_completed`**: When a practice session ends
  - Parameters: mode, total questions, accuracy percentage

### Admin Events
- **`admin_access`**: When admin page is accessed

### Settings Events
- **`settings_changed`**: When user changes preferences (if implemented)

## Viewing Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Navigate to **Reports** > **Engagement** > **Events** to see tracked events
4. Check **Realtime** to see current users

## Custom Events

To add custom tracking, use the utility functions in `src/utils/analytics.ts`:

```typescript
import { trackEvent } from './utils/analytics';

// Track a custom event
trackEvent('button_clicked', 'UI', 'start_practice_button');
```

## Testing

### Development Mode

In development, analytics will:
- Log all events to the console (if `VITE_GA_DEBUG=true`)
- Still send data to Google Analytics (if enabled)

### Verify Tracking is Working

1. Open browser developer tools (F12)
2. Go to the Network tab
3. Filter by "collect" or "google-analytics"
4. Perform actions on the site (start practice, answer questions)
5. You should see requests to Google Analytics

Or check the Realtime report in Google Analytics to see your activity.

## Disabling Analytics

### For Development

Set in `.env`:
```env
VITE_GA_ENABLED=false
```

### For Production

You can disable analytics by:
1. Removing the Measurement ID from config
2. Setting `VITE_GA_ENABLED=false`
3. Or commenting out the `initGA()` call in `src/main.tsx`

## Privacy Considerations

- Google Analytics collects anonymous usage data
- No personally identifiable information is sent
- Consider adding a privacy policy explaining data collection
- Users can block tracking via browser extensions

## Troubleshooting

### Analytics Not Working

1. **Check Measurement ID**: Ensure it's correct and starts with `G-`
2. **Check Console**: Look for errors in browser console
3. **Check Network**: Verify requests are being sent to Google Analytics
4. **Check Filters**: Make sure your IP isn't filtered in GA settings (for testing)
5. **Wait Time**: Data may take 24-48 hours to appear in reports (though Realtime works immediately)

### Events Not Showing

1. Events appear in **Events** report, not just page views
2. Check the **Realtime** > **Events** view for immediate verification
3. Ensure events are being triggered (check console logs if debug is enabled)

## GitHub Pages Deployment

For GitHub Pages, you have two options:

### Option 1: Use GitHub Secrets (Recommended)

1. Go to your repository Settings > Secrets and variables > Actions
2. Add a new secret: `VITE_GA_MEASUREMENT_ID` with your Measurement ID
3. Update `.github/workflows/deploy-pages.yml` to use the secret:

```yaml
- name: Build
  run: npm run build
  env:
    VITE_GA_MEASUREMENT_ID: ${{ secrets.VITE_GA_MEASUREMENT_ID }}
```

### Option 2: Direct Configuration

Edit `src/config/analytics.ts` directly with your Measurement ID (less secure but simpler).

## Advanced Configuration

See `src/utils/analytics.ts` for available tracking functions:
- `trackPageView(path, title)`
- `trackEvent(action, category, label, value)`
- `trackPracticeStarted(mode, topic, difficulty)`
- `trackQuestionAnswered(questionId, correct, topic)`
- `trackPracticeCompleted(mode, totalQuestions, correctAnswers)`
- `trackAdminAccess()`
- `trackSettingsChange(setting, value)`

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your Measurement ID is correct
3. Check Google Analytics Realtime reports
4. Review the code in `src/utils/analytics.ts` and `src/config/analytics.ts`

