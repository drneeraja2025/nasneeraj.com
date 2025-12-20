# Squarespace DNS Configuration for Vercel - Step by Step

## 🎯 Your Current Setup

You're using **Squarespace** as your domain registrar. I can see you have:
- 4 A records pointing to Squarespace IPs (in "Squarespace Defaults")
- 1 www CNAME pointing to Squarespace
- A "Custom records" section where you can add Vercel records

---

## ✅ Step-by-Step Instructions

### Step 1: Delete Existing Squarespace A Records

**Why?** Your domain currently points to Squarespace servers. We need to point it to Vercel instead.

1. In the **"Squarespace Defaults"** section, you'll see 4 A records:
   - `@` → `198.185.159.145`
   - `@` → `198.185.159.144`
   - `@` → `198.49.23.144`
   - `@` → `198.49.23.145`

2. **Delete each one:**
   - Click the **trash can icon** (🗑️) on the right side of each A record
   - Confirm deletion if prompted
   - Repeat for all 4 A records

**Note:** Don't delete the HTTPS record - that's fine to keep.

---

### Step 2: Update www CNAME Record

1. In **"Squarespace Defaults"** section, find the CNAME record:
   - `www` → `ext-sq.squarespace.com`

2. **Delete it:**
   - Click the **trash can icon** next to it

---

### Step 3: Add Vercel A Record

1. Scroll down to **"Custom records"** section
2. Click the **"ADD RECORD"** button
3. Fill in the form:

   **HOST:** `@`
   
   **TYPE:** Select `A` from the dropdown menu
   
   **PRIORITY:** `0` (or leave as default)
   
   **TTL:** Select `4 hrs` (or your preferred value)
   
   **DATA:** `76.76.21.21`

4. Click **"SAVE"** button

**What this does:** Points `nasneeraj.com` to Vercel's servers.

---

### Step 4: Add Vercel www CNAME Record

1. Still in **"Custom records"** section
2. Click **"ADD RECORD"** again
3. Fill in the form:

   **HOST:** `www`
   
   **TYPE:** Select `CNAME` from the dropdown menu
   
   **PRIORITY:** `0` (or leave as default)
   
   **TTL:** Select `4 hrs` (or your preferred value)
   
   **DATA:** `cname.vercel-dns.com`

4. Click **"SAVE"** button

**What this does:** Points `www.nasneeraj.com` to Vercel's servers.

---

## 📋 Summary of Changes

### Records to DELETE (from Squarespace Defaults):
- ❌ 4 A records: `@` → Squarespace IPs
- ❌ 1 CNAME: `www` → `ext-sq.squarespace.com`

### Records to ADD (in Custom records):
- ✅ 1 A record: `@` → `76.76.21.21`
- ✅ 1 CNAME: `www` → `cname.vercel-dns.com`

### Records to KEEP:
- ✅ HTTPS record (won't interfere)
- ✅ Email Security records (TXT records for email)
- ✅ Squarespace Domain Connect record

---

## ⏱️ After Saving

1. **Wait 15-60 minutes** for DNS propagation
2. **Check Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Status should change from ⏳ **Pending** to ✅ **Valid**
3. **Test your site:**
   - Visit `https://nasneeraj.com`
   - Should load your Vercel site!

---

## 🔍 Visual Guide

### Before (Current):
```
Squarespace Defaults:
@ → 198.185.159.145 (A) ❌ DELETE
@ → 198.185.159.144 (A) ❌ DELETE
@ → 198.49.23.144 (A)   ❌ DELETE
@ → 198.49.23.145 (A)   ❌ DELETE
www → ext-sq.squarespace.com (CNAME) ❌ DELETE
```

### After (What You'll Have):
```
Custom records:
@ → 76.76.21.21 (A) ✅ ADD THIS
www → cname.vercel-dns.com (CNAME) ✅ ADD THIS
```

---

## ⚠️ Important Notes

1. **Don't delete email records:** Keep the TXT records in "Email Security" section if you use email with this domain

2. **HTTPS record:** The HTTPS record in Squarespace Defaults is fine to keep - it won't interfere

3. **DNS Propagation:** Changes can take 15-60 minutes (sometimes up to 24 hours)

4. **Vercel will handle SSL:** Once DNS is configured, Vercel automatically provides HTTPS/SSL certificate

---

## 🐛 Troubleshooting

### Problem: "Site still shows Squarespace"
- **Solution:** Wait longer (up to 24 hours), or clear your browser cache

### Problem: "Can't delete Squarespace records"
- **Solution:** Some records might be locked. Try refreshing the page and try again

### Problem: "Vercel shows 'Invalid' status"
- **Solution:** 
  1. Double-check the A record DATA is exactly `76.76.21.21`
  2. Make sure HOST is `@` (not blank, not the domain name)
  3. Wait a bit longer for DNS propagation

### Problem: "www works but root domain doesn't"
- **Solution:** Make sure you added the A record for `@` (root domain), not just the CNAME for www

---

## ✅ Verification Checklist

After making changes, verify:

- [ ] Deleted all 4 Squarespace A records
- [ ] Deleted Squarespace www CNAME
- [ ] Added Vercel A record: `@` → `76.76.21.21`
- [ ] Added Vercel CNAME: `www` → `cname.vercel-dns.com`
- [ ] Clicked "SAVE" for both new records
- [ ] Waited 15-60 minutes
- [ ] Checked Vercel dashboard - status shows "Valid"
- [ ] Tested `https://nasneeraj.com` - loads correctly

---

## 🎉 You're Done!

Once Vercel shows "Valid" status, your site will be live at:
- `https://nasneeraj.com`
- `https://www.nasneeraj.com`

Both will work and automatically use HTTPS (SSL certificate provided by Vercel).





