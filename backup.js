const fs = require('fs');
const path = require('path');

// Configuration
const BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const BACKUP_DIR = './backups';
const FILES_TO_BACKUP = [
    'analytics.js',
    'data.js', 
    'analytics.html',
    'index.html',
    'script.js',
    'styles.css',
    'analytics.css',
    'README.md'
];

// Create backup directory if it doesn't exist
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
}

function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
    
    // Create backup subdirectory
    if (!fs.existsSync(backupPath)) {
        fs.mkdirSync(backupPath);
    }
    
    console.log(`Creating backup: ${backupPath}`);
    
    let backupCount = 0;
    
    // Copy each file to backup directory
    FILES_TO_BACKUP.forEach(filename => {
        const sourcePath = path.join('.', filename);
        const destPath = path.join(backupPath, filename);
        
        if (fs.existsSync(sourcePath)) {
            try {
                fs.copyFileSync(sourcePath, destPath);
                backupCount++;
                console.log(`  ✓ Backed up: ${filename}`);
            } catch (error) {
                console.error(`  ✗ Error backing up ${filename}:`, error.message);
            }
        } else {
            console.log(`  - File not found: ${filename}`);
        }
    });
    
    console.log(`Backup completed: ${backupCount} files saved\n`);
    
    // Clean up old backups (keep last 50)
    cleanupOldBackups();
}

function cleanupOldBackups() {
    try {
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(dir => dir.startsWith('backup-'))
            .map(dir => ({
                name: dir,
                path: path.join(BACKUP_DIR, dir),
                time: fs.statSync(path.join(BACKUP_DIR, dir)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time);
        
        // Keep only the last 50 backups
        if (backups.length > 50) {
            const toDelete = backups.slice(50);
            toDelete.forEach(backup => {
                fs.rmSync(backup.path, { recursive: true, force: true });
                console.log(`Cleaned up old backup: ${backup.name}`);
            });
        }
    } catch (error) {
        console.error('Error cleaning up old backups:', error.message);
    }
}

function listBackups() {
    try {
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(dir => dir.startsWith('backup-'))
            .map(dir => {
                const backupPath = path.join(BACKUP_DIR, dir);
                const stats = fs.statSync(backupPath);
                return {
                    name: dir,
                    date: stats.mtime.toLocaleString(),
                    size: getDirectorySize(backupPath)
                };
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('\n=== Available Backups ===');
        backups.forEach((backup, index) => {
            console.log(`${index + 1}. ${backup.name}`);
            console.log(`   Date: ${backup.date}`);
            console.log(`   Size: ${backup.size}`);
            console.log('');
        });
    } catch (error) {
        console.error('Error listing backups:', error.message);
    }
}

function getDirectorySize(dirPath) {
    let totalSize = 0;
    try {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                totalSize += stats.size;
            }
        });
        return formatBytes(totalSize);
    } catch (error) {
        return 'Unknown';
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function restoreBackup(backupName) {
    const backupPath = path.join(BACKUP_DIR, backupName);
    
    if (!fs.existsSync(backupPath)) {
        console.error(`Backup ${backupName} not found!`);
        return;
    }
    
    console.log(`Restoring from backup: ${backupName}`);
    
    let restoreCount = 0;
    
    FILES_TO_BACKUP.forEach(filename => {
        const sourcePath = path.join(backupPath, filename);
        const destPath = path.join('.', filename);
        
        if (fs.existsSync(sourcePath)) {
            try {
                fs.copyFileSync(sourcePath, destPath);
                restoreCount++;
                console.log(`  ✓ Restored: ${filename}`);
            } catch (error) {
                console.error(`  ✗ Error restoring ${filename}:`, error.message);
            }
        } else {
            console.log(`  - File not found in backup: ${filename}`);
        }
    });
    
    console.log(`Restore completed: ${restoreCount} files restored\n`);
}

// Start automatic backup process
console.log('🚀 Auto-backup system started!');
console.log(`Backing up every ${BACKUP_INTERVAL / 60000} minutes`);
console.log(`Backup directory: ${BACKUP_DIR}`);
console.log('Press Ctrl+C to stop\n');

// Create initial backup
createBackup();

// Set up periodic backup
const backupInterval = setInterval(createBackup, BACKUP_INTERVAL);

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping auto-backup system...');
    clearInterval(backupInterval);
    console.log('Final backup created...');
    createBackup();
    console.log('Goodbye! 👋');
    process.exit(0);
});

// Handle command line arguments
if (process.argv.length > 2) {
    const command = process.argv[2];
    
    switch (command) {
        case 'list':
            listBackups();
            process.exit(0);
            break;
        case 'restore':
            if (process.argv[3]) {
                restoreBackup(process.argv[3]);
                process.exit(0);
            } else {
                console.error('Please specify backup name to restore');
                console.log('Usage: node backup.js restore <backup-name>');
                process.exit(1);
            }
            break;
        case 'backup':
            createBackup();
            process.exit(0);
            break;
        default:
            console.log('Available commands:');
            console.log('  node backup.js list     - List all backups');
            console.log('  node backup.js restore <name> - Restore from backup');
            console.log('  node backup.js backup   - Create manual backup');
            console.log('  node backup.js          - Start auto-backup service');
            process.exit(0);
    }
}
