# EmailJS Template Setup - Step by Step

## Quick Setup Guide

### Step 1: Create Template in EmailJS Dashboard

1. Go to https://dashboard.emailjs.com/admin/templates
2. Click **"Create New Template"**
3. Fill in the form:

### Template Settings

**Template Name:** `Contact Form` (or any name you prefer)

**Subject Line:**
```
ACT Math Review - {{subject}}
```

### Template Content

**Option 1: Plain Text (Simplest - Recommended)**

In the template editor, use this:

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

**Option 2: HTML Format**

If you want HTML formatting, use:

```html
<p>You received a new message from the ACT Math Review contact form:</p>

<p>
<strong>From:</strong> {{from_name}}<br>
<strong>Email:</strong> {{from_email}}<br>
<strong>Subject:</strong> {{subject}}
</p>

<p><strong>Message:</strong></p>
<p>{{message}}</p>

<hr>
<p><em>This email was sent from the ACT Math Review website contact form.</em></p>
```

### Step 2: Set Recipient Email

**Important:** Set the recipient email in your Email Service settings, NOT in the template.

1. Go to **Email Services** in EmailJS dashboard
2. Click on your email service
3. Set **"To Email"** to: `shawnmathtutor@gmail.com`
4. Save

### Step 3: Test the Template

1. In the template editor, click **"Test"** button
2. Fill in test values:
   - `from_name`: Test User
   - `from_email`: test@example.com
   - `subject`: Test Subject
   - `message`: This is a test message
3. Click **"Send Test Email"**
4. Check your email inbox

### Step 4: Get Your Template ID

1. After saving the template, you'll see the Template ID
2. It looks like: `template_abc123xyz`
3. Copy this ID

## Variable Names Must Match

The template variables must match exactly what the form sends:

- ✅ `{{from_name}}` - User's name
- ✅ `{{from_email}}` - User's email
- ✅ `{{subject}}` - Selected subject
- ✅ `{{message}}` - User's message

**Note:** EmailJS is case-sensitive, so use lowercase with underscores.

## Common Issues

### Template Not Sending

**Problem:** Variables don't match

**Solution:** 
- Check variable names are exactly: `from_name`, `from_email`, `subject`, `message`
- Make sure they're wrapped in double curly braces: `{{variable_name}}`

### HTML Not Rendering

**Problem:** Template editor might not support HTML

**Solution:**
- Use plain text version (Option 1)
- Or check if your email service supports HTML emails

### Email Goes to Wrong Address

**Problem:** Recipient not set correctly

**Solution:**
- Set "To Email" in Email Service settings, not template
- Make sure it's: `shawnmathtutor@gmail.com`

## Next Steps

After creating the template:
1. Copy the Template ID
2. Add it to your `.env` file as `VITE_EMAILJS_TEMPLATE_ID`
3. Restart your dev server
4. Test the contact form on your site

