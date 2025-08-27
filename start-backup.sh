#!/bin/bash

echo "🚀 Starting Permasalahan Tanah Backup System..."
echo ""
echo "This will automatically backup your code every 5 minutes"
echo "Press Ctrl+C to stop the backup service"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Start the backup system
node backup.js
