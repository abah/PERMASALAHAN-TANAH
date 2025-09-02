/* ========================================
   MOBILE MENU FUNCTIONALITY
   ======================================== */

(function() {
    'use strict';
    
    console.log('🚀 Mobile Menu initializing...');
    
    // Mobile menu functionality
    function initializeMobileMenu() {
        // Create mobile menu toggle button
        function createMobileToggle() {
            const existingToggle = document.getElementById('mobile-menu-toggle');
            if (existingToggle) return existingToggle;
            
            const toggle = document.createElement('button');
            toggle.id = 'mobile-menu-toggle';
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '<i class="fas fa-bars"></i>';
            toggle.setAttribute('aria-label', 'Toggle menu');
            toggle.setAttribute('type', 'button');
            
            document.body.appendChild(toggle);
            return toggle;
        }
        
        // Create mobile overlay
        function createMobileOverlay() {
            const existingOverlay = document.getElementById('mobile-overlay');
            if (existingOverlay) return existingOverlay;
            
            const overlay = document.createElement('div');
            overlay.id = 'mobile-overlay';
            overlay.className = 'mobile-overlay';
            
            document.body.appendChild(overlay);
            return overlay;
        }
        
        // Get or create elements
        const toggle = createMobileToggle();
        const overlay = createMobileOverlay();
        const sidebar = document.querySelector('.sidebar-ultimate');
        
        if (!sidebar) {
            console.warn('⚠️ Sidebar not found for mobile menu');
            return;
        }
        
        let isMenuOpen = false;
        
        // Toggle menu function
        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                sidebar.classList.add('show');
                overlay.classList.add('show');
                toggle.innerHTML = '<i class="fas fa-times"></i>';
                document.body.style.overflow = 'hidden'; // Prevent background scroll
                
                // Focus management for accessibility
                const firstNavItem = sidebar.querySelector('.nav-item-ultimate');
                if (firstNavItem) {
                    setTimeout(() => firstNavItem.focus(), 100);
                }
            } else {
                sidebar.classList.remove('show');
                overlay.classList.remove('show');
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = '';
                
                // Return focus to toggle button
                toggle.focus();
            }
            
            console.log(`📱 Mobile menu ${isMenuOpen ? 'opened' : 'closed'}`);
        }
        
        // Close menu function
        function closeMenu() {
            if (isMenuOpen) {
                toggleMenu();
            }
        }
        
        // Event listeners
        toggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);
        
        // Close menu when clicking nav items
        const navItems = sidebar.querySelectorAll('.nav-item-ultimate');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // Small delay to allow navigation
                setTimeout(closeMenu, 100);
            });
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });
        
        // Close menu on window resize to desktop
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 1024 && isMenuOpen) {
                    closeMenu();
                }
            }, 100);
        });
        
        // Touch gestures for swipe to close
        let touchStartX = 0;
        let touchEndX = 0;
        
        sidebar.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        sidebar.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeDistance = touchEndX - touchStartX;
            const minSwipeDistance = 50;
            
            // Swipe left to close menu
            if (swipeDistance < -minSwipeDistance && isMenuOpen) {
                closeMenu();
            }
        }
        
        console.log('✅ Mobile menu initialized successfully');
    }
    
    // Responsive behavior detection
    function handleResponsiveChanges() {
        const mediaQuery = window.matchMedia('(max-width: 1024px)');
        
        function handleMediaChange(e) {
            if (e.matches) {
                // Mobile/tablet view
                document.body.classList.add('mobile-view');
                console.log('📱 Switched to mobile view');
            } else {
                // Desktop view
                document.body.classList.remove('mobile-view');
                
                // Clean up mobile menu state
                const sidebar = document.querySelector('.sidebar-ultimate');
                const overlay = document.getElementById('mobile-overlay');
                
                if (sidebar) sidebar.classList.remove('show');
                if (overlay) overlay.classList.remove('show');
                document.body.style.overflow = '';
                
                console.log('🖥️ Switched to desktop view');
            }
        }
        
        // Initial check
        handleMediaChange(mediaQuery);
        
        // Listen for changes
        mediaQuery.addListener(handleMediaChange);
    }
    
    // Auto-hide mobile menu on navigation
    function handleNavigation() {
        // Listen for page navigation
        const navItems = document.querySelectorAll('.nav-item-ultimate');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const overlay = document.getElementById('mobile-overlay');
                const sidebar = document.querySelector('.sidebar-ultimate');
                
                if (overlay && overlay.classList.contains('show')) {
                    setTimeout(() => {
                        sidebar?.classList.remove('show');
                        overlay.classList.remove('show');
                        document.body.style.overflow = '';
                    }, 200);
                }
            });
        });
    }
    
    // Performance optimization - debounced resize handler
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimized resize handler
    const handleResize = debounce(() => {
        const sidebar = document.querySelector('.sidebar-ultimate');
        const overlay = document.getElementById('mobile-overlay');
        
        if (window.innerWidth > 1024) {
            // Desktop - ensure clean state
            if (sidebar) sidebar.classList.remove('show');
            if (overlay) overlay.classList.remove('show');
            document.body.style.overflow = '';
            
            const toggle = document.getElementById('mobile-menu-toggle');
            if (toggle) toggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }, 100);
    
    window.addEventListener('resize', handleResize);
    
    // Initialize everything when DOM is ready
    function initialize() {
        try {
            initializeMobileMenu();
            handleResponsiveChanges();
            handleNavigation();
            console.log('🎉 Mobile responsive system ready!');
        } catch (error) {
            console.error('❌ Mobile menu initialization error:', error);
        }
    }
    
    // Wait for DOM and shared components to load
    function waitForSidebar() {
        const sidebar = document.querySelector('.sidebar-ultimate');
        if (sidebar) {
            initialize();
        } else {
            // Retry after shared components load
            setTimeout(waitForSidebar, 100);
        }
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForSidebar);
    } else {
        waitForSidebar();
    }
    
    // Global functions for external access
    window.mobileMenu = {
        close: function() {
            const sidebar = document.querySelector('.sidebar-ultimate');
            const overlay = document.getElementById('mobile-overlay');
            const toggle = document.getElementById('mobile-menu-toggle');
            
            if (sidebar) sidebar.classList.remove('show');
            if (overlay) overlay.classList.remove('show');
            if (toggle) toggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        },
        
        isOpen: function() {
            const sidebar = document.querySelector('.sidebar-ultimate');
            return sidebar ? sidebar.classList.contains('show') : false;
        }
    };
    
})();
