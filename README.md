# 🔄 Automatic Code Backup System

A powerful, cross-platform automatic backup system that saves your code files periodically to prevent data loss. Perfect for developers, designers, and anyone working with important files.

## 🌟 Features

- **🕐 Automatic Backup**: Saves files every 5 minutes (configurable)
- **📅 Timestamped**: Each backup has unique timestamp for easy identification
- **🧹 Smart Cleanup**: Automatically manages storage (keeps last 50 backups)
- **🔄 Easy Restore**: One-click restoration from any backup
- **💻 Cross-Platform**: Works on Windows, macOS, and Linux
- **📊 Detailed Logging**: Comprehensive backup logs and status
- **⚙️ Configurable**: Easy customization via JSON config file
- **🚀 Background Service**: Run as background service for continuous protection

## 🚀 Quick Start

### Prerequisites
- Node.js 14.0.0 or higher
- [Download Node.js](https://nodejs.org/)

### Installation
1. Clone or download this repository
2. Navigate to the project directory
3. Run the backup system

### Start Automatic Backup

#### macOS/Linux
```bash
# Make scripts executable
chmod +x *.sh

# Start backup service
./start-backup.sh

# Or run as background service
./run-backup-service.sh
```

#### Windows
```bash
# Start backup service
start-backup.bat

# Or run as background service
run-backup-service.bat
```

#### Direct Node.js
```bash
# Start auto-backup (every 5 minutes)
node backup.js

# Create manual backup
node backup.js backup

# List all backups
node backup.js list

# Restore from backup
node backup.js restore <backup-name>
```

## 📁 What Gets Backed Up

By default, the system backs up these file types:
- JavaScript files (`.js`)
- HTML files (`.html`)
- CSS files (`.css`)
- Data files (`.json`, `.xml`, `.csv`)
- Documentation (`.md`, `.txt`)
- Configuration files (`.config`, `.ini`)

**Customizable**: Edit `backup-config.json` to specify exact files

## ⚙️ Configuration

Edit `backup-config.json` to customize:

```json
{
  "backupInterval": 300000,        // 5 minutes in milliseconds
  "backupDirectory": "./backups",   // Where backups are stored
  "maxBackups": 50,                // Maximum backups to keep
  "filesToBackup": [               // Specific files to backup
    "*.js",
    "*.html",
    "*.css"
  ],
  "excludePatterns": [             // Files to exclude
    "*.tmp",
    "node_modules/*",
    "backups/*"
  ]
}
```

## 📊 Backup Structure

```
backups/
├── backup-2024-01-15T10-30-00-000Z/
│   ├── file1.js
│   ├── file2.html
│   └── file3.css
├── backup-2024-01-15T10-25-00-000Z/
│   └── ...
└── ...
```

## 🔧 Commands Reference

| Command | Description |
|---------|-------------|
| `node backup.js` | Start automatic backup service |
| `node backup.js backup` | Create manual backup |
| `node backup.js list` | Show all available backups |
| `node backup.js restore <name>` | Restore from specific backup |
| `node backup.js help` | Show help information |

## 🎯 Use Cases

### For Developers
- **Code Safety**: Never lose work due to crashes or accidents
- **Version History**: Track changes over time
- **Collaboration**: Share specific versions with team members
- **Deployment**: Rollback to working versions quickly

### For Designers
- **Design Files**: Backup PSD, AI, Sketch files
- **Project Versions**: Keep multiple design iterations
- **Client Work**: Safe storage of client deliverables

### For Students
- **Assignment Safety**: Protect important school work
- **Research Backup**: Save research papers and notes
- **Project History**: Track project development

## 🚀 Advanced Usage

### Background Service
Run as a background service for continuous protection:

```bash
# macOS/Linux
./run-backup-service.sh

# Windows
run-backup-service.bat
```

### Custom File Types
Add custom file extensions to backup:

```json
{
  "filesToBackup": [
    "*.js",
    "*.html", 
    "*.css",
    "*.psd",
    "*.ai",
    "*.sketch"
  ]
}
```

### Network Backup
Backup to network drives or cloud storage:

```json
{
  "backupDirectory": "/Volumes/NetworkDrive/backups"
}
```

## 🔒 Security & Privacy

- **Local Storage**: All backups stored locally by default
- **No Cloud Upload**: Your files never leave your computer
- **File Integrity**: Original files remain unchanged
- **Safe Operations**: No risk of data loss during backup

## 🆘 Troubleshooting

### Common Issues

#### Backup Not Starting
```bash
# Check Node.js installation
node --version

# Check file permissions
chmod +x *.sh  # macOS/Linux
```

#### Permission Errors
```bash
# macOS/Linux: Make scripts executable
chmod +x *.sh

# Windows: Run as Administrator
```

#### Storage Full
- System automatically keeps only last 50 backups
- Manually delete old backups from `backups/` folder
- Adjust `maxBackups` in config file

### Getting Help

1. Check the logs in `logs/backup.log`
2. Verify Node.js version compatibility
3. Check file permissions and paths
4. Review configuration file syntax

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Node.js and modern JavaScript
- Cross-platform compatibility focus
- Community-driven development

---

**🔄 Keep Your Code Safe!** 

*Never lose your work again with automatic, intelligent backup protection.*
