#!/bin/bash

# Script untuk menjalankan backup service di background
# Gunakan ini jika ingin backup berjalan terus tanpa terminal terbuka

echo "🚀 Starting Permasalahan Tanah Backup Service in background..."
echo "Backup will run every 5 minutes automatically"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Start backup service in background
nohup node backup.js > logs/backup.log 2>&1 &

# Get the process ID
BACKUP_PID=$!

echo "✅ Backup service started successfully!"
echo "Process ID: $BACKUP_PID"
echo "Log file: logs/backup.log"
echo ""
echo "To stop the service, run:"
echo "  kill $BACKUP_PID"
echo ""
echo "To check if it's running:"
echo "  ps aux | grep backup.js"
echo ""
echo "To view logs:"
echo "  tail -f logs/backup.log"
echo ""
echo "Service is now running in background! 🎉"
