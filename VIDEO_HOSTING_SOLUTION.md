# Video Hosting Solution for NAS Promo Video

## Problem
The promotional video (637.87 MB) is too large for Git LFS on Vercel. Vercel deployed the LFS pointer file (134 B) instead of the actual video content.

## Recommended Solutions

### Option 1: YouTube (Recommended - Free & Reliable)
1. Upload video to YouTube (can be unlisted/private)
2. Get the video ID
3. Use YouTube embed in HTML

**Pros:**
- Free hosting
- Automatic optimization
- CDN delivery
- Analytics available
- Mobile-friendly

**Implementation:**
Replace the `<video>` tag with YouTube iframe embed.

### Option 2: Vimeo (Recommended - Professional)
1. Upload to Vimeo
2. Get embed code
3. Use Vimeo embed

**Pros:**
- Professional appearance
- No ads
- Good quality
- Privacy controls

### Option 3: Cloudflare R2 / AWS S3 + CloudFront
1. Upload video to cloud storage
2. Use CDN URL
3. Update video source

**Pros:**
- Full control
- Fast delivery
- Custom domain

**Cons:**
- May incur costs for large files
- Requires setup

### Option 4: Compress Video
1. Compress video to < 100MB
2. Commit directly to Git (no LFS)
3. Update source path

**Pros:**
- Simple
- No external dependencies

**Cons:**
- Quality loss
- Still large for Git

## Current Status
The video file is in Git LFS but Vercel is not fetching it properly. The build script attempts to fetch LFS files, but Vercel's environment may not support this.

## Immediate Action
For the fastest solution, upload to YouTube and embed it.

