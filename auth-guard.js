// 🔒 Auth Guard - Melindungi halaman dari akses tanpa login
console.log('Auth Guard loaded');

class AuthGuard {
    constructor() {
        this.protectedPages = [
            'index.html',
            'analytics.html', 
            'search.html',
            'data.html',
            'admin-users.html'
        ];
        this.loginPage = 'login.html';
        this.init();
    }

    async init() {
        try {
            console.log('🔒 Auth Guard: Starting authentication check...');
            
            // Add small delay to ensure Firebase is ready
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Check if user is authenticated
            const isAuthenticated = await this.checkAuthStatus();
            console.log('🔒 Auth Guard: Authentication status:', isAuthenticated);
            
            if (!isAuthenticated) {
                console.log('🔒 Auth Guard: User not authenticated, redirecting to login');
                this.redirectToLogin();
                return;
            }

            // Check user permissions
            const hasAccess = await this.checkUserPermissions();
            console.log('🔒 Auth Guard: Permission check result:', hasAccess);
            
            if (!hasAccess) {
                console.log('🔒 Auth Guard: Access denied, showing access denied page');
                this.showAccessDenied();
                return;
            }

            // User is authenticated and has access
            console.log('🔒 Auth Guard: User authenticated and has access, setting up UI');
            this.setupAuthUI();
            this.startSessionTimer();
            
        } catch (error) {
            console.error('🔒 Auth Guard Error:', error);
            this.redirectToLogin();
        }
    }

    async checkAuthStatus() {
        try {
            // Check if firebaseAuth is available
            if (typeof firebaseAuth === 'undefined') {
                console.error('Firebase Auth not available');
                return false;
            }

            const user = firebaseAuth.getCurrentUser();
            if (!user) {
                console.log('No authenticated user found');
                return false;
            }

            // Check if user token is still valid
            try {
                const token = await user.getIdToken(true);
                if (!token) {
                    console.log('Invalid or expired token');
                    return false;
                }
            } catch (tokenError) {
                console.log('Token error, but user exists:', tokenError.message);
                // Continue with user check even if token fails
            }

            console.log('User authenticated:', user.email);
            return true;

        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }

    async checkUserPermissions() {
        try {
            const userRole = firebaseAuth.getUserRole();
            
            // Define role-based access
            const pagePermissions = {
                'index.html': ['admin', 'editor', 'viewer'],
                'analytics.html': ['admin', 'editor', 'viewer'],
                'search.html': ['admin', 'editor', 'viewer'],
                'data.html': ['admin', 'editor'],
                'admin-users.html': ['admin']
            };

            const currentPage = this.getCurrentPage();
            const allowedRoles = pagePermissions[currentPage] || ['admin'];

            if (allowedRoles.includes(userRole)) {
                console.log('User has access to this page');
                return true;
            } else {
                console.log('Access denied: User role', userRole, 'cannot access', currentPage);
                return false;
            }

        } catch (error) {
            console.error('Permission check failed:', error);
            return false;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename || 'index.html';
    }

    redirectToLogin() {
        console.log('Redirecting to login page');
        const currentPage = this.getCurrentPage();
        
        // Store intended destination
        sessionStorage.setItem('intendedPage', currentPage);
        
        // Prevent infinite redirect loop
        if (window.location.pathname.includes(this.loginPage)) {
            console.log('Already on login page, preventing redirect loop');
            return; // Already on login page
        }
        
        // Check if we're already redirecting
        if (sessionStorage.getItem('redirecting') === 'true') {
            console.log('Already redirecting, preventing loop');
            return;
        }
        
        // Set redirect flag
        sessionStorage.setItem('redirecting', 'true');
        
        // Redirect to login
        window.location.href = this.loginPage;
    }

    showAccessDenied() {
        // Replace page content with access denied message
        document.body.innerHTML = `
            <div style="
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: #f3f4f6;
                font-family: Arial, sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    text-align: center;
                    max-width: 500px;
                ">
                    <h1 style="color: #ef4444; margin-bottom: 20px;">🚫 Access Denied</h1>
                    <p style="color: #6b7280; margin-bottom: 20px;">
                        Maaf, Anda tidak memiliki akses ke halaman ini.
                    </p>
                    <p style="color: #6b7280; margin-bottom: 30px;">
                        Silakan hubungi administrator untuk mendapatkan akses yang sesuai.
                    </p>
                    <button onclick="window.location.href='index.html'" style="
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                    ">
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        `;
    }

    setupAuthUI() {
        // Clear redirect flag since user is authenticated
        sessionStorage.removeItem('redirecting');
        
        // Add logout button to navigation if not exists
        this.addLogoutButton();
        
        // Add user info to navigation
        this.addUserInfo();
        
        // Setup auto-logout on inactivity
        this.setupInactivityLogout();
        
        // Setup click outside to close dropdown
        this.setupClickOutside();
    }

    setupClickOutside() {
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.querySelector('.user-profile-dropdown');
            const userProfile = document.querySelector('.user-profile');
            
            if (dropdown && userProfile && !userProfile.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    addLogoutButton() {
        // Check if logout button already exists
        if (document.querySelector('.logout-btn')) {
            return;
        }

        // Find navigation container
        const navContainer = document.querySelector('.nav-menu') || 
                           document.querySelector('.sidebar') ||
                           document.querySelector('nav') ||
                           document.querySelector('.sidebar-nav');

        if (navContainer) {
            const logoutBtn = document.createElement('div');
            logoutBtn.className = 'nav-item logout-btn';
            logoutBtn.style.cssText = `
                cursor: pointer;
                padding: 12px 20px;
                color: #ef4444;
                border-radius: 8px;
                margin: 5px 0;
                transition: background-color 0.2s;
            `;
            logoutBtn.innerHTML = `
                <i class="fas fa-sign-out-alt"></i>
                <span>🚪 Logout</span>
            `;
            
            // Add hover effect
            logoutBtn.addEventListener('mouseenter', () => {
                logoutBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            });
            
            logoutBtn.addEventListener('mouseleave', () => {
                logoutBtn.style.backgroundColor = 'transparent';
            });
            
            logoutBtn.onclick = () => {
                console.log('🔒 Logout button clicked');
                this.logout();
            };
            
            navContainer.appendChild(logoutBtn);
            console.log('✅ Logout button added to navigation');
        } else {
            console.warn('⚠️ Navigation container not found, adding logout button to body');
            this.addLogoutButtonToBody();
        }
    }

    addLogoutButtonToBody() {
        // Add logout button as floating button if navigation not found
        const logoutBtn = document.createElement('div');
        logoutBtn.className = 'logout-btn-floating';
        logoutBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: bold;
        `;
        
        logoutBtn.innerHTML = '🚪 Logout';
        logoutBtn.onclick = () => {
            console.log('🔒 Floating logout button clicked');
            this.logout();
        };
        
        document.body.appendChild(logoutBtn);
        console.log('✅ Floating logout button added');
    }

    addUserInfo() {
        // Add user profile dropdown to header if not exists
        if (document.querySelector('.user-profile-dropdown')) {
            return;
        }

        const userProfile = document.querySelector('.user-profile') || 
                           document.querySelector('.header-right .user-profile');

        if (userProfile) {
            // Make user profile clickable
            userProfile.style.cursor = 'pointer';
            userProfile.style.position = 'relative';
            
            // Add click event to show dropdown
            userProfile.onclick = (e) => {
                e.stopPropagation();
                this.toggleUserDropdown();
            };
            
            // Create dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'user-profile-dropdown';
            dropdown.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                min-width: 200px;
                z-index: 1000;
                display: none;
                margin-top: 5px;
            `;
            
            const user = firebaseAuth.getCurrentUser();
            const role = firebaseAuth.getUserRole();
            
            dropdown.innerHTML = `
                <div style="padding: 15px; border-bottom: 1px solid #e5e7eb;">
                    <div style="font-weight: bold; color: #374151; margin-bottom: 5px;">
                        ${user?.displayName || user?.email || 'User'}
                    </div>
                    <div style="font-size: 14px; color: #6b7280;">
                        ${user?.email || 'No email'}
                    </div>
                    <div style="font-size: 12px; color: #9ca3af; margin-top: 5px;">
                        Role: ${role || 'user'}
                    </div>
                </div>
                <div style="padding: 8px 0;">
                    <div class="profile-menu-item" onclick="window.currentAuthGuard.logout()" style="
                        padding: 10px 15px;
                        cursor: pointer;
                        color: #ef4444;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        transition: background-color 0.2s;
                    ">
                        <i class="fas fa-sign-out-alt"></i>
                        🚪 Logout
                    </div>
                </div>
            `;
            
            // Add hover effects
            const logoutItem = dropdown.querySelector('.profile-menu-item');
            logoutItem.addEventListener('mouseenter', () => {
                logoutItem.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            });
            
            logoutItem.addEventListener('mouseleave', () => {
                logoutItem.style.backgroundColor = 'transparent';
            });
            
            userProfile.appendChild(dropdown);
            console.log('✅ User profile dropdown added');
            
        } else {
            console.warn('⚠️ User profile not found, adding floating logout button');
            this.addLogoutButtonToBody();
        }
    }

    toggleUserDropdown() {
        const dropdown = document.querySelector('.user-profile-dropdown');
        if (dropdown) {
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
        }
    }

    setupInactivityLogout() {
        let inactivityTimer;
        const timeout = 30 * 60 * 1000; // 30 minutes

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                console.log('Session expired due to inactivity');
                this.logout('Session expired due to inactivity');
            }, timeout);
        };

        // Reset timer on user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer();
    }

    startSessionTimer() {
        // Show session time remaining
        const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours
        const startTime = Date.now();
        
        setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = sessionDuration - elapsed;
            
            if (remaining <= 0) {
                this.logout('Session expired');
                return;
            }
            
            // Show warning when 10 minutes remaining
            if (remaining <= 10 * 60 * 1000 && remaining > 9 * 60 * 1000) {
                this.showSessionWarning();
            }
        }, 60000); // Check every minute
    }

    showSessionWarning() {
        const warning = document.createElement('div');
        warning.id = 'session-warning';
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        warning.innerHTML = `
            <strong>⚠️ Session Warning</strong><br>
            Session akan berakhir dalam 10 menit.<br>
            <button onclick="this.parentElement.remove()" style="
                background: #f59e0b;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                margin-top: 10px;
                cursor: pointer;
            ">Dismiss</button>
        `;
        
        document.body.appendChild(warning);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (warning.parentElement) {
                warning.remove();
            }
        }, 30000);
    }

    async logout(reason = 'User logged out') {
        try {
            console.log('🔒 Auth Guard: Starting logout process...', reason);
            
            // Show loading state
            this.showLogoutLoading();
            
            // Clear session data
            localStorage.removeItem('userSession');
            sessionStorage.clear();
            sessionStorage.removeItem('redirecting');
            
            console.log('🔒 Auth Guard: Session data cleared');
            
            // Sign out from Firebase
            if (typeof firebaseAuth !== 'undefined') {
                console.log('🔒 Auth Guard: Signing out from Firebase...');
                await firebaseAuth.signOut();
                console.log('🔒 Auth Guard: Firebase signout successful');
            } else {
                console.warn('🔒 Auth Guard: firebaseAuth not available');
            }
            
            // Clear any auth guard instances
            if (window.currentAuthGuard) {
                window.currentAuthGuard = null;
            }
            
            console.log('🔒 Auth Guard: Redirecting to login page...');
            
            // Redirect to login
            window.location.href = this.loginPage;
            
        } catch (error) {
            console.error('🔒 Auth Guard: Logout error:', error);
            
            // Force redirect even if logout fails
            console.log('🔒 Auth Guard: Force redirect due to error');
            window.location.href = this.loginPage;
        }
    }

    showLogoutLoading() {
        // Show logout loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.id = 'logout-loading';
        loadingMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #3b82f6;
            color: white;
            padding: 20px 40px;
            border-radius: 12px;
            z-index: 10000;
            font-weight: bold;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        `;
        
        loadingMsg.innerHTML = '🔄 Logging out...';
        document.body.appendChild(loadingMsg);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (loadingMsg.parentElement) {
                loadingMsg.remove();
            }
        }, 3000);
    }
}

// Initialize Auth Guard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase Auth to be available
    const initAuthGuard = () => {
        if (typeof firebaseAuth !== 'undefined') {
            console.log('🔒 Auth Guard: Initializing...');
            window.currentAuthGuard = new AuthGuard();
            console.log('🔒 Auth Guard: Initialized successfully');
        } else {
            console.log('🔒 Auth Guard: Waiting for Firebase Auth...');
            setTimeout(initAuthGuard, 100);
        }
    };
    
    initAuthGuard();
});

// Export for use in other files
window.AuthGuard = AuthGuard;
