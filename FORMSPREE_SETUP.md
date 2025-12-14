# Formspree Setup Guide

## Overview
All forms on nasneeraj.com have been updated to use Formspree instead of mailto: links. Formspree is a form backend service that sends form submissions directly to your email without requiring server-side code.

## Current Status
✅ Contact form updated to use Formspree  
✅ Demo request form updated to use Formspree  
✅ Signup form updated to use Formspree  
⏳ Waiting for Formspree form IDs to be configured

## How to Set Up Formspree

### Step 1: Create a Formspree Account

1. Go to https://formspree.io/
2. Click "Sign Up" (free account available)
3. Sign up with your email (use nas.neeraj@gmail.com)
4. Verify your email address

### Step 2: Create Forms

You'll need to create **3 separate forms** in Formspree:

#### Form 1: Contact Form
1. In Formspree dashboard, click "New Form"
2. Name it: "NAS Contact Form"
3. Set email to: `nas.neeraj@gmail.com`
4. Copy the Form ID (format: `xrgkqjvw` or similar)
5. Replace `YOUR_CONTACT_FORM_ID` in `contact.html` with this ID

#### Form 2: Demo Request Form
1. Click "New Form" again
2. Name it: "SISLMS Demo Request"
3. Set email to: `nas.neeraj@gmail.com`
4. Copy the Form ID
5. Replace `YOUR_DEMO_FORM_ID` in `demo.html` with this ID

#### Form 3: Signup Form
1. Click "New Form" again
2. Name it: "SISLMS Signup"
3. Set email to: `nas.neeraj@gmail.com`
4. Copy the Form ID
5. Replace `YOUR_SIGNUP_FORM_ID` in `signup.html` with this ID

### Step 3: Update Form IDs in HTML Files

#### Contact Form (`contact.html`)
Find this line:
```html
<form id="contactForm" action="https://formspree.io/f/YOUR_CONTACT_FORM_ID" method="POST">
```

Replace `YOUR_CONTACT_FORM_ID` with your actual Formspree form ID.

#### Demo Form (`demo.html`)
Find this line:
```html
<form id="demoForm" action="https://formspree.io/f/YOUR_DEMO_FORM_ID" method="POST">
```

Replace `YOUR_DEMO_FORM_ID` with your actual Formspree form ID.

#### Signup Form (`signup.html`)
Find this line:
```html
<form id="signupForm" action="https://formspree.io/f/YOUR_SIGNUP_FORM_ID" method="POST">
```

Replace `YOUR_SIGNUP_FORM_ID` with your actual Formspree form ID.

### Quick Replace Method

You can use find-and-replace in your code editor:

1. Open all three HTML files
2. Use "Find and Replace in Files"
3. Find: `YOUR_CONTACT_FORM_ID`
4. Replace with: `your-actual-contact-form-id`
5. Repeat for `YOUR_DEMO_FORM_ID` and `YOUR_SIGNUP_FORM_ID`

## Formspree Free Tier Limits

- **50 submissions per month** (per form)
- Email notifications
- Spam protection
- Custom redirects
- Form validation

If you need more submissions, Formspree offers paid plans starting at $10/month.

## Features Configured

Each form includes:

- **AJAX submission**: Forms submit without page reload
- **Success messages**: Users see confirmation after submission
- **Error handling**: Clear error messages if submission fails
- **Form validation**: HTML5 validation + Formspree validation
- **Spam protection**: Formspree's built-in spam filtering
- **Email formatting**: Custom subjects and reply-to addresses

## Email Format

Formspree will send emails with:
- **Subject**: Custom subject based on form type
- **Reply-To**: Set to the submitter's email address
- **Body**: All form fields formatted nicely

### Example Email from Contact Form:
```
Subject: [NAS Contact Form] Your Subject Here

From: submitter@example.com
Reply-To: submitter@example.com

Name: John Doe
Email: submitter@example.com
Subject: Your Subject Here

Message:
Your message here...
```

## Testing

After updating the form IDs:

1. **Deploy to production** (Vercel will auto-deploy on git push)
2. **Test each form**:
   - Fill out the contact form
   - Submit a demo request
   - Submit a signup request
3. **Check your email** (nas.neeraj@gmail.com) for submissions
4. **Verify Formspree dashboard** shows the submissions

## Troubleshooting

### Forms not submitting?
- Check that form IDs are correct
- Verify Formspree account is active
- Check browser console for errors
- Ensure form action URLs are correct

### Not receiving emails?
- Check spam/junk folder
- Verify email address in Formspree settings
- Check Formspree dashboard for submission logs
- Ensure you haven't exceeded free tier limits

### Success message not showing?
- Check browser console for JavaScript errors
- Verify form IDs are correct
- Test with browser developer tools

## Alternative: Custom Backend

If you prefer not to use Formspree, you can:
- Set up a custom backend endpoint
- Use Netlify Forms (if hosting on Netlify)
- Use Vercel serverless functions
- Use other form services (Typeform, JotForm, etc.)

## Support

- Formspree Documentation: https://help.formspree.io/
- Formspree Support: support@formspree.io
- Formspree Status: https://status.formspree.io/

---

**Last Updated:** January 2025  
**Status:** Ready for Formspree form ID configuration

