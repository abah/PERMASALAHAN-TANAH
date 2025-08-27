# 🔥 Integrasi Firebase untuk Database Online

## 📋 Setup Firebase:

### 1. Buat Project Firebase
```
1. Buka https://console.firebase.google.com/
2. Create Project: "trans-data-dashboard"
3. Enable Firestore Database
4. Enable Authentication (opsional)
```

### 2. Install Firebase SDK
```html
<!-- Tambahkan ke semua HTML files -->
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-firestore.js"></script>
```

### 3. Konfigurasi Firebase
```javascript
// firebase-config.js
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "trans-data-dashboard.firebaseapp.com",
  projectId: "trans-data-dashboard",
  storageBucket: "trans-data-dashboard.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
```

## 🔄 Update Data Functions:

### Load Data dari Firebase:
```javascript
async function loadDataFromFirebase() {
  try {
    const snapshot = await db.collection('transmigrasi').get();
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data;
  } catch (error) {
    console.error('Error loading data:', error);
    return [];
  }
}
```

### Save Data ke Firebase:
```javascript
async function saveDataToFirebase(data) {
  try {
    // Clear existing data
    const snapshot = await db.collection('transmigrasi').get();
    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    
    // Add new data
    const addBatch = db.batch();
    data.forEach(item => {
      const docRef = db.collection('transmigrasi').doc(item.id.toString());
      addBatch.set(docRef, item);
    });
    await addBatch.commit();
    
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}
```

## 🌐 Keuntungan Firebase:
- ✅ **Real-time sync** antar perangkat
- ✅ **Database online** yang aman
- ✅ **Authentication** untuk keamanan
- ✅ **Backup otomatis**
- ✅ **Scalable** untuk data besar
- ✅ **Gratis** untuk penggunaan dasar

## 💰 Biaya Firebase:
- **Free Tier**: 1GB storage, 50,000 reads/day, 20,000 writes/day
- **Paid**: $0.18/GB storage, $0.06/100,000 reads, $0.18/100,000 writes
