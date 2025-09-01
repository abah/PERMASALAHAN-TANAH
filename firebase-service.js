// Firebase Service Class
class FirebaseService {
    constructor() {
        this.db = window.db || firebase.firestore();
        this.data = [];
        this.listeners = [];
        this.unsubscribe = null;
    }

    // Load semua data
    async loadAllData() {
        try {
            console.log('Loading data from Firebase...');
            
            // Check authentication for production
            if (window.firebaseAuth && !window.firebaseAuth.getCurrentUser()) {
                throw new Error('Authentication required. Please sign in first.');
            }
            
            const snapshot = await this.db.collection('transmigrasi')
                .orderBy('provinsi')
                .orderBy('kabupaten')
                .get();
            
            this.data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log(`Loaded ${this.data.length} records from Firebase`);
            this.notifyListeners();
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    // Load data by ID
    async loadDataById(id) {
        try {
            const doc = await this.db.collection('transmigrasi').doc(id).get();
            if (doc.exists) {
                return { id: doc.id, ...doc.data() };
            }
            return null;
        } catch (error) {
            console.error('Error loading data by ID:', error);
            throw error;
        }
    }

    // Add data baru
    async addData(data) {
        try {
            // Check write permission for production
            if (window.firebaseAuth && !window.firebaseAuth.hasPermission('write')) {
                throw new Error('Write permission denied. Admin or editor role required.');
            }
            
            const docRef = await this.db.collection('transmigrasi').add({
                ...data,
                created_by: window.firebaseAuth?.getCurrentUser()?.uid || 'unknown',
                created_at: firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Create audit log
            await this.createAuditLog('CREATE', 'transmigrasi', docRef.id, null, data);
            
            console.log('Data added successfully:', docRef.id);
            await this.loadAllData(); // Reload data
            return docRef.id;
        } catch (error) {
            console.error('Error adding data:', error);
            throw error;
        }
    }

    // Update data
    async updateData(id, data) {
        try {
            // Check write permission for production
            if (window.firebaseAuth && !window.firebaseAuth.hasPermission('write')) {
                throw new Error('Write permission denied. Admin or editor role required.');
            }
            
            // Get old data for audit log
            const oldDoc = await this.db.collection('transmigrasi').doc(id).get();
            const oldData = oldDoc.exists ? oldDoc.data() : null;
            
            await this.db.collection('transmigrasi').doc(id).update({
                ...data,
                updated_by: window.firebaseAuth?.getCurrentUser()?.uid || 'unknown',
                updated_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Create audit log
            await this.createAuditLog('UPDATE', 'transmigrasi', id, oldData, data);
            
            console.log('Data updated successfully:', id);
            await this.loadAllData(); // Reload data
            return true;
        } catch (error) {
            console.error('Error updating data:', error);
            throw error;
        }
    }

    // Delete data
    async deleteData(id) {
        try {
            // Check delete permission for production
            if (window.firebaseAuth && !window.firebaseAuth.hasPermission('delete')) {
                throw new Error('Delete permission denied. Admin role required.');
            }
            
            // Get data for audit log
            const doc = await this.db.collection('transmigrasi').doc(id).get();
            const data = doc.exists ? doc.data() : null;
            
            await this.db.collection('transmigrasi').doc(id).delete();
            
            // Create audit log
            await this.createAuditLog('DELETE', 'transmigrasi', id, data, null);
            
            console.log('Data deleted successfully:', id);
            await this.loadAllData(); // Reload data
            return true;
        } catch (error) {
            console.error('Error deleting data:', error);
            throw error;
        }
    }

    // Search data
    async searchData(query, filters = {}) {
        try {
            let queryRef = this.db.collection('transmigrasi');
            
            // Apply filters
            if (filters.provinsi) {
                queryRef = queryRef.where('provinsi', '==', filters.provinsi);
            }
            
            if (filters.status !== undefined) {
                queryRef = queryRef.where('hpl_status', '==', filters.status === 'true');
            }
            
            const snapshot = await queryRef.get();
            let results = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Apply text search
            if (query) {
                const searchTerm = query.toLowerCase();
                results = results.filter(item => 
                    item.provinsi.toLowerCase().includes(searchTerm) ||
                    item.kabupaten.toLowerCase().includes(searchTerm) ||
                    (item.deskripsi_permasalahan && item.deskripsi_permasalahan.toLowerCase().includes(searchTerm))
                );
            }
            
            return results;
        } catch (error) {
            console.error('Error searching data:', error);
            throw error;
        }
    }

    // Real-time listener
    startRealTimeListener() {
        console.log('Starting real-time listener...');
        this.unsubscribe = this.db.collection('transmigrasi')
            .onSnapshot((snapshot) => {
                this.data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log('Real-time update received:', this.data.length, 'records');
                this.notifyListeners();
            }, (error) => {
                console.error('Real-time listener error:', error);
            });
    }

    stopRealTimeListener() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
            console.log('Real-time listener stopped');
        }
    }

    // Event listeners
    addListener(callback) {
        this.listeners.push(callback);
    }

    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.data));
    }

    // Get current data
    getCurrentData() {
        return this.data;
    }

    // Create audit log
    async createAuditLog(action, tableName, recordId, oldValues, newValues) {
        try {
            if (!window.firebaseAuth?.getCurrentUser()) return;

            await this.db.collection('audit_log').add({
                user_id: window.firebaseAuth.getCurrentUser().uid,
                user_email: window.firebaseAuth.getCurrentUser().email,
                action: action,
                table_name: tableName,
                record_id: recordId,
                old_values: oldValues,
                new_values: newValues,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error creating audit log:', error);
        }
    }
}

// Create singleton instance
const firebaseService = new FirebaseService();
window.firebaseService = firebaseService;
