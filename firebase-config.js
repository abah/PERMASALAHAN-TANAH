// Firebase Configuration
// Config dari Firebase Console - Permasalahan Lahan Transmigran

const firebaseConfig = {
    apiKey: "AIzaSyAs3We72C9idQzq2fWkUcr1sNYpnBIy-t0",
    authDomain: "permasalahan-lahan-transmigran.firebaseapp.com",
    projectId: "permasalahan-lahan-transmigran",
    storageBucket: "permasalahan-lahan-transmigran.firebasestorage.app",
    messagingSenderId: "157460496986",
    appId: "1:157460496986:web:3daac0b0ef9053fb31ce63",
    measurementId: "G-55EH9WY8YJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Export untuk digunakan di file lain
window.db = db;
