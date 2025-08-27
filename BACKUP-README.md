# 🔄 Sistem Backup Otomatis - Permasalahan Tanah

Sistem ini akan secara otomatis menyimpan kodingan Anda setiap 5 menit untuk mencegah kehilangan data.

## 🚀 Cara Menggunakan

### 1. Jalankan Backup Otomatis
```bash
# Untuk macOS/Linux
./start-backup.sh

# Untuk Windows
start-backup.bat

# Atau langsung dengan Node.js
node backup.js
```

### 2. Perintah yang Tersedia

#### Buat Backup Manual
```bash
node backup.js backup
```

#### Lihat Semua Backup
```bash
node backup.js list
```

#### Restore dari Backup
```bash
node backup.js restore backup-2024-01-15T10-30-00-000Z
```

## 📁 Struktur Backup

```
backups/
├── backup-2024-01-15T10-30-00-000Z/
│   ├── analytics.js
│   ├── data.js
│   ├── analytics.html
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   ├── analytics.css
│   └── README.md
├── backup-2024-01-15T10-25-00-000Z/
│   └── ...
└── ...
```

## ⚙️ Konfigurasi

Edit file `backup-config.json` untuk mengubah pengaturan:

- **backupInterval**: Interval backup dalam milidetik (default: 5 menit)
- **maxBackups**: Jumlah maksimal backup yang disimpan (default: 50)
- **filesToBackup**: Daftar file yang akan di-backup
- **excludePatterns**: Pattern file yang tidak akan di-backup

## 🔧 Fitur

✅ **Backup Otomatis**: Setiap 5 menit  
✅ **Timestamp**: Setiap backup memiliki timestamp unik  
✅ **Auto-cleanup**: Hanya menyimpan 50 backup terbaru  
✅ **Restore**: Mudah mengembalikan file dari backup  
✅ **Cross-platform**: Bekerja di Windows, macOS, dan Linux  
✅ **Logging**: Informasi detail setiap backup  

## 📋 Persyaratan

- Node.js versi 14.0.0 atau lebih baru
- File project yang akan di-backup

## 🆘 Troubleshooting

### Node.js tidak terinstall
Download dan install dari: https://nodejs.org/

### Permission denied pada macOS/Linux
```bash
chmod +x start-backup.sh
```

### Backup tidak berjalan
1. Pastikan Node.js terinstall
2. Jalankan `node backup.js` untuk melihat error
3. Periksa apakah file yang akan di-backup ada

## 💡 Tips

1. **Jalankan saat coding**: Start backup system sebelum mulai coding
2. **Restore cepat**: Gunakan `node backup.js list` untuk melihat backup terbaru
3. **Backup manual**: Gunakan `node backup.js backup` untuk backup penting
4. **Monitoring**: Backup system akan menampilkan log setiap backup

## 🔒 Keamanan

- Backup disimpan lokal di folder `backups/`
- Tidak ada data yang dikirim ke server eksternal
- File asli tidak akan berubah atau terhapus

---

**Happy Coding! 🎉**  
Sistem backup akan menjaga kodingan Anda tetap aman!
