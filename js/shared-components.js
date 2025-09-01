// Shared Components - Simple Inline Injection
// No API, no fetch - just direct HTML injection

(function() {
    'use strict';
    
    console.log('🚀 Shared Components loading...');
    
    // Sidebar HTML Template
    const sidebarHTML = `
        <aside class="sidebar-ultimate">
            <div class="sidebar-header-ultimate">
                <div class="sidebar-brand-ultimate">
                    <div class="brand-logo">
                        <img src="image/logo.png" alt="Logo" style="width: 40px; height: 40px; border-radius: 8px;">
                    </div>
                    <div>
                        <h1>Dashboard</h1>
                        <p>Permasalahan Lahan Transmigran</p>
                    </div>
                </div>
            </div>
            <nav class="sidebar-nav-ultimate">
                <a href="index.html" class="nav-item-ultimate" id="nav-dashboard">
                    <i class="fas fa-home"></i>
                    <span>Dashboard</span>
                </a>
                <a href="analytics.html" class="nav-item-ultimate" id="nav-analytics">
                    <i class="fas fa-chart-bar"></i>
                    <span>Analytics</span>
                </a>
                <a href="search-new.html" class="nav-item-ultimate" id="nav-search">
                    <i class="fas fa-search"></i>
                    <span>Pencarian</span>
                </a>
                <a href="data-new.html" class="nav-item-ultimate" id="nav-data">
                    <i class="fas fa-database"></i>
                    <span>Data</span>
                </a>
                <a href="admin-users.html" class="nav-item-ultimate" id="nav-admin">
                    <i class="fas fa-users-cog"></i>
                    <span>Admin Users</span>
                </a>
            </nav>
        </aside>
    `;
    
    // Header HTML Template
    const headerHTML = `
        <header class="header-ultimate">
            <div class="header-left-ultimate">
                <div class="page-info-ultimate">
                    <h1 id="pageTitle">Dashboard</h1>
                    <p id="pageDescription">Overview Nasional - Indonesia</p>
                </div>
            </div>
            <div class="header-right-ultimate">
                <div class="status-indicator-ultimate">
                    <div class="status-dot"></div>
                    <span>CONNECTED</span>
                </div>
                <div class="user-profile-ultimate" onclick="toggleUserDropdown()">
                    <div class="user-avatar-ultimate">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <div class="font-medium" id="userName">User</div>
                        <div class="text-sm text-muted" id="userEmail">user@example.com</div>
                    </div>
                    <!-- User Dropdown -->
                    <div class="user-dropdown-ultimate" id="userDropdown">
                        <div class="dropdown-header-ultimate">
                            <div class="dropdown-user-info-ultimate">
                                <div class="dropdown-avatar-ultimate">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="dropdown-user-details-ultimate">
                                    <h4 id="dropdownUserName">User</h4>
                                    <p id="dropdownUserEmail">user@example.com</p>
                                </div>
                            </div>
                        </div>
                        <div class="dropdown-menu-ultimate">
                            <button class="dropdown-item-ultimate" onclick="openProfileModal()">
                                <i class="fas fa-user-circle"></i>
                                <span>Profile</span>
                            </button>
                            <button class="dropdown-item-ultimate" onclick="openSettingsModal()">
                                <i class="fas fa-cog"></i>
                                <span>Settings</span>
                            </button>
                            <button class="dropdown-item-ultimate logout" onclick="handleLogout()">
                                <i class="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    `;
    
    // Function to load components
    function loadSharedComponents() {
        // Load Sidebar
        const sidebarContainer = document.getElementById('shared-sidebar');
        if (sidebarContainer) {
            sidebarContainer.innerHTML = sidebarHTML;
            console.log('✅ Sidebar loaded');
        }
        
        // Load Header
        const headerContainer = document.getElementById('shared-header');
        if (headerContainer) {
            headerContainer.innerHTML = headerHTML;
            console.log('✅ Header loaded');
        }
        
        // Set active navigation
        setActiveNavigation();
        
        // Set page-specific info
        setPageInfo();
        
        console.log('✅ All shared components loaded successfully');
    }
    
    // Set active navigation based on current page
    function setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item-ultimate').forEach(item => {
            item.classList.remove('active');
        });
        
        // Set active based on current page
        let activeNavId = '';
        switch(currentPage) {
            case 'index.html':
            case '':
                activeNavId = 'nav-dashboard';
                break;
            case 'analytics.html':
                activeNavId = 'nav-analytics';
                break;
            case 'search-new.html':
            case 'search.html':
                activeNavId = 'nav-search';
                break;
            case 'data-new.html':
            case 'data.html':
                activeNavId = 'nav-data';
                break;
            case 'admin-users.html':
                activeNavId = 'nav-admin';
                break;
        }
        
        if (activeNavId) {
            const activeNav = document.getElementById(activeNavId);
            if (activeNav) {
                activeNav.classList.add('active');
                console.log(`🎯 Active navigation: ${activeNavId}`);
            }
        }
    }
    
    // Set page-specific information
    function setPageInfo() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        let pageTitle = 'Dashboard';
        let pageDescription = 'Overview Nasional - Indonesia';
        
        switch(currentPage) {
            case 'index.html':
            case '':
                pageTitle = 'Dashboard';
                pageDescription = 'Overview Nasional - Indonesia';
                break;
            case 'analytics.html':
                pageTitle = 'Analytics';
                pageDescription = 'Data Analytics & Insights';
                break;
            case 'search-new.html':
            case 'search.html':
                pageTitle = 'Pencarian Data';
                pageDescription = 'Cari & Filter Data Transmigrasi';
                break;
            case 'data-new.html':
            case 'data.html':
                pageTitle = 'Data Management';
                pageDescription = 'Kelola Data Transmigrasi';
                break;
            case 'admin-users.html':
                pageTitle = 'Admin Users';
                pageDescription = 'Manage User Access & Permissions';
                break;
        }
        
        // Update page title and description
        const titleElement = document.getElementById('pageTitle');
        const descElement = document.getElementById('pageDescription');
        
        if (titleElement) titleElement.textContent = pageTitle;
        if (descElement) descElement.textContent = pageDescription;
    }
    
    // Global functions for user dropdown and modals
    window.toggleUserDropdown = function() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    };
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('userDropdown');
        const userProfile = event.target.closest('.user-profile-ultimate');
        if (dropdown && !userProfile && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    });
    
    window.openProfileModal = function() {
        const modal = document.getElementById('profileModal');
        if (modal) {
            modal.classList.add('show');
        } else {
            alert('Profile functionality coming soon!');
        }
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('show');
    };
    
    window.openSettingsModal = function() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('show');
        } else {
            alert('Settings functionality coming soon!');
        }
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('show');
    };
    
    window.handleLogout = function() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            window.location.href = 'login.html';
        }
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSharedComponents);
    } else {
        loadSharedComponents();
    }
    
})();
