# Premium Access Control Approaches

## Overview

This document outlines different approaches to restrict premium features (topic review pages with downloadable guides) to paying users only. The feature will be part of higher-paying subscription tiers.

## Current System Context

- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **User Table**: `user_profiles` with basic fields (id, first_name, last_name, email, email_verified)
- **Security**: Row Level Security (RLS) policies
- **Infrastructure**: Static site on GitHub Pages

---

## Approach 1: Subscription Fields in User Profile (Recommended for MVP)

### Overview
Add subscription-related fields directly to the `user_profiles` table.

### Implementation

**Database Schema:**
```sql
-- Add to user_profiles table
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free', -- free|basic|premium|pro
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive', -- active|inactive|cancelled|expired
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
```

**TypeScript Types:**
```typescript
export interface UserProfile {
  // ... existing fields
  subscription_tier: 'free' | 'basic' | 'premium' | 'pro';
  subscription_status: 'active' | 'inactive' | 'cancelled' | 'expired';
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}
```

**Access Check Function:**
```typescript
export function hasPremiumAccess(profile: UserProfile): boolean {
  const now = new Date();
  const endDate = profile.subscription_end_date 
    ? new Date(profile.subscription_end_date) 
    : null;
  
  return (
    profile.subscription_status === 'active' &&
    (profile.subscription_tier === 'premium' || profile.subscription_tier === 'pro') &&
    (!endDate || endDate > now)
  );
}
```

### Pros
✅ Simple to implement  
✅ Easy to query  
✅ Works with existing RLS policies  
✅ Fast access checks  
✅ No additional tables needed

### Cons
❌ Limited subscription history  
❌ Harder to track subscription changes  
❌ Can bloat user_profiles table

### Best For
- MVP/initial launch
- Simple subscription models
- Small to medium user base

---

## Approach 2: Separate Subscriptions Table

### Overview
Create a dedicated `subscriptions` table to track subscription history and details.

### Implementation

**Database Schema:**
```sql
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL, -- basic|premium|pro
  status TEXT NOT NULL, -- active|inactive|cancelled|expired
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, stripe_subscription_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON public.subscriptions(user_id, status, end_date) 
  WHERE status = 'active';

-- RLS Policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);
```

**Access Check Function:**
```typescript
export async function hasPremiumAccess(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('tier, status, end_date')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gte('end_date', new Date().toISOString())
    .or('end_date.is.null')
    .single();
  
  if (error || !data) return false;
  
  return data.tier === 'premium' || data.tier === 'pro';
}
```

### Pros
✅ Complete subscription history  
✅ Easy to track changes over time  
✅ Supports multiple subscriptions (upgrades/downgrades)  
✅ Better for analytics  
✅ Cleaner separation of concerns

### Cons
❌ More complex queries  
❌ Additional table to manage  
❌ Requires JOIN for user profile queries

### Best For
- Production systems
- Complex subscription models
- Need for subscription history/analytics
- Multiple subscription types

---

## Approach 3: Stripe Integration with Webhooks

### Overview
Use Stripe for payment processing and sync subscription status via webhooks.

### Implementation

**Stripe Setup:**
1. Create Stripe account and products
2. Set up webhook endpoint (Supabase Edge Function or external service)
3. Configure webhook events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

**Webhook Handler (Supabase Edge Function):**
```typescript
// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  
  // Verify webhook signature
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    signature,
    webhookSecret
  )
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: subscription.metadata.user_id,
          tier: subscription.metadata.tier,
          status: subscription.status,
          stripe_customer_id: subscription.customer,
          stripe_subscription_id: subscription.id,
          start_date: new Date(subscription.current_period_start * 1000),
          end_date: new Date(subscription.current_period_end * 1000),
        })
      break
      
    case 'customer.subscription.deleted':
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', event.data.object.id)
      break
  }
  
  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

**Client-Side Checkout:**
```typescript
import { loadStripe } from '@stripe/stripe-js'

export async function initiateCheckout(userId: string, tier: string) {
  const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY!)
  
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, tier }),
  })
  
  const { sessionId } = await response.json()
  await stripe!.redirectToCheckout({ sessionId })
}
```

### Pros
✅ Industry-standard payment processing  
✅ Handles payment failures automatically  
✅ Supports multiple payment methods  
✅ Built-in subscription management  
✅ Secure (PCI compliant)

### Cons
❌ Requires Stripe account setup  
❌ Webhook infrastructure needed  
❌ More complex initial setup  
❌ Transaction fees (2.9% + $0.30)

### Best For
- Production monetization
- Recurring subscriptions
- Professional payment processing
- Scale-ready solution

---

## Approach 4: Simple Boolean Flag (Quick Start)

### Overview
Simplest approach: add a single `is_premium` boolean flag.

### Implementation

**Database Schema:**
```sql
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
```

**Access Check:**
```typescript
export function hasPremiumAccess(profile: UserProfile): boolean {
  return profile.is_premium === true;
}
```

### Pros
✅ Extremely simple  
✅ Fast queries  
✅ Easy to understand

### Cons
❌ No subscription tracking  
❌ Manual updates required  
❌ No expiration dates  
❌ Not scalable

### Best For
- Testing/development
- Manual premium grants
- Very simple use cases
- Temporary solution

---

## Approach 5: Supabase User Metadata (JWT Claims)

### Overview
Store subscription info in Supabase Auth user metadata (JWT claims).

### Implementation

**Setting Premium Status:**
```typescript
// Admin function to grant premium access
export async function grantPremiumAccess(
  userId: string, 
  tier: string,
  expiresAt?: Date
) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      user_metadata: {
        subscription_tier: tier,
        subscription_expires_at: expiresAt?.toISOString(),
      }
    }
  )
}
```

**Access Check:**
```typescript
export function hasPremiumAccess(user: User): boolean {
  const tier = user.user_metadata?.subscription_tier
  const expiresAt = user.user_metadata?.subscription_expires_at
  
  if (!tier || (tier !== 'premium' && tier !== 'pro')) return false
  if (expiresAt && new Date(expiresAt) < new Date()) return false
  
  return true
}
```

### Pros
✅ Available in JWT (no DB query needed)  
✅ Fast access checks  
✅ Works with existing auth system

### Cons
❌ Limited storage (metadata size limits)  
❌ Not ideal for complex subscriptions  
❌ Harder to query/analyze  
❌ Requires admin access to update

### Best For
- Simple premium flags
- Temporary access grants
- Testing
- Complementary to other approaches

---

## Approach 6: Hybrid Approach (Recommended for Production)

### Overview
Combine multiple approaches for flexibility and reliability.

### Implementation

**Database Structure:**
- `user_profiles`: Add `subscription_tier` and `subscription_status` for quick checks
- `subscriptions`: Full subscription history table
- Stripe: Payment processing and webhook sync
- User Metadata: Cache tier in JWT for fast client-side checks

**Access Check (Multi-layer):**
```typescript
export async function hasPremiumAccess(userId: string, user?: User): boolean {
  // Fast check: JWT metadata (if available)
  if (user?.user_metadata?.subscription_tier) {
    const tier = user.user_metadata.subscription_tier
    const expiresAt = user.user_metadata.subscription_expires_at
    if ((tier === 'premium' || tier === 'pro') && 
        (!expiresAt || new Date(expiresAt) > new Date())) {
      return true
    }
  }
  
  // Reliable check: Database query
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_tier, subscription_status, subscription_end_date')
    .eq('id', userId)
    .single()
  
  if (!profile) return false
  
  const now = new Date()
  const endDate = profile.subscription_end_date 
    ? new Date(profile.subscription_end_date) 
    : null
  
  return (
    profile.subscription_status === 'active' &&
    (profile.subscription_tier === 'premium' || profile.subscription_tier === 'pro') &&
    (!endDate || endDate > now)
  )
}
```

### Pros
✅ Fast (JWT cache) + Reliable (DB check)  
✅ Complete subscription history  
✅ Professional payment processing  
✅ Scalable architecture

### Cons
❌ More complex to implement  
❌ Multiple systems to maintain

### Best For
- Production systems
- Best user experience
- Long-term scalability

---

## Recommendation: Phased Approach

### Phase 1: MVP (Approach 1 - Subscription Fields)
- Add fields to `user_profiles` table
- Manual premium grants via admin panel
- Simple access checks
- **Timeline**: 1-2 days

### Phase 2: Payment Integration (Approach 3 - Stripe)
- Integrate Stripe checkout
- Add webhook handler
- Sync subscription status
- **Timeline**: 3-5 days

### Phase 3: Full System (Approach 6 - Hybrid)
- Add subscriptions table for history
- Cache in JWT metadata
- Complete analytics
- **Timeline**: 5-7 days

---

## Implementation Checklist

### Database Changes
- [ ] Add subscription fields to `user_profiles` OR create `subscriptions` table
- [ ] Update RLS policies
- [ ] Create indexes for performance
- [ ] Add database functions if needed

### TypeScript Types
- [ ] Update `UserProfile` interface
- [ ] Create `Subscription` interface (if separate table)
- [ ] Add access check functions

### Frontend Components
- [ ] Create premium access check hook: `usePremiumAccess()`
- [ ] Create protected route wrapper
- [ ] Build premium feature pages (topic reviews)
- [ ] Add "Upgrade" CTAs for non-premium users

### Payment Integration (Phase 2+)
- [ ] Set up Stripe account
- [ ] Create Stripe products/prices
- [ ] Build checkout flow
- [ ] Set up webhook endpoint
- [ ] Test payment flows

### Admin Tools
- [ ] Add manual premium grant in admin panel
- [ ] View subscription status
- [ ] Cancel/refund subscriptions

---

## Security Considerations

1. **Server-Side Validation**: Always verify premium status on the server, not just client
2. **RLS Policies**: Ensure premium content queries respect RLS
3. **Download Protection**: Generate signed URLs for downloads (time-limited)
4. **Rate Limiting**: Prevent abuse of premium endpoints
5. **Audit Logging**: Track premium access attempts

---

## Next Steps

1. Choose approach based on timeline and complexity needs
2. Create database migration script
3. Implement access check functions
4. Build premium feature pages
5. Add payment integration (if using Stripe)
6. Test thoroughly before launch

