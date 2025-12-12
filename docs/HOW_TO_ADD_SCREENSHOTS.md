# How to Add SISLMS Screenshots to Brochure
## Step-by-Step Guide

---

## 📸 **STEP 1: Take Screenshots**

### **Recommended Screenshots:**
1. **Main Dashboard** - Shows overview and navigation
2. **Student Management** - Student list/profile view
3. **Gradebook/Assignments** - Academic management interface
4. **Reports Dashboard** - Analytics and reporting view
5. **Parent Portal** - Guardian view (optional)
6. **Mobile View** - Responsive design (optional)

### **How to Take Screenshots:**

#### **Windows:**
1. Open SISLMS in your browser
2. Navigate to the page you want to screenshot
3. Press **Windows + Shift + S** (Snipping Tool)
4. Select the area to capture
5. Save the screenshot

#### **Or Use Browser:**
1. Open SISLMS in Chrome/Edge
2. Press **F12** (Developer Tools)
3. Click device toolbar icon (mobile/tablet view)
4. Take screenshot using browser's screenshot feature
5. Or use extensions like "Full Page Screen Capture"

---

## 📁 **STEP 2: Save Screenshots**

### **Create Screenshots Folder:**
1. Create folder: `docs/screenshots/`
2. Save screenshots with descriptive names:
   - `dashboard.png`
   - `student-management.png`
   - `gradebook.png`
   - `reports.png`

### **Recommended Settings:**
- **Format:** PNG (best quality) or JPG (smaller file size)
- **Resolution:** 1920x1080 or higher
- **File Size:** Keep under 500KB per image (optimize if needed)

---

## 🔧 **STEP 3: Update HTML File**

### **Option 1: Replace Placeholder Divs**

Find this section in `NAS_BROCHURE.html`:

```html
<div class="screenshot-placeholder">
    📊 Dashboard View<br>
    <small>Add screenshot...</small>
</div>
```

Replace with:

```html
<img src="screenshots/dashboard.png" alt="SISLMS Dashboard" class="screenshot">
```

### **Option 2: Complete Example**

Replace the entire screenshot grid section:

```html
<div class="screenshot-grid">
    <div>
        <img src="screenshots/dashboard.png" alt="SISLMS Dashboard" class="screenshot">
        <p style="text-align: center; margin-top: 10px; color: #666; font-size: 0.9em;">Main Dashboard</p>
    </div>
    <div>
        <img src="screenshots/student-management.png" alt="Student Management" class="screenshot">
        <p style="text-align: center; margin-top: 10px; color: #666; font-size: 0.9em;">Student Management</p>
    </div>
    <div>
        <img src="screenshots/gradebook.png" alt="Gradebook" class="screenshot">
        <p style="text-align: center; margin-top: 10px; color: #666; font-size: 0.9em;">Academic Management</p>
    </div>
    <div>
        <img src="screenshots/reports.png" alt="Reports" class="screenshot">
        <p style="text-align: center; margin-top: 10px; color: #666; font-size: 0.9em;">Analytics Dashboard</p>
    </div>
</div>
```

---

## 🎨 **STEP 4: Optimize Images (Optional)**

### **Reduce File Size:**
- Use online tools like TinyPNG or Squoosh
- Or use image editing software
- Target: Under 300KB per image

### **Crop/Edit:**
- Remove sensitive data
- Highlight key features
- Ensure good quality

---

## ✅ **QUICK CHECKLIST**

- [ ] Take 4+ screenshots of SISLMS
- [ ] Create `docs/screenshots/` folder
- [ ] Save screenshots with descriptive names
- [ ] Update HTML file with image paths
- [ ] Test brochure in browser
- [ ] Verify images display correctly
- [ ] Optimize images if needed

---

## 📝 **EXAMPLE SCREENSHOT PATHS**

If screenshots are in `docs/screenshots/`:
```html
<img src="screenshots/dashboard.png" alt="Dashboard" class="screenshot">
```

If screenshots are in `docs/`:
```html
<img src="dashboard.png" alt="Dashboard" class="screenshot">
```

If screenshots are in project root:
```html
<img src="../screenshots/dashboard.png" alt="Dashboard" class="screenshot">
```

---

## 🚀 **AFTER ADDING SCREENSHOTS**

1. Open `NAS_BROCHURE.html` in browser
2. Verify all screenshots display correctly
3. Check image quality and sizing
4. Test on different screen sizes
5. Print to PDF to verify print quality

---

**Last Updated:** December 2025

