# How to Add/Change Domain on Vercel

## 🎯 Step-by-Step Guide

### Step 1: Go to Your Project

1. **Log in to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your account

2. **Select Your Project**
   - Click on **"nasneeraj-com"** (or your project name)
   - Or go to your dashboard and find the project

---

### Step 2: Navigate to Domain Settings

1. **Click on "Settings" tab**
   - Located at the top of your project page
   - Next to "Deployments", "Analytics", etc.

2. **Click on "Domains" in the left sidebar**
   - Under the "General" section
   - You'll see a list of domains (if any)

---

### Step 3: Add Your Domain

1. **Click "Add Domain" button**
   - Usually a button at the top right of the Domains section
   - Or a "+" icon

2. **Enter your domain**
   - Type: `nasneeraj.com`
   - Click **"Add"** or **"Continue"**

---

### Step 4: Configure Domain

**Option A: Root Domain Only**
- Enter: `nasneeraj.com`
- Click "Add"

**Option B: Both Root and www (Recommended)**
1. First, add: `nasneeraj.com`
2. Then, add: `www.nasneeraj.com`
3. Vercel will automatically redirect one to the other

---

### Step 5: Verify DNS Configuration

After adding the domain, Vercel will:

1. **Check your DNS records**
   - It looks for the A record: `@` → `76.76.21.21`
   - Or CNAME: `@` → `cname.vercel-dns.com`

2. **Show status:**
   - ⏳ **Pending** = Waiting for DNS to propagate
   - ✅ **Valid** = Domain is configured correctly!
   - ❌ **Invalid** = DNS not configured correctly

---

### Step 6: Wait for Verification

1. **DNS Propagation**
   - Usually takes **15-60 minutes**
   - Can take up to **24 hours** in rare cases

2. **Check Status**
   - Refresh the Vercel page
   - Status should change from "Pending" to "Valid"

3. **SSL Certificate**
   - Vercel automatically provisions SSL
   - Your site will be available at `https://nasneeraj.com`

---

## 📋 Visual Guide

### Vercel Dashboard Navigation:
```
Vercel Dashboard
├── Projects
│   └── nasneeraj-com
│       ├── Deployments
│       ├── Analytics
│       ├── Settings  ← Click here
│       │   ├── General
│       │   │   ├── Domains  ← Click here
│       │   │   ├── Environment Variables
│       │   │   └── ...
│       │   └── ...
```

### Domains Page:
```
┌─────────────────────────────────────┐
│ Domains                             │
│                                     │
│ [Add Domain] button                 │
│                                     │
│ Domain List:                         │
│ ┌─────────────────────────────────┐ │
│ │ nasneeraj.com                   │ │
│ │ Status: ✅ Valid                │ │
│ │ https://nasneeraj.com           │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 🔄 Changing/Updating Domain

### To Change an Existing Domain:

1. **Remove old domain:**
   - Go to Settings → Domains
   - Find the domain you want to remove
   - Click the **three dots** (⋯) or **trash icon**
   - Click **"Remove"** or **"Delete"**

2. **Add new domain:**
   - Click **"Add Domain"**
   - Enter new domain
   - Configure DNS at your registrar

### To Update DNS:

If you need to update DNS records:
1. Go to your domain registrar (Squarespace)
2. Update DNS records as needed
3. Vercel will automatically detect changes
4. Status will update in Vercel dashboard

---

## ✅ Verification Checklist

After adding domain:

- [ ] Domain added in Vercel (Settings → Domains)
- [ ] DNS configured at registrar (Squarespace)
- [ ] Status shows "Pending" or "Valid"
- [ ] Waited 15-60 minutes for propagation
- [ ] Status changed to "Valid"
- [ ] Site accessible at `https://nasneeraj.com`
- [ ] SSL certificate active (HTTPS works)

---

## 🐛 Troubleshooting

### Problem: "Invalid" Status

**Check:**
1. DNS records are correct:
   - A record: `@` → `76.76.21.21`
   - Or CNAME: `@` → `cname.vercel-dns.com`

2. DNS has propagated:
   - Use [dnschecker.org](https://dnschecker.org)
   - Check if `76.76.21.21` appears globally

3. Wait longer:
   - DNS can take up to 24 hours

### Problem: "Pending" for a long time

**Solutions:**
- Wait up to 24 hours
- Verify DNS records at registrar
- Clear browser cache
- Check DNS propagation status

### Problem: "Domain already in use"

**Solution:**
- Domain might be connected to another Vercel project
- Remove it from the other project first
- Or contact Vercel support

---

## 📝 Quick Reference

### Vercel Domain Settings Location:
```
Project → Settings → Domains
```

### DNS Records Needed:
```
A Record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

### Expected Timeline:
- Add domain: Instant
- DNS verification: 15-60 minutes
- SSL provisioning: Automatic (after DNS verified)
- Site live: Immediately after verification

---

## 🎉 After Domain is Added

Once status shows **"Valid"**:

1. **Your site is live at:**
   - `https://nasneeraj.com`
   - `https://www.nasneeraj.com` (if added)

2. **SSL is automatic:**
   - HTTPS enabled automatically
   - Certificate renewed automatically

3. **Future deployments:**
   - All new deployments automatically use your custom domain
   - No need to reconfigure

---

## 💡 Pro Tips

1. **Add both root and www:**
   - Better for SEO
   - Users can access with or without www

2. **Monitor domain status:**
   - Check Vercel dashboard regularly
   - Set up monitoring if needed

3. **Keep DNS records:**
   - Don't delete DNS records after adding domain
   - They need to stay for domain to work

4. **Multiple domains:**
   - You can add multiple domains to one project
   - All will point to the same deployment





