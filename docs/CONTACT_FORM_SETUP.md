# Contact Form Setup Guide

## Overview

The Contact Us form uses EmailJS to send emails directly from the browser without requiring a backend server. This is perfect for static sites like GitHub Pages.

## Setup Steps

### Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com/
2. Sign up for a free account (or sign in if you have one)
3. Free tier includes 200 emails/month

### Step 2: Add Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider:
   - **Gmail** (recommended for gmail.com addresses)
   - **Outlook**
   - **Yahoo**
   - Or any SMTP service
4. Follow the setup instructions for your provider
5. **Note the Service ID** (you'll need this)

### Step 3: Create Email Template

1. Go to **Email Templates** in EmailJS dashboard
2. Click **Create New Template**
3. Use this template:

**Template Name:** Contact Form

**Subject:**
```
ACT Math Review - {{subject}}
```

**Content (Plain Text Version - Recommended):**
```
You received a new message from the ACT Math Review contact form:

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from the ACT Math Review website contact form.
```

**OR Content (HTML Version - if you prefer HTML):**
```html
<p>You received a new message from the ACT Math Review contact form:</p>

<p><strong>From:</strong> {{from_name}}<br>
<strong>Email:</strong> {{from_email}}<br>
<strong>Subject:</strong> {{subject}}</p>

<p><strong>Message:</strong><br>
{{message}}</p>

<hr>
<p><em>This email was sent from the ACT Math Review website contact form.</em></p>
```

**Important:** Make sure the variable names match exactly:
- `{{from_name}}`
- `{{from_email}}`
- `{{subject}}`
- `{{message}}`

4. **Note the Template ID** (you'll need this)

### Step 4: Get Your Public Key

1. Go to **Account** → **General** in EmailJS dashboard
2. Find your **Public Key** (also called API Key)
3. Copy it

### Step 5: Add to Environment Variables

Add these to your `.env` file:

```env
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID=your-template-id
VITE_EMAILJS_PUBLIC_KEY=your-public-key
```

**Example:**
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abcdefghijklmnop
```

### Step 6: Update Email Template (Optional)

If you want emails to go to `shawnmathtutor@gmail.com`:

1. In your EmailJS service settings, make sure the "To Email" is set to:
   ```
   shawnmathtutor@gmail.com
   ```

   OR

2. Add it to the template as a variable (if your service supports it)

### Step 7: Restart Dev Server

After adding the environment variables:
1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Test the contact form

## Testing

1. Go to your site
2. Scroll to the bottom
3. Click "Contact Us"
4. Fill out the form
5. Submit
6. Check your email (shawnmathtutor@gmail.com)

## For Production (GitHub Pages)

When deploying to GitHub Pages:

1. Add these as GitHub Secrets:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`

2. Update `.github/workflows/deploy.yml` to include them in the build step:

```yaml
- name: Build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    VITE_EMAILJS_SERVICE_ID: ${{ secrets.VITE_EMAILJS_SERVICE_ID }}
    VITE_EMAILJS_TEMPLATE_ID: ${{ secrets.VITE_EMAILJS_TEMPLATE_ID }}
    VITE_EMAILJS_PUBLIC_KEY: ${{ secrets.VITE_EMAILJS_PUBLIC_KEY }}
  run: npm run build
```

## EmailJS Free Tier Limits

- **200 emails/month** (free tier)
- **2 email services**
- **10 email templates**
- **50 contacts**

This should be plenty for a contact form!

## Troubleshooting

### "Email service not configured" Error

**Problem:** Environment variables not set or not loaded

**Solution:**
1. Check `.env` file has all three variables
2. Restart dev server
3. Check variable names are correct (must start with `VITE_`)

### Emails Not Arriving

**Possible Causes:**
1. Email went to spam folder
2. Service ID or Template ID incorrect
3. Email service not properly connected
4. Template variables don't match

**Solution:**
1. Check spam folder
2. Verify all IDs in `.env` file
3. Test email service in EmailJS dashboard
4. Check EmailJS dashboard for error logs

### Form Submits But No Email

**Problem:** EmailJS configuration issue

**Solution:**
1. Check EmailJS dashboard → **Logs** for errors
2. Verify template variables match form data
3. Make sure email service is active
4. Check browser console for errors

## Security Notes

- Public Key is safe to expose (it's meant for client-side use)
- EmailJS has rate limiting to prevent abuse
- Free tier is sufficient for contact forms
- Consider upgrading if you expect high volume

## Alternative: If EmailJS Doesn't Work

If you prefer a different solution:
- **Formspree** - Similar service, easy setup
- **Netlify Forms** - If using Netlify hosting
- **Backend API** - More complex but more control

