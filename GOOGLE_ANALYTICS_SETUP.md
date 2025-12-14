# Google Analytics 4 Setup Guide

## Overview
Google Analytics 4 (GA4) tracking code has been added to all pages on the nasneeraj.com website. The tracking code is currently using a placeholder Measurement ID that needs to be replaced with your actual GA4 Measurement ID.

## Current Status
✅ GA4 tracking code structure added to all HTML pages  
⏳ Waiting for actual GA4 Measurement ID to be configured

## How to Get Your GA4 Measurement ID

1. **Create a Google Analytics Account** (if you don't have one):
   - Go to https://analytics.google.com/
   - Sign in with your Google account
   - Click "Start measuring"

2. **Create a Property**:
   - Enter property name: "nasneeraj.com"
   - Select time zone and currency
   - Click "Next"

3. **Configure Property Settings**:
   - Enter industry category: "Education"
   - Select business size
   - Choose how you intend to use Google Analytics

4. **Get Your Measurement ID**:
   - After creating the property, you'll see your Measurement ID
   - Format: `G-XXXXXXXXXX` (where X is alphanumeric)
   - Example: `G-ABC123XYZ9`

## How to Replace the Placeholder

The placeholder `G-XXXXXXXXXX` appears in two places in each HTML file:

1. **In the script src URL:**
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

2. **In the gtag config:**
   ```javascript
   gtag('config', 'G-XXXXXXXXXX', {
   ```

### Quick Replace Method

You can use find-and-replace in your code editor:

1. Open all HTML files in your editor
2. Use "Find and Replace in Files" feature
3. Find: `G-XXXXXXXXXX`
4. Replace with: `G-YOUR-ACTUAL-ID` (your real Measurement ID)
5. Replace all occurrences

### Files That Need Updating

All HTML files in the repository contain the GA4 code:
- index.html
- sislms.html
- services.html
- contact.html
- demo.html
- signup.html
- compare.html
- faq.html
- testimonials.html
- hotl-research.html
- security-compliance.html
- wsdpa.html
- terms.html
- privacy.html
- disclaimer.html
- video-script.html

## Verification

After replacing the Measurement ID:

1. **Deploy to production** (Vercel will auto-deploy on git push)
2. **Visit your website** and navigate through a few pages
3. **Check Google Analytics**:
   - Go to your GA4 property
   - Navigate to "Reports" > "Realtime"
   - You should see your visit appear within a few seconds

## Features Configured

The GA4 tracking code includes:

- **IP Anonymization**: Enabled for privacy compliance
- **Secure Cookies**: Configured with `SameSite=None;Secure` flags
- **Page View Tracking**: Automatic tracking on all pages
- **Event Tracking**: Ready for custom events (form submissions, button clicks, etc.)

## Next Steps (Optional)

Once GA4 is working, you can:

1. **Set up Goals/Conversions**:
   - Demo requests
   - Sign-ups
   - Contact form submissions

2. **Create Custom Events**:
   - Track button clicks
   - Monitor video engagement
   - Measure scroll depth

3. **Set up Enhanced Ecommerce** (if applicable):
   - Track pricing page views
   - Monitor conversion funnels

4. **Configure Audiences**:
   - Create remarketing audiences
   - Set up user segments

## Privacy Considerations

The GA4 code is configured with:
- IP anonymization enabled
- Secure cookie flags
- No personally identifiable information collected by default

For full GDPR/CCPA compliance, consider:
- Adding a cookie consent banner
- Updating your Privacy Policy to mention Google Analytics
- Providing opt-out mechanisms

## Support

If you need help:
- Google Analytics Help: https://support.google.com/analytics
- GA4 Documentation: https://developers.google.com/analytics/devguides/collection/ga4

---

**Last Updated:** January 2025  
**Status:** Ready for Measurement ID configuration

