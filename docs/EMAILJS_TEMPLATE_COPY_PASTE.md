# EmailJS Template - Copy & Paste Ready

## Simple Template (Recommended)

Copy and paste this directly into the EmailJS template editor:

### Subject Line:
```
ACT Math Review - {{subject}}
```

### Message Content (Plain Text):
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

---

## That's It!

Just copy the content above and paste it into:
- **Subject field**: `ACT Math Review - {{subject}}`
- **Content field**: The message content shown above

## Important Notes

1. **Set Recipient Email in Service Settings:**
   - Go to **Email Services** → Your service
   - Set **"To Email"** to: `shawnmathtutor@gmail.com`
   - Don't put it in the template

2. **Variable Names Must Match:**
   - `{{from_name}}`
   - `{{from_email}}`
   - `{{subject}}`
   - `{{message}}`
   
   These must match exactly (case-sensitive, with underscores)

3. **No HTML Needed:**
   - Plain text works perfectly
   - EmailJS will format it nicely
   - Avoid HTML unless you're comfortable with it

## After Creating Template

1. Save the template
2. Copy the **Template ID** (looks like `template_abc123`)
3. Add to your `.env` file:
   ```
   VITE_EMAILJS_TEMPLATE_ID=template_abc123
   ```
4. Restart dev server
5. Test!

