// Firebase Authentication untuk Production
class FirebaseAuth {
    constructor() {
        this.auth = firebase.auth();
        this.currentUser = null;
        this.userRole = null;
        this.listeners = [];
    }

    // Initialize authentication
    async init() {
        try {
            // Listen for auth state changes
            this.auth.onAuthStateChanged(async (user) => {
                if (user) {
                    this.currentUser = user;
                    await this.getUserRole();
                    this.notifyListeners('login', user);
                } else {
                    this.currentUser = null;
                    this.userRole = null;
                    this.notifyListeners('logout');
                }
            });

            console.log('✅ Firebase Auth initialized');
        } catch (error) {
            console.error('❌ Auth initialization failed:', error);
        }
    }

    // Get user role from Firestore
    async getUserRole() {
        try {
            if (!this.currentUser) return null;

            const userDoc = await window.db.collection('users').doc(this.currentUser.uid).get();
            if (userDoc.exists) {
                this.userRole = userDoc.data().role || 'user';
            } else {
                // Create user document if doesn't exist
                await window.db.collection('users').doc(this.currentUser.uid).set({
                    email: this.currentUser.email,
                    role: 'user',
                    created_at: firebase.firestore.FieldValue.serverTimestamp(),
                    last_login: firebase.firestore.FieldValue.serverTimestamp()
                });
                this.userRole = 'user';
            }

            return this.userRole;
        } catch (error) {
            console.error('Error getting user role:', error);
            return 'user';
        }
    }

    // Sign in with email/password
    async signIn(email, password) {
        try {
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            
            // Update last login
            if (result.user) {
                await window.db.collection('users').doc(result.user.uid).update({
                    last_login: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            return result;
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    }

    // Sign up with email/password - DISABLED FOR SECURITY
    async signUp(email, password, displayName = '') {
        throw new Error('User registration is disabled for security reasons. Please contact administrator.');
    }

    // Sign out
    async signOut() {
        try {
            await this.auth.signOut();
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    }

    // Check if user has permission
    hasPermission(permission) {
        if (!this.currentUser || !this.userRole) return false;

        switch (permission) {
            case 'read':
                return true; // All authenticated users can read
            case 'write':
                return ['admin', 'editor'].includes(this.userRole);
            case 'delete':
                return this.userRole === 'admin';
            case 'admin':
                return this.userRole === 'admin';
            default:
                return false;
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get user role
    getUserRole() {
        return this.userRole;
    }

    // Add auth state listener
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Remove auth state listener
    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    // Notify listeners
    notifyListeners(event, data = null) {
        this.listeners.forEach(callback => callback(event, data));
    }
}

// Create singleton instance
const firebaseAuth = new FirebaseAuth();
window.firebaseAuth = firebaseAuth;
