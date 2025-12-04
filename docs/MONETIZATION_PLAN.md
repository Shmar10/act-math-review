# Monetization Plan - Tiered Access System

## Overview

Implement a tiered subscription system that limits access to practice problems based on the user's subscription tier.

## Proposed Tiers

### Tier 1: Free (Starter)
- **Price:** Free
- **Problems:** 60 fixed problems
- **Features:**
  - Access to core practice problems
  - Basic progress tracking
  - Dashboard with limited stats
  - Email support
- **Target:** Students trying out the site, basic practice

### Tier 2: Premium (Recommended)
- **Price:** $9.99/month or $79.99/year (save 33%)
- **Problems:** All problems (currently 692+)
- **Features:**
  - Full access to all practice problems
  - Advanced progress tracking
  - Detailed analytics dashboard
  - Priority email support
  - Practice session history
  - Export progress reports
- **Target:** Serious ACT prep students

### Tier 3: Pro (Optional - Future)
- **Price:** $19.99/month or $179.99/year
- **Problems:** All problems + exclusive content
- **Features:**
  - Everything in Premium
  - Exclusive advanced problems
  - Video explanations (future)
  - Personalized study plans (future)
  - 1-on-1 support access
- **Target:** Students needing intensive prep

## Implementation Approach

### Phase 1: Database Schema Changes

#### New Tables Needed:

1. **`subscription_tiers`** - Define available tiers
```sql
CREATE TABLE subscription_tiers (
  id TEXT PRIMARY KEY, -- 'free', 'premium', 'pro'
  name TEXT NOT NULL,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  max_problems INTEGER, -- NULL = unlimited
  features JSONB, -- Array of feature strings
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. **`user_subscriptions`** - Track user subscriptions
```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id TEXT REFERENCES subscription_tiers(id),
  status TEXT NOT NULL, -- 'active', 'canceled', 'expired', 'trial'
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  stripe_subscription_id TEXT, -- If using Stripe
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

3. **`free_tier_problems`** - Define which 60 problems are free
```sql
CREATE TABLE free_tier_problems (
  question_id TEXT PRIMARY KEY,
  topic TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  added_at TIMESTAMP DEFAULT NOW()
);
```

### Phase 2: Payment Processing

#### Option 1: Stripe (Recommended)
- **Pros:** Industry standard, secure, handles subscriptions automatically
- **Cons:** Takes 2.9% + $0.30 per transaction
- **Difficulty:** Medium
- **Setup:** Stripe account + Stripe.js integration

#### Option 2: PayPal
- **Pros:** Widely trusted, easy setup
- **Cons:** Less flexible for subscriptions
- **Difficulty:** Medium
- **Setup:** PayPal Business account

#### Option 3: Manual Payment (Simplest)
- **Pros:** No fees, full control
- **Cons:** Manual verification, not scalable
- **Difficulty:** Easy
- **Setup:** Payment form + manual activation

**Recommendation:** Start with Stripe for automated subscription management.

### Phase 3: Access Control Logic

#### Question Filtering:
1. Check user's subscription tier
2. If Free tier:
   - Filter to only show questions in `free_tier_problems` table
   - Show upgrade prompts after X free problems
3. If Premium/Pro:
   - Show all questions (no filtering)

#### Implementation Points:
- `src/App.tsx` - Filter questions based on tier
- `src/hooks/useSubscription.ts` - New hook for subscription status
- `src/services/subscription.ts` - Subscription API calls
- `src/components/UpgradePrompt.tsx` - Show upgrade prompts

### Phase 4: UI/UX Changes

#### Components Needed:
1. **Subscription Status Badge** - Show current tier in header
2. **Upgrade Prompt** - Modal when free users hit limits
3. **Pricing Page** - Display tiers and pricing
4. **Payment Form** - Stripe checkout integration
5. **Subscription Management** - View/cancel subscription

#### User Flow:
1. User signs up → Automatically on Free tier
2. User practices → Can access 60 free problems
3. After 60 problems → Upgrade prompt appears
4. User clicks upgrade → Payment form
5. Payment successful → Access to all problems
6. Subscription active → Full access continues

## Implementation Difficulty Assessment

### Easy (1-2 days):
- ✅ Database schema creation
- ✅ Basic subscription status checking
- ✅ Free tier problem selection (pick 60 best problems)
- ✅ UI components for subscription display

### Medium (3-5 days):
- ⚠️ Stripe integration
- ⚠️ Payment form and checkout flow
- ⚠️ Subscription management page
- ⚠️ Question filtering logic
- ⚠️ Upgrade prompts

### Complex (1-2 weeks):
- 🔴 Subscription webhooks (handle renewals, cancellations)
- 🔴 Email notifications for subscription events
- 🔴 Admin panel for subscription management
- 🔴 Analytics for subscription metrics
- 🔴 Trial periods
- 🔴 Promo codes/discounts

## Recommended Implementation Order

### Phase 1: Foundation (Week 1)
1. Create database tables
2. Set up subscription tiers
3. Select 60 free tier problems
4. Add subscription status to user profile
5. Basic question filtering

### Phase 2: Payment Integration (Week 2)
1. Set up Stripe account
2. Integrate Stripe Checkout
3. Create payment success/failure handlers
4. Update subscription status after payment

### Phase 3: UI/UX (Week 3)
1. Create pricing page
2. Add upgrade prompts
3. Subscription management page
4. Subscription status display

### Phase 4: Polish (Week 4)
1. Webhook handling for renewals
2. Email notifications
3. Admin tools
4. Testing and bug fixes

## Technical Considerations

### Question Selection for Free Tier:
- Select 60 problems covering:
  - All major topics (Algebra, Geometry, Trig, etc.)
  - Mix of difficulties (1-5 stars)
  - Most commonly tested concepts
  - Representative sample of full bank

### Access Control:
- Check subscription on every practice session start
- Cache subscription status (refresh every 5 minutes)
- Grace period for expired subscriptions (7 days)

### Payment Security:
- Never store credit card info
- Use Stripe's secure payment processing
- Validate payments server-side (Supabase Edge Functions)

## Revenue Projections (Example)

**Assumptions:**
- 1000 users sign up
- 10% convert to Premium ($9.99/month)
- = 100 paying users × $9.99 = $999/month
- Annual: $11,988/year

**With Annual Option:**
- 5% choose annual ($79.99/year)
- = 50 users × $79.99 = $3,999.50/year upfront
- 5% choose monthly = 50 × $9.99 = $499.50/month
- Total: ~$9,993/year

## Alternative: One-Time Payment

Instead of subscriptions, consider:
- **Free:** 60 problems
- **Lifetime Access:** $49.99 one-time payment
- **Pros:** Simpler, no recurring billing
- **Cons:** Lower lifetime value, no recurring revenue

## Recommendation

**Start Simple:**
1. Free tier with 60 problems
2. Premium tier with all problems
3. Monthly subscription ($9.99/month)
4. Manual payment option initially (Stripe later)

**Why:**
- Faster to implement
- Test market demand
- Add Stripe automation later
- Less complexity = fewer bugs

## Next Steps (When Ready)

1. **Select 60 Free Problems:**
   - Review all 692 problems
   - Pick best representative set
   - Cover all major topics

2. **Set Up Stripe:**
   - Create Stripe account
   - Get API keys
   - Test payment flow

3. **Database Setup:**
   - Run migration scripts
   - Create subscription tiers
   - Populate free tier problems

4. **Code Implementation:**
   - Add subscription checking
   - Implement question filtering
   - Create upgrade prompts

## Estimated Total Time

- **Simple Version (Manual Payments):** 1-2 weeks
- **Full Version (Stripe + Automation):** 3-4 weeks
- **With All Features:** 4-6 weeks

## Questions to Consider

1. **Pricing:** Is $9.99/month competitive? Research similar ACT prep sites
2. **Free Tier:** Is 60 problems enough to demonstrate value?
3. **Annual Discount:** How much discount for annual payments?
4. **Trial Period:** Offer 7-day free trial of Premium?
5. **Refund Policy:** What's your refund policy?

---

**Overall Difficulty:** Medium (3-4 weeks for full implementation)

The core logic is straightforward, but payment integration and subscription management add complexity. Starting with manual payments and upgrading to Stripe later is a good approach.

