# Step-by-Step: Deploy Brochure to nasneeraj.com
## GitHub + Vercel Deployment

---

## 🎯 **GOAL**

Deploy the NAS brochure to **http://nasneeraj.com** using GitHub and Vercel.

---

## 📦 **STEP 1: PREPARE FILES**

### **Option A: Use PowerShell Script (Easiest)**

```powershell
# Run from project root
cd docs
.\prepare-brochure-deploy.ps1
```

This will:
- ✅ Create `nas-brochure-deploy` folder
- ✅ Copy and rename HTML file
- ✅ Copy logo and screenshots
- ✅ Update file paths

### **Option B: Manual Preparation**

1. **Create folder:**
   ```
   nas-brochure-deploy/
   ├── index.html
   ├── assets/
   └── screenshots/
   ```

2. **Copy files:**
   - `docs/NAS_BROCHURE.html` → `nas-brochure-deploy/index.html`
   - `src/assets/NASlogonew.png` → `nas-brochure-deploy/assets/NASlogonew.png`
   - `docs/screenshots/*` → `nas-brochure-deploy/screenshots/`

3. **Verify logo path in index.html:**
   ```html
   <img src="assets/NASlogonew.png" alt="NAS Logo" class="logo">
   ```

---

## 🐙 **STEP 2: CREATE GITHUB REPOSITORY**

### **2.1 Create Repo on GitHub**

1. Go to: https://github.com/new
2. **Repository name:** `nas-brochure`
3. **Description:** "Neeraj's AI Software - Company Brochure"
4. **Visibility:** Public (or Private)
5. **DO NOT** check any initialization options
6. Click **"Create repository"**

### **2.2 Copy Repository URL**

After creating, GitHub will show you the URL. It looks like:
```
https://github.com/YOUR_USERNAME/nas-brochure.git
```

**Copy this URL** - you'll need it in the next step.

---

## 💻 **STEP 3: PUSH TO GITHUB**

### **3.1 Open Terminal in Deployment Folder**

Navigate to your `nas-brochure-deploy` folder:

```powershell
cd nas-brochure-deploy
```

### **3.2 Initialize Git**

```bash
git init
```

### **3.3 Add Files**

```bash
git add .
```

### **3.4 Create First Commit**

```bash
git commit -m "Initial commit: NAS brochure"
```

### **3.5 Connect to GitHub**

**Replace `YOUR_USERNAME` with your actual GitHub username:**

```bash
git remote add origin https://github.com/YOUR_USERNAME/nas-brochure.git
```

**Example:**
```bash
git remote add origin https://github.com/drneeraja2025/nas-brochure.git
```

### **3.6 Push to GitHub**

```bash
git branch -M main
git push -u origin main
```

**If prompted for credentials:**
- Use GitHub username and Personal Access Token (not password)
- Or use GitHub Desktop app instead

---

## 🚀 **STEP 4: DEPLOY TO VERCEL**

### **4.1 Sign In to Vercel**

1. Go to: https://vercel.com
2. Sign in (or create account - free)
3. If you have GitHub account, you can sign in with GitHub

### **4.2 Import Project**

1. Click **"Add New Project"** button
2. You should see your GitHub repositories
3. Find **"nas-brochure"** repository
4. Click **"Import"**

### **4.3 Configure Project**

**Project Settings:**
- **Framework Preset:** Select **"Other"**
- **Root Directory:** `./` (default - leave as is)
- **Build Command:** (leave empty)
- **Output Directory:** `./` (default - leave as is)
- **Install Command:** (leave empty)

**Advanced Settings:**
- You can leave all defaults for a simple static site

### **4.4 Deploy**

1. Click **"Deploy"** button
2. Wait 1-2 minutes
3. Vercel will show deployment progress
4. When done, you'll get a URL like: `nas-brochure-xyz.vercel.app`
5. **Click the URL to test** - your brochure should be live!

---

## 🌐 **STEP 5: CONNECT DOMAIN**

### **5.1 Add Domain in Vercel**

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** tab
3. Click **"Domains"** in left sidebar
4. In the input field, type: `nasneeraj.com`
5. Click **"Add"**
6. Vercel will show DNS configuration needed

### **5.2 Configure DNS**

Vercel will display the DNS records you need. You need to add these at your domain registrar.

**Required DNS Records:**

#### **For Root Domain (nasneeraj.com):**
```
Type: A
Name: @ (or leave blank, or "nasneeraj.com")
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

#### **For WWW (www.nasneeraj.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### **5.3 Update DNS at Domain Registrar**

**Where to update:**
- Log into your domain registrar (where you bought nasneeraj.com)
- Find "DNS Management" or "DNS Settings"
- Add the A record and CNAME record as shown above

**Common Registrars:**
- **GoDaddy:** My Products → DNS → Manage DNS
- **Namecheap:** Domain List → Manage → Advanced DNS
- **Google Domains:** DNS → Custom Records
- **Cloudflare:** DNS → Records

### **5.4 Wait for DNS Propagation**

- DNS changes can take **5 minutes to 48 hours**
- Usually takes **10-30 minutes**
- Vercel dashboard will show "Valid Configuration" when ready
- You can check status in Vercel → Settings → Domains

---

## ✅ **STEP 6: VERIFY**

### **6.1 Test the Site**

1. Visit: `https://nasneeraj.com` (once DNS propagates)
2. Check:
   - ✅ Logo appears
   - ✅ All screenshots display
   - ✅ Links work
   - ✅ Responsive on mobile

### **6.2 Common Checks**

- **Images loading?** Check browser console (F12) for errors
- **Domain working?** Wait for DNS propagation
- **HTTPS working?** Vercel provides free SSL automatically

---

## 🔄 **UPDATING THE SITE**

### **To Update Content:**

1. **Edit files locally:**
   ```bash
   cd nas-brochure-deploy
   # Edit index.html or other files
   ```

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update brochure"
   git push
   ```

3. **Vercel auto-deploys:**
   - Vercel detects GitHub push automatically
   - New deployment starts in ~30 seconds
   - Live in 1-2 minutes

---

## 📋 **QUICK REFERENCE**

### **GitHub Repository:**
```
https://github.com/YOUR_USERNAME/nas-brochure
```

### **Vercel Project:**
```
https://vercel.com/dashboard
```

### **Live Site:**
```
https://nasneeraj.com
```

---

## 🆘 **TROUBLESHOOTING**

### **Problem: Can't push to GitHub**

**Solution:**
- Use GitHub Desktop app instead
- Or create Personal Access Token for authentication

### **Problem: Domain not connecting**

**Solution:**
- Wait longer (DNS can take up to 48 hours)
- Double-check DNS records match Vercel's requirements
- Verify domain is added in Vercel dashboard

### **Problem: Images not showing**

**Solution:**
- Check file paths in HTML
- Verify all files are in GitHub repo
- Check browser console for 404 errors

---

## ✅ **SUCCESS!**

Once complete, your brochure will be live at:
- **https://nasneeraj.com**
- **https://www.nasneeraj.com** (both work)

---

**Need help?** See `DEPLOY_GITHUB_VERCEL_GUIDE.md` for more details.

