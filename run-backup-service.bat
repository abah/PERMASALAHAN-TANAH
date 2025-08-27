@echo off
echo Starting Permasalahan Tanah Backup Service in background...
echo Backup will run every 5 minutes automatically
echo.

REM Create logs directory if it doesn't exist
if not exist "logs" mkdir logs

REM Start backup service in background
start /B node backup.js > logs\backup.log 2>&1

echo Backup service started successfully!
echo Log file: logs\backup.log
echo.
echo To stop the service, close this window or use Task Manager
echo.
echo Service is now running in background! 
pause
