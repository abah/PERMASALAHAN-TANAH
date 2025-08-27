# 🌱 Permasalahan Tanah - Land Problem Analysis System

A comprehensive web-based application for analyzing and visualizing land-related problems and issues. This project includes an advanced analytics dashboard and an automatic backup system to ensure data safety.

## 🚀 Features

### 📊 Analytics Dashboard
- **Interactive Charts**: Visualize land problem data with modern charts
- **Data Filtering**: Advanced filtering and search capabilities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Dynamic data updates and real-time monitoring

### 🔄 Automatic Backup System
- **Auto-backup**: Automatic code backup every 5 minutes
- **Version Control**: Timestamped backups with easy restoration
- **Smart Cleanup**: Automatically manages backup storage (keeps last 50)
- **Cross-platform**: Works on Windows, macOS, and Linux

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js for data visualization
- **Backup System**: Node.js with file system operations
- **Styling**: Modern CSS with responsive design principles

## 📁 Project Structure

```
PERMASALAHAN TANAH/
├── 📊 analytics.html          # Main analytics dashboard
├── 🎨 analytics.css           # Dashboard styling
├── ⚡ analytics.js            # Dashboard functionality
├── 🏠 index.html              # Landing page
├── 🎯 script.js               # Main application logic
├── 💅 styles.css              # Global styling
├── 📊 data.js                 # Data storage and management
├── 🔄 backup.js               # Automatic backup system
├── ⚙️ backup-config.json      # Backup configuration
├── 🚀 start-backup.sh         # Backup startup script (macOS/Linux)
├── 🚀 start-backup.bat        # Backup startup script (Windows)
├── 🔧 run-backup-service.sh   # Background service script
├── 🔧 run-backup-service.bat  # Background service script (Windows)
├── 📦 package.json            # Project configuration
└── 📚 README files            # Documentation
```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd PERMASALAHAN-TANAH
```

### 2. Start the Application
Simply open `index.html` in your web browser to view the landing page, or open `analytics.html` for the analytics dashboard.

### 3. Setup Automatic Backup System
```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Start automatic backup (every 5 minutes)
./start-backup.sh          # macOS/Linux
start-backup.bat           # Windows

# Or run as background service
./run-backup-service.sh    # macOS/Linux
run-backup-service.bat     # Windows
```

## 🔧 Backup System Commands

```bash
# Create manual backup
node backup.js backup

# List all backups
node backup.js list

# Restore from backup
node backup.js restore <backup-name>

# Start auto-backup service
node backup.js
```

## 📊 Dashboard Features

- **Land Problem Analysis**: Comprehensive analysis of land-related issues
- **Interactive Maps**: Visual representation of problem locations
- **Statistical Reports**: Detailed statistical analysis and reporting
- **Export Functionality**: Export data in various formats
- **User Management**: Role-based access control

## 🎨 Design Features

- **Modern UI/UX**: Clean, professional interface design
- **Responsive Layout**: Optimized for all device sizes
- **Light Blue Theme**: Professional color scheme
- **Accessibility**: WCAG compliant design principles

## 🔒 Security Features

- **Local Backup Storage**: All backups stored locally
- **No External Dependencies**: Self-contained backup system
- **File Integrity**: Maintains original file structure
- **Safe Operations**: No risk of data loss during backup

## 📱 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🚀 Deployment

### Local Development
1. Clone the repository
2. Open `index.html` or `analytics.html` in your browser
3. Start the backup system if needed

### Web Server Deployment
1. Upload all files to your web server
2. Ensure proper file permissions
3. Configure backup system on server (if needed)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [BACKUP-README.md](BACKUP-README.md) for backup system help
2. Review the code comments for implementation details
3. Open an issue on GitHub for bugs or feature requests

## 🎯 Roadmap

- [ ] Enhanced data visualization
- [ ] Mobile app version
- [ ] Cloud backup integration
- [ ] Advanced analytics features
- [ ] Multi-language support

---

**🌱 Permasalahan Tanah** - Making land problem analysis simple and efficient!

*Built with ❤️ and modern web technologies*
