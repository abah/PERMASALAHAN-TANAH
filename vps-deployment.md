# ☁️ Deploy ke VPS/Cloud Server

## 📋 Pilihan Hosting:

### 1. VPS Murah (DigitalOcean, Vultr, Linode)
```
💰 Biaya: $5-10/bulan
🌐 Bandwidth: Unlimited
💾 Storage: 25-50GB SSD
🖥️ RAM: 1-2GB
```

### 2. Cloud Hosting (AWS, Google Cloud, Azure)
```
💰 Biaya: Pay-as-you-use
🌐 Scalable: Ya
💾 Storage: Flexible
🖥️ Resources: On-demand
```

### 3. Shared Hosting (Hostinger, Namecheap)
```
💰 Biaya: $2-5/bulan
🌐 Bandwidth: Limited
💾 Storage: 10-50GB
🖥️ Shared resources
```

## 🚀 Langkah Deploy:

### 1. Setup Server
```bash
# Install Nginx/Apache
sudo apt update
sudo apt install nginx

# Setup domain (opsional)
sudo nano /etc/nginx/sites-available/trans-data
```

### 2. Upload Files
```bash
# Upload via SCP/SFTP
scp -r /Users/abahraditya/Downloads/PERMASALAHAN\ TANAH/* user@server:/var/www/html/

# Atau via Git
git clone https://github.com/username/permasalahan-tanah-dashboard.git
```

### 3. Configure Web Server
```nginx
# Nginx configuration
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

## 🔧 Database Options:

### 1. MySQL/PostgreSQL
```sql
-- Create database
CREATE DATABASE transmigrasi;
USE transmigrasi;

-- Create table
CREATE TABLE locations (
    id INT PRIMARY KEY,
    provinsi VARCHAR(100),
    kabupaten VARCHAR(200),
    pola VARCHAR(50),
    tahun_patan VARCHAR(50),
    jml_kk INT,
    beban_tugas_shm INT,
    total_kasus INT,
    -- ... other fields
);
```

### 2. SQLite (File-based)
```javascript
// SQLite database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./transmigrasi.db');
```

## 🌐 Keuntungan VPS:
- ✅ **Full control** atas server
- ✅ **Custom domain** (your-domain.com)
- ✅ **SSL certificate** (HTTPS)
- ✅ **Database** (MySQL/PostgreSQL)
- ✅ **Backup** otomatis
- ✅ **Scalable** sesuai kebutuhan

## 💰 Estimasi Biaya:
- **VPS Basic**: $5-10/bulan
- **Domain**: $10-15/tahun
- **SSL**: Gratis (Let's Encrypt)
- **Total**: $70-135/tahun
