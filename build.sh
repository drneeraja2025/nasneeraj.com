#!/bin/bash
# Build script to fetch Git LFS files for Vercel deployment

# Install Git LFS if not available
if ! command -v git-lfs &> /dev/null; then
    echo "Installing Git LFS..."
    # Try to install git-lfs (this may not work on all Vercel environments)
    curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
    apt-get install -y git-lfs || echo "Could not install git-lfs via apt"
fi

# Initialize Git LFS
git lfs install

# Fetch LFS files
echo "Fetching Git LFS files..."
git lfs pull

echo "Build complete!"



