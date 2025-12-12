# How to Deploy Brochure to nasneeraj.com
## Step-by-Step Deployment Guide

**Domain:** http://nasneeraj.com/  
**Status:** Currently under construction  
**Brochure File:** `docs/NAS_BROCHURE.html`

---

## 📋 **DEPLOYMENT OPTIONS**

### **Option 1: Simple Static Hosting (Recommended)**
### **Option 2: GitHub Pages (Free)**
### **Option 3: Vercel (Free, Fast)**
### **Option 4: Traditional Web Hosting (cPanel/FTP)**

---

## 🚀 **OPTION 1: VERCEL (Recommended - Free & Fast)**

### **Why Vercel?**
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy deployment
- ✅ Works with your existing Vercel account

### **Steps:**

#### **1. Prepare Files**
```bash
# Create a simple project structure
mkdir nasneeraj-brochure
cd nasneeraj-brochure
```

#### **2. Copy Files**
- Copy `NAS_BROCHURE.html` → Rename to `index.html`
- Copy `screenshots/` folder
- Copy `src/assets/NASlogonew.png` → Create `assets/` folder

#### **3. Deploy to Vercel**

**Method A: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Method B: Vercel Dashboard**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import from GitHub (or drag & drop folder)
4. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** (leave empty)
   - **Output Directory:** ./
5. Click "Deploy"

#### **4. Connect Domain**
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add `nasneeraj.com` and `www.nasneeraj.com`
3. Follow DNS configuration instructions:
   - Add A record: `@` → Vercel IP
   - Add CNAME: `www` → cname.vercel-dns.com

**Vercel DNS Settings:**
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel's IP - check Vercel dashboard for current)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## 🌐 **OPTION 2: GITHUB PAGES (Free)**

### **Steps:**

#### **1. Create Repository**
```bash
# Create new repo on GitHub
# Name: nasneeraj-brochure (or any name)
```

#### **2. Prepare Files**
```bash
# Clone repo
git clone https://github.com/yourusername/nasneeraj-brochure.git
cd nasneeraj-brochure

# Copy files
# - NAS_BROCHURE.html → index.html
# - screenshots/ folder
# - assets/ folder (with logo)
```

#### **3. Push to GitHub**
```bash
git add .
git commit -m "Add NAS brochure"
git push origin main
```

#### **4. Enable GitHub Pages**
1. Go to GitHub repo → Settings → Pages
2. Source: Deploy from branch
3. Branch: `main` / `root`
4. Click "Save"

#### **5. Connect Domain**
1. Create `CNAME` file in repo root:
   ```
   nasneeraj.com
   ```
2. In your domain registrar (where you bought nasneeraj.com):
   - Add CNAME: `www` → `yourusername.github.io`
   - Add A records:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```

---

## 📤 **OPTION 3: TRADITIONAL WEB HOSTING (cPanel/FTP)**

### **If you have web hosting (cPanel, etc.):**

#### **1. Prepare Files**
- Rename `NAS_BROCHURE.html` → `index.html`
- Organize files:
  ```
  public_html/
  ├── index.html
  ├── screenshots/
  │   ├── brochurelogin.jpg
  │   ├── Screenshot 2025-12-12 150729.jpg
  │   ├── Screenshot 2025-12-12 150810.jpg
  │   └── Screenshot 2025-12-12 150841.jpg
  └── assets/
      └── NASlogonew.png
  ```

#### **2. Upload via FTP**
- Use FileZilla or similar FTP client
- Connect to your hosting
- Upload files to `public_html/` or `www/` folder

#### **3. Update File Paths**
- Update image paths in HTML if needed
- Test all images load correctly

---

## 🔧 **OPTION 4: NETLIFY (Free Alternative)**

### **Steps:**

#### **1. Sign Up**
- Go to https://netlify.com
- Sign up (free)

#### **2. Deploy**
- Drag & drop folder with `index.html`
- Or connect GitHub repo

#### **3. Connect Domain**
- Go to Site Settings → Domain Management
- Add custom domain: `nasneeraj.com`
- Follow DNS instructions

---

## 📝 **PREPARATION CHECKLIST**

Before deploying, make sure:

- [ ] Rename `NAS_BROCHURE.html` to `index.html`
- [ ] Update image paths in HTML:
  - Logo: `assets/NASlogonew.png` (or correct path)
  - Screenshots: `screenshots/filename.jpg`
- [ ] Copy `screenshots/` folder
- [ ] Copy logo to `assets/` folder
- [ ] Test all images load locally
- [ ] Test links work
- [ ] Check responsive design

---

## 🔗 **UPDATE HTML PATHS**

### **Current Paths in HTML:**
```html
<!-- Logo -->
<img src="../src/assets/NASlogonew.png" alt="NAS Logo" class="logo">

<!-- Screenshots -->
<img src="screenshots/brochurelogin.jpg" alt="..." class="screenshot">
```

### **For Deployment, Update to:**
```html
<!-- Logo -->
<img src="assets/NASlogonew.png" alt="NAS Logo" class="logo">

<!-- Screenshots (already correct) -->
<img src="screenshots/brochurelogin.jpg" alt="..." class="screenshot">
```

---

## 📁 **RECOMMENDED FOLDER STRUCTURE**

```
nasneeraj-brochure/
├── index.html (renamed from NAS_BROCHURE.html)
├── assets/
│   └── NASlogonew.png
├── screenshots/
│   ├── brochurelogin.jpg
│   ├── Screenshot 2025-12-12 150729.jpg
│   ├── Screenshot 2025-12-12 150810.jpg
│   └── Screenshot 2025-12-12 150841.jpg
└── README.md (optional)
```

---

## ✅ **QUICK DEPLOYMENT (Vercel - 5 Minutes)**

### **Fastest Method:**

1. **Create folder structure:**
   ```bash
   mkdir nas-brochure
   cd nas-brochure
   ```

2. **Copy files:**
   - Copy `NAS_BROCHURE.html` → Rename to `index.html`
   - Copy `screenshots/` folder
   - Copy logo to `assets/NASlogonew.png`

3. **Update logo path in index.html:**
   ```html
   <!-- Change from: -->
   <img src="../src/assets/NASlogonew.png" ...>
   
   <!-- To: -->
   <img src="assets/NASlogonew.png" ...>
   ```

4. **Deploy:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

5. **Connect domain:**
   - Vercel Dashboard → Project → Settings → Domains
   - Add `nasneeraj.com`
   - Update DNS at your domain registrar

---

## 🌍 **DNS CONFIGURATION**

### **At Your Domain Registrar (where you bought nasneeraj.com):**

**For Vercel:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For GitHub Pages:**
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: yourusername.github.io
```

---

## ⚠️ **IMPORTANT NOTES**

1. **HTTPS:** Most hosting (Vercel, Netlify, GitHub Pages) provides free SSL/HTTPS
2. **File Names:** Keep screenshot file names exactly as they are (with spaces)
3. **Testing:** Test locally before deploying
4. **Backup:** Keep original files backed up

---

## 🎯 **RECOMMENDED: VERCEL**

**Why Vercel is best:**
- ✅ You're already using Vercel for SISLMS
- ✅ Free tier is generous
- ✅ Automatic HTTPS
- ✅ Global CDN (fast worldwide)
- ✅ Easy domain connection
- ✅ No server management

**Estimated Time:** 10-15 minutes

---

## 📞 **NEXT STEPS**

1. ✅ Choose hosting option (Vercel recommended)
2. ⏳ Prepare files (rename, organize)
3. ⏳ Update image paths in HTML
4. ⏳ Deploy to hosting
5. ⏳ Connect domain
6. ⏳ Test website
7. ⏳ Update DNS if needed

---

**Last Updated:** December 2025

