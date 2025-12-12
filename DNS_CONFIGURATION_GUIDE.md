# DNS Configuration Guide for nasneeraj.com

## 📋 What is DNS and Why Do You Need It?

**DNS (Domain Name System)** is like a phone book for the internet. When someone types `nasneeraj.com` in their browser, DNS tells the browser where to find your website (which server to connect to).

**Why configure DNS?**
- To connect your domain (`nasneeraj.com`) to Vercel's servers
- So visitors can access your site at `nasneeraj.com` instead of `nasneeraj.com-xxx.vercel.app`

---

## 🔍 Step 1: Find Your Domain Registrar

**Your domain registrar** is the company where you purchased/registered `nasneeraj.com`.

### How to Find Your Registrar:

1. **Check Your Email**
   - Look for emails from when you purchased the domain
   - Common registrars: GoDaddy, Namecheap, Google Domains, Cloudflare, etc.

2. **Use WHOIS Lookup**
   - Visit: [whois.net](https://www.whois.net) or [whois.com](https://www.whois.com)
   - Enter: `nasneeraj.com`
   - Look for "Registrar:" field

3. **Check Your Accounts**
   - Log into common registrars you might have accounts with
   - Check your domain management dashboard

### Common Domain Registrars:
- **GoDaddy** (godaddy.com)
- **Namecheap** (namecheap.com)
- **Google Domains** (domains.google.com)
- **Cloudflare** (cloudflare.com)
- **Name.com** (name.com)
- **Network Solutions** (networksolutions.com)
- **Bluehost** (bluehost.com)
- **HostGator** (hostgator.com)

---

## 🔐 Step 2: Log Into Your Registrar Account

1. Go to your registrar's website
2. Click **"Sign In"** or **"Login"**
3. Enter your username/email and password
4. If you forgot your password, use "Forgot Password" link

---

## 🎯 Step 3: Find DNS Management

Once logged in, look for one of these sections:

### Common Names for DNS Settings:
- **"DNS Management"**
- **"DNS Settings"**
- **"Domain Management"** → **"DNS"**
- **"Name Servers"**
- **"DNS Records"**
- **"Advanced DNS"**
- **"Zone Editor"** (cPanel)

### Where to Find It:
- Usually in **"My Domains"** or **"Domain List"**
- Click on your domain (`nasneeraj.com`)
- Look for **"DNS"**, **"DNS Management"**, or **"DNS Settings"** tab

---

## 📝 Step 4: Add DNS Records for Vercel

You need to add **ONE** of these options:

### Option A: A Record (Recommended for Root Domain)

**Add this record:**

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600 (or Auto/Default)
```

**What this means:**
- **Type: A** = Points to an IP address
- **Name: @** = Root domain (nasneeraj.com)
- **Value: 76.76.21.21** = Vercel's IP address
- **TTL:** Time to live (how long to cache, 3600 seconds = 1 hour)

### Option B: CNAME Record (If A Record Doesn't Work)

**Add this record:**

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600 (or Auto/Default)
```

**Note:** Some registrars don't support CNAME for root domain (@). If that's the case, use Option A.

---

## 🌐 Step 5: Add www Subdomain (Optional but Recommended)

**Add this record:**

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto/Default)
```

This makes `www.nasneeraj.com` work too.

---

## 📸 Step-by-Step for Common Registrars

### GoDaddy

1. Log in to [godaddy.com](https://godaddy.com)
2. Go to **"My Products"** → **"Domains"**
3. Click on **"nasneeraj.com"**
4. Scroll to **"DNS"** section
5. Click **"Add"** button
6. Select **"A"** from Type dropdown
7. Enter:
   - **Name:** `@`
   - **Value:** `76.76.21.21`
   - **TTL:** `600` (or default)
8. Click **"Save"**
9. For www: Add CNAME record:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Value:** `cname.vercel-dns.com`
   - Click **"Save"**

### Namecheap

1. Log in to [namecheap.com](https://namecheap.com)
2. Go to **"Domain List"**
3. Click **"Manage"** next to `nasneeraj.com`
4. Go to **"Advanced DNS"** tab
5. Click **"Add New Record"**
6. Select **"A Record"**
7. Enter:
   - **Host:** `@`
   - **Value:** `76.76.21.21`
   - **TTL:** `Automatic`
8. Click **"Save"** (green checkmark)
9. For www: Add CNAME:
   - **Type:** `CNAME Record`
   - **Host:** `www`
   - **Value:** `cname.vercel-dns.com`
   - Click **"Save"**

### Google Domains

1. Log in to [domains.google.com](https://domains.google.com)
2. Click on **"nasneeraj.com"**
3. Go to **"DNS"** tab
4. Scroll to **"Custom resource records"**
5. Click **"Add"**
6. Enter:
   - **Name:** `@`
   - **Type:** `A`
   - **Data:** `76.76.21.21`
   - **TTL:** `3600`
7. Click **"Add"**
8. For www: Add CNAME:
   - **Name:** `www`
   - **Type:** `CNAME`
   - **Data:** `cname.vercel-dns.com`
   - Click **"Add"**

### Cloudflare

1. Log in to [cloudflare.com](https://cloudflare.com)
2. Select your domain (`nasneeraj.com`)
3. Go to **"DNS"** → **"Records"**
4. Click **"Add record"**
5. Enter:
   - **Type:** `A`
   - **Name:** `@` (or leave blank for root)
   - **IPv4 address:** `76.76.21.21`
   - **Proxy status:** Gray cloud (DNS only) or Orange cloud (proxied)
   - **TTL:** `Auto`
6. Click **"Save"**
7. For www: Add CNAME:
   - **Type:** `CNAME`
   - **Name:** `www`
   - **Target:** `cname.vercel-dns.com`
   - Click **"Save"**

---

## ⏱️ Step 6: Wait for DNS Propagation

**What is DNS Propagation?**
- It takes time for DNS changes to spread across the internet
- Usually: **5 minutes to 24 hours**
- Most common: **15-60 minutes**

**How to Check:**
1. **Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Status will show: ⏳ **Pending** → ✅ **Valid**

2. **Online DNS Checkers:**
   - [dnschecker.org](https://dnschecker.org)
   - Enter: `nasneeraj.com`
   - Select: `A` record
   - Check if `76.76.21.21` appears globally

3. **Command Line (if you have access):**
   ```bash
   nslookup nasneeraj.com
   # or
   dig nasneeraj.com
   ```

---

## ✅ Step 7: Verify in Vercel

1. Go to **Vercel Dashboard**
2. Select your project
3. Go to **Settings** → **Domains**
4. Check status:
   - ⏳ **Pending** = Waiting for DNS
   - ✅ **Valid** = Domain is working!
   - ❌ **Invalid** = Check DNS settings

5. Once **Valid**, Vercel automatically:
   - Provisions SSL certificate
   - Enables HTTPS
   - Your site is live at `https://nasneeraj.com`

---

## 🔧 Troubleshooting

### Problem: "Domain not found" or "Invalid DNS"

**Solutions:**
1. **Double-check DNS records:**
   - Type should be `A` (not CNAME for root)
   - Name should be `@` (or blank, depending on registrar)
   - Value should be exactly `76.76.21.21`

2. **Wait longer:**
   - DNS can take up to 24 hours
   - Clear your browser cache
   - Try incognito/private browsing

3. **Check for conflicting records:**
   - Remove any old A records pointing to other IPs
   - Remove any conflicting CNAME records

### Problem: "www works but root domain doesn't"

**Solution:**
- Make sure you added the A record for `@` (root domain)
- Some registrars require both records

### Problem: "Can't add A record for @"

**Solution:**
- Some registrars use different notation:
  - Try leaving Name blank
  - Try using just the domain name
  - Check registrar's documentation

---

## 📋 Quick Reference

### DNS Records to Add:

**Root Domain (nasneeraj.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**www Subdomain (www.nasneeraj.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Vercel IP Address:
```
76.76.21.21
```

### Vercel CNAME:
```
cname.vercel-dns.com
```

---

## 🎯 Summary

1. **Find your registrar** (where you bought the domain)
2. **Log into your account**
3. **Go to DNS Management**
4. **Add A record:** `@` → `76.76.21.21`
5. **Add CNAME record (optional):** `www` → `cname.vercel-dns.com`
6. **Wait 15-60 minutes** for DNS propagation
7. **Check Vercel dashboard** - status should show "Valid"
8. **Your site is live!** 🎉

---

## 💡 Pro Tips

- **Save your DNS settings:** Take a screenshot before making changes
- **Use DNS checker:** Verify changes are propagating globally
- **Be patient:** DNS changes can take time
- **Keep records simple:** Only add what Vercel needs
- **Document changes:** Note what you changed for future reference

---

## 📞 Need Help?

If you're stuck:
1. Check your registrar's help documentation
2. Contact your registrar's support
3. Verify DNS records using [dnschecker.org](https://dnschecker.org)
4. Check Vercel's domain status in dashboard

