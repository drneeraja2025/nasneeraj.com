# Vercel Deployment Guide for nasneeraj.com

## 🚀 Quick Deployment Steps

### Step 1: Connect Repository to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click **"Add New Project"**
   - Select **"Import Git Repository"**
   - Find and select: `drneeraja2025/nasneeraj.com`
   - Click **"Import"**

### Step 2: Configure Project Settings

**Framework Preset:** Other (Static Site)

**Build Settings:**
- **Build Command:** Leave empty (static site, no build needed)
- **Output Directory:** `.` (root directory)
- **Install Command:** Leave empty

**Root Directory:** Leave as default (`.`)

### Step 3: Deploy

1. Click **"Deploy"**
2. Vercel will automatically:
   - Clone your repository
   - Deploy the static files
   - Provide a deployment URL (e.g., `nasneeraj.com-xxx.vercel.app`)

### Step 4: Add Custom Domain

1. **Go to Project Settings**
   - Click on your project
   - Go to **Settings** → **Domains**

2. **Add Domain**
   - Click **"Add Domain"**
   - Enter: `nasneeraj.com`
   - Click **"Add"**

3. **Configure DNS**
   - Vercel will show DNS records to add
   - Add these to your domain registrar:

   **For Root Domain:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For www subdomain (optional):**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Wait for DNS Propagation**
   - Usually takes a few minutes to 24 hours
   - Vercel will show status: ⏳ Pending → ✅ Valid

5. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - Your site will be available at `https://nasneeraj.com`

---

## 📁 Project Structure

```
nasneeraj.com/
├── index.html          ← Main landing page
├── vercel.json         ← Vercel configuration
├── assets/
│   └── NASlogonew.png
└── screenshots/
    └── (4 images)
```

---

## ⚙️ Vercel Configuration (vercel.json)

The `vercel.json` file includes:
- **Rewrites:** Ensures all routes serve `index.html`
- **Headers:** Security headers (XSS protection, frame options)
- **Caching:** Long-term caching for assets and images

---

## 🔄 Automatic Deployments

Once connected:
- **Every push to `master` branch** → Automatic production deployment
- **Pull requests** → Automatic preview deployments
- **Manual deployments** → Available from Vercel dashboard

---

## 🌐 Custom Domain Setup

### DNS Records Required

**Option 1: A Record (Root Domain)**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**Option 2: CNAME (if your registrar supports it)**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### Domain Verification

1. Add domain in Vercel
2. Add DNS records at your registrar
3. Wait for verification (usually 5-60 minutes)
4. Vercel will automatically provision SSL certificate

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Site loads at Vercel URL (e.g., `nasneeraj.com-xxx.vercel.app`)
- [ ] Custom domain added in Vercel
- [ ] DNS records configured at registrar
- [ ] Domain status shows "Valid" in Vercel
- [ ] SSL certificate active (HTTPS works)
- [ ] All images load correctly
- [ ] Logo displays properly
- [ ] All links work
- [ ] Mobile responsive design works

---

## 🔧 Troubleshooting

### Images Not Loading
- Check file paths in `index.html` (should be relative: `assets/...`, `screenshots/...`)
- Verify files are committed to GitHub
- Clear browser cache

### Domain Not Working
- Verify DNS records are correct
- Check DNS propagation: [dnschecker.org](https://dnschecker.org)
- Wait up to 24 hours for full propagation
- Verify domain in Vercel shows "Valid" status

### 404 Errors
- Ensure `index.html` is in root directory
- Check `vercel.json` rewrites configuration
- Verify all file paths are correct

---

## 📊 Vercel Features

**Included with Vercel:**
- ✅ Global CDN
- ✅ Automatic HTTPS/SSL
- ✅ Custom domains
- ✅ Automatic deployments
- ✅ Preview deployments for PRs
- ✅ Analytics (with Pro plan)
- ✅ Edge network optimization

---

## 🎯 Next Steps

1. **Deploy to Vercel** (follow steps above)
2. **Add custom domain** (`nasneeraj.com`)
3. **Configure DNS** at your registrar
4. **Test the site** thoroughly
5. **Share the URL!** 🎉

---

## 📝 Notes

- The site is a static HTML page, so no build process is needed
- All assets (images, CSS) are served directly
- Vercel will cache assets globally via CDN
- Updates are automatic when you push to GitHub

---

## 🔗 Useful Links

- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **GitHub Repository:** [github.com/drneeraja2025/nasneeraj.com](https://github.com/drneeraja2025/nasneeraj.com)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)



