# Quick Start: Deploy Brochure to nasneeraj.com
## GitHub + Vercel - 15 Minute Guide

---

## ⚡ **FASTEST PATH (15 Minutes)**

### **1. Prepare Files (5 min)**

```bash
# Create folder
mkdir nas-brochure-deploy
cd nas-brochure-deploy

# Copy files (use File Explorer or PowerShell)
# - Copy docs/NAS_BROCHURE.html → index.html
# - Copy src/assets/NASlogonew.png → assets/NASlogonew.png
# - Copy docs/screenshots/ → screenshots/
```

**Folder Structure:**
```
nas-brochure-deploy/
├── index.html
├── assets/NASlogonew.png
└── screenshots/ (4 JPG files)
```

---

### **2. Create GitHub Repo (3 min)**

1. Go to https://github.com → New repository
2. Name: `nas-brochure`
3. Create (don't initialize)
4. Copy repository URL

---

### **3. Push to GitHub (2 min)**

```bash
git init
git add .
git commit -m "Initial commit: NAS brochure"
git remote add origin https://github.com/YOUR_USERNAME/nas-brochure.git
git branch -M main
git push -u origin main
```

---

### **4. Deploy to Vercel (3 min)**

1. Go to https://vercel.com
2. Add New Project → Import `nas-brochure`
3. Settings: Framework = "Other"
4. Deploy

---

### **5. Connect Domain (2 min)**

1. Vercel → Project → Settings → Domains
2. Add: `nasneeraj.com`
3. Update DNS at registrar:
   - A record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`

---

## ✅ **DONE!**

Site will be live at `https://nasneeraj.com` after DNS propagates (10-30 min)

---

**Need help?** See `DEPLOY_GITHUB_VERCEL_GUIDE.md` for detailed steps.

