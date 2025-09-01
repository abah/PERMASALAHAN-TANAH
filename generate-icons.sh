#!/bin/bash

# Script untuk generate favicon dan ikon dari logo.png
# Membutuhkan ImageMagick (brew install imagemagick)

echo "🚀 Generating favicons and icons from logo.png..."

# Buat folder icons jika belum ada
mkdir -p icons

# Source logo
SOURCE="image/logo.png"

if [ ! -f "$SOURCE" ]; then
    echo "❌ Error: logo.png tidak ditemukan di folder image/"
    exit 1
fi

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick tidak terinstall."
    echo "💡 Install dengan: brew install imagemagick"
    exit 1
fi

echo "📱 Generating web favicons..."

# Web Favicons
convert "$SOURCE" -resize 16x16 icons/favicon-16x16.png
convert "$SOURCE" -resize 32x32 icons/favicon-32x32.png
convert "$SOURCE" -resize 48x48 icons/favicon-48x48.png
convert "$SOURCE" -resize 64x64 icons/favicon-64x64.png

# Generate favicon.ico (multi-size)
convert "$SOURCE" -resize 16x16 icons/favicon-16.png
convert "$SOURCE" -resize 32x32 icons/favicon-32.png
convert "$SOURCE" -resize 48x48 icons/favicon-48.png
convert icons/favicon-16.png icons/favicon-32.png icons/favicon-48.png icons/favicon.ico
rm icons/favicon-16.png icons/favicon-32.png icons/favicon-48.png

echo "🍎 Generating Apple icons..."

# Apple Touch Icons (iOS/macOS)
convert "$SOURCE" -resize 57x57 icons/apple-touch-icon-57x57.png
convert "$SOURCE" -resize 60x60 icons/apple-touch-icon-60x60.png
convert "$SOURCE" -resize 72x72 icons/apple-touch-icon-72x72.png
convert "$SOURCE" -resize 76x76 icons/apple-touch-icon-76x76.png
convert "$SOURCE" -resize 114x114 icons/apple-touch-icon-114x114.png
convert "$SOURCE" -resize 120x120 icons/apple-touch-icon-120x120.png
convert "$SOURCE" -resize 144x144 icons/apple-touch-icon-144x144.png
convert "$SOURCE" -resize 152x152 icons/apple-touch-icon-152x152.png
convert "$SOURCE" -resize 167x167 icons/apple-touch-icon-167x167.png
convert "$SOURCE" -resize 180x180 icons/apple-touch-icon-180x180.png

# Standard apple-touch-icon (180x180 adalah yang paling umum)
cp icons/apple-touch-icon-180x180.png icons/apple-touch-icon.png

echo "🤖 Generating Android icons..."

# Android Chrome Icons
convert "$SOURCE" -resize 36x36 icons/android-chrome-36x36.png
convert "$SOURCE" -resize 48x48 icons/android-chrome-48x48.png
convert "$SOURCE" -resize 72x72 icons/android-chrome-72x72.png
convert "$SOURCE" -resize 96x96 icons/android-chrome-96x96.png
convert "$SOURCE" -resize 144x144 icons/android-chrome-144x144.png
convert "$SOURCE" -resize 192x192 icons/android-chrome-192x192.png
convert "$SOURCE" -resize 256x256 icons/android-chrome-256x256.png
convert "$SOURCE" -resize 384x384 icons/android-chrome-384x384.png
convert "$SOURCE" -resize 512x512 icons/android-chrome-512x512.png

echo "🌐 Generating PWA icons..."

# PWA Manifest Icons
convert "$SOURCE" -resize 128x128 icons/icon-128x128.png
convert "$SOURCE" -resize 192x192 icons/icon-192x192.png
convert "$SOURCE" -resize 256x256 icons/icon-256x256.png
convert "$SOURCE" -resize 512x512 icons/icon-512x512.png

echo "🖥️ Generating Windows icons..."

# Microsoft Windows/IE
convert "$SOURCE" -resize 70x70 icons/mstile-70x70.png
convert "$SOURCE" -resize 144x144 icons/mstile-144x144.png
convert "$SOURCE" -resize 150x150 icons/mstile-150x150.png
convert "$SOURCE" -resize 310x150 icons/mstile-310x150.png
convert "$SOURCE" -resize 310x310 icons/mstile-310x310.png

echo "📄 Generating Safari icons..."

# Safari Pinned Tab (SVG would be better, but PNG works)
convert "$SOURCE" -resize 16x16 icons/safari-pinned-tab.png

echo "✅ Icon generation complete!"
echo ""
echo "📁 Generated files in icons/ folder:"
ls -la icons/
echo ""
echo "📋 Next steps:"
echo "1. Copy icons/favicon.ico to root folder"
echo "2. Copy other icons to icons/ folder in your web project"
echo "3. Add HTML meta tags (see generated-html-tags.txt)"
