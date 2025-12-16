# Quick Video Fix - Choose One Option

## Option 1: YouTube (Fastest - 5 minutes) ⭐ RECOMMENDED

1. **Upload to YouTube:**
   - Go to https://www.youtube.com/upload
   - Upload `assets/NAS-promo.mp4`
   - Set to "Unlisted" (not public, but embeddable)
   - Copy the Video ID from URL (e.g., `youtube.com/watch?v=ABC123xyz` → ID is `ABC123xyz`)

2. **Update index.html:**
   - Find line 869-878 in `index.html`
   - Replace `VIDEO_ID` with your actual YouTube video ID
   - Uncomment the iframe (remove `<!--` and `-->`)
   - Comment out or delete lines 882-885 (the `<video>` tag)

**Done!** Video will work immediately.

---

## Option 2: Vercel Blob Storage (10 minutes)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Upload video:**
   ```bash
   cd nasneeraj.com
   vercel blob put "assets/NAS-promo.mp4"
   ```
   This gives you a URL like: `https://[hash].public.blob.vercel-storage.com/NAS-promo-[hash].mp4`

3. **Update index.html line 883:**
   ```html
   <source src="YOUR_BLOB_URL_HERE" type="video/mp4">
   ```

---

## Option 3: Compress Video (15 minutes)

1. **Compress the video to < 100MB:**
   - Use HandBrake (free): https://handbrake.fr/
   - Or online: https://www.freeconvert.com/video-compressor
   - Target: < 100MB, maintain 1080p quality

2. **Remove from Git LFS:**
   ```bash
   git lfs untrack "*.mp4"
   git rm --cached "assets/NAS-promo.mp4"
   ```

3. **Add compressed video:**
   ```bash
   # Rename compressed video to NAS-promo.mp4
   git add assets/NAS-promo.mp4
   git commit -m "Add compressed video (under 100MB)"
   git push
   ```

---

## Current Status
- ✅ Navigation fix deployed (text under logo)
- ❌ Video not working (Vercel deployed LFS pointer, not actual file)
- ✅ Error handling in place
- ✅ YouTube embed code ready to use

**Recommendation:** Use Option 1 (YouTube) for fastest solution with zero cost.

