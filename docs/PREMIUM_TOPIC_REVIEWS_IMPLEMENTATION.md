# Premium Topic Review Pages - Implementation Plan

## Feature Overview

Premium subscribers will have access to:
- **Topic Review Pages**: Dedicated pages for each math topic with comprehensive review content
- **Downloadable Review Guides**: PDF guides with practice problems for each topic
- **Restricted Access**: Only available to Premium and Pro tier subscribers

## Recommended Approach: Hybrid (Approach 6)

Based on the analysis in `PREMIUM_ACCESS_APPROACHES.md`, we recommend the **Hybrid Approach** for production:

1. **Database**: Subscription fields in `user_profiles` + `subscriptions` table for history
2. **Payment**: Stripe integration for processing
3. **Access Check**: JWT metadata cache + database verification

## Implementation Steps

### Step 1: Database Schema Updates

```sql
-- Add subscription fields to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;

-- Create subscriptions table for history
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  status TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Step 2: TypeScript Types

```typescript
// src/types/user.ts
export interface UserProfile {
  // ... existing fields
  subscription_tier: 'free' | 'basic' | 'premium' | 'pro';
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'expired';
  subscription_end_date: string | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: string;
  status: string;
  start_date: string;
  end_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}
```

### Step 3: Access Check Hook

```typescript
// src/hooks/usePremiumAccess.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

export function usePremiumAccess() {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      // Quick check: JWT metadata
      const tier = user.user_metadata?.subscription_tier;
      const expiresAt = user.user_metadata?.subscription_expires_at;
      
      if (tier && (tier === 'premium' || tier === 'pro')) {
        if (!expiresAt || new Date(expiresAt) > new Date()) {
          setHasAccess(true);
          setLoading(false);
          return;
        }
      }

      // Reliable check: Database
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_tier, subscription_status, subscription_end_date')
        .eq('id', user.id)
        .single();

      if (!profile) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      const now = new Date();
      const endDate = profile.subscription_end_date 
        ? new Date(profile.subscription_end_date) 
        : null;

      const access = (
        profile.subscription_status === 'active' &&
        (profile.subscription_tier === 'premium' || profile.subscription_tier === 'pro') &&
        (!endDate || endDate > now)
      );

      setHasAccess(access);
      setLoading(false);
    }

    checkAccess();
  }, [user]);

  return { hasAccess, loading };
}
```

### Step 4: Protected Route Component

```typescript
// src/components/PremiumProtected.tsx
import { usePremiumAccess } from '../hooks/usePremiumAccess';
import { useAuth } from '../hooks/useAuth';

interface PremiumProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PremiumProtected({ 
  children, 
  fallback 
}: PremiumProtectedProps) {
  const { hasAccess, loading } = usePremiumAccess();
  const { isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-300">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-slate-300 mb-6">
            Please sign in to access premium content.
          </p>
          <a
            href="/act-math-review/auth/login"
            className="px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return fallback || <UpgradePrompt />;
  }

  return <>{children}</>;
}

function UpgradePrompt() {
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Premium Access Required</h1>
        <p className="text-slate-300 mb-6">
          This content is available for Premium and Pro subscribers only.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/act-math-review/upgrade"
            className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            Upgrade to Premium
          </a>
          <a
            href="/act-math-review/"
            className="px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
          >
            Back to Practice
          </a>
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Topic Review Page Structure

```typescript
// src/components/premium/TopicReviewPage.tsx
import PremiumProtected from '../PremiumProtected';
import { useParams } from 'react-router-dom';

export default function TopicReviewPage() {
  const { topic } = useParams();

  return (
    <PremiumProtected>
      <div className="min-h-screen px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">{topic} Review</h1>
          
          {/* Review Content */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            {/* Review material here */}
          </div>

          {/* Download Button */}
          <div className="flex gap-4">
            <button
              onClick={() => downloadReviewGuide(topic)}
              className="px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              📥 Download Review Guide (PDF)
            </button>
          </div>
        </div>
      </div>
    </PremiumProtected>
  );
}

async function downloadReviewGuide(topic: string) {
  // Generate signed URL from Supabase Storage
  // Or generate PDF on-the-fly
  // Verify premium access before allowing download
}
```

### Step 6: Download Protection

```typescript
// src/services/premium.ts
import { supabase } from '../lib/supabase';

export async function getReviewGuideDownloadUrl(
  topic: string,
  userId: string
): Promise<{ url: string | null; error: Error | null }> {
  // Verify premium access
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_tier, subscription_status, subscription_end_date')
    .eq('id', userId)
    .single();

  if (!profile || profile.subscription_status !== 'active') {
    return { url: null, error: new Error('Premium access required') };
  }

  if (profile.subscription_tier !== 'premium' && profile.subscription_tier !== 'pro') {
    return { url: null, error: new Error('Premium access required') };
  }

  // Generate signed URL (expires in 1 hour)
  const { data, error } = await supabase
    .storage
    .from('review-guides')
    .createSignedUrl(`${topic}-review.pdf`, 3600);

  if (error) {
    return { url: null, error };
  }

  return { url: data.signedUrl, error: null };
}
```

## File Structure

```
src/
├── components/
│   ├── premium/
│   │   ├── TopicReviewPage.tsx
│   │   ├── ReviewGuideList.tsx
│   │   └── UpgradePrompt.tsx
│   └── PremiumProtected.tsx
├── hooks/
│   └── usePremiumAccess.ts
├── services/
│   └── premium.ts
└── types/
    └── user.ts (updated)
```

## Security Checklist

- [ ] Server-side access verification (never trust client-only checks)
- [ ] Signed URLs for downloads (time-limited)
- [ ] RLS policies on subscription data
- [ ] Rate limiting on download endpoints
- [ ] Audit logging for premium access attempts
- [ ] Regular subscription status sync from Stripe

## Testing Plan

1. **Free User**: Should see upgrade prompt
2. **Premium User**: Should access all content
3. **Expired Subscription**: Should see upgrade prompt
4. **Download URLs**: Should expire after time limit
5. **Multiple Topics**: All topics should be protected

## Next Steps

1. Choose implementation approach (recommend Hybrid)
2. Create database migration
3. Implement access check hook
4. Build premium protected wrapper
5. Create topic review pages
6. Set up download system
7. Integrate payment processing (Stripe)

