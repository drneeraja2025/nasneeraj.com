# Vercel Blob Storage Setup for Video

## Quick Solution: Use Vercel Blob Storage

Vercel Blob is designed for large files like videos. Here's how to set it up:

### Step 1: Install Vercel Blob CLI
```bash
npm install -g vercel
```

### Step 2: Upload Video to Vercel Blob
```bash
# Navigate to your project
cd nasneeraj.com

# Upload the video
vercel blob put assets/NAS-promo.mp4
```

This will give you a URL like: `https://[hash].public.blob.vercel-storage.com/NAS-promo.mp4`

### Step 3: Update index.html
Replace the video source with the Blob URL.

### Alternative: Use Vercel Dashboard
1. Go to your Vercel project dashboard
2. Navigate to Storage → Blob
3. Upload the video file
4. Copy the public URL
5. Update index.html with the new URL

## Cost
- Free tier: 1 GB storage, 1 GB bandwidth/month
- Your video: ~637 MB (fits in free tier)
- Additional bandwidth: $0.15/GB after free tier

## Benefits
- Fast CDN delivery
- No external dependencies
- Integrated with Vercel
- Automatic optimization

