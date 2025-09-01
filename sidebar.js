// 🎯 Professional Sidebar - Industry Standard Navigation
console.log('Professional Sidebar.js loaded');

class SidebarManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        console.log('🚀 Initializing sidebar for page:', this.currentPage);
        this.setupSidebar();
        this.setupNavigation();
        this.setupMobileToggle();
        this.setupActiveState();
        this.setupDataRefresh();
        console.log('✅ Professional Sidebar initialized for:', this.currentPage);
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename || 'index.html';
    }

    setupSidebar() {
        // Create sidebar structure
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) {
            console.warn('⚠️ Sidebar not found, creating professional one...');
            console.log('🔍 Current DOM structure:');
            this.logDOMStructure();
            this.createSidebar();
            return;
        }

        console.log('✅ Existing sidebar found, updating content...');
        
        // Check if existing sidebar has the required content
        const hasRequiredContent = this.checkExistingSidebarContent();
        
        if (!hasRequiredContent) {
            console.log('🔄 Existing sidebar missing required content, replacing...');
            this.replaceExistingSidebar();
        } else {
            console.log('✅ Existing sidebar has required content, updating...');
            this.updateSidebarContent();
        }
    }

    logDOMStructure() {
        const container = document.querySelector('.container');
        if (container) {
            console.log('📁 Container found:', container);
            console.log('📁 Container children:', Array.from(container.children).map(child => ({
                tag: child.tagName,
                class: child.className,
                id: child.id
            })));
            
            const mainContent = container.querySelector('.main-content');
            if (mainContent) {
                console.log('📁 Main content found:', mainContent);
            } else {
                console.log('❌ Main content not found');
            }
        } else {
            console.log('❌ Container not found');
        }
    }

    checkExistingSidebarContent() {
        const requiredElements = [
            'sidebarTotalLocations',
            'sidebarTotalProvinces', 
            'sidebarTotalKK',
            'sidebarDataStatus'
        ];

        if (this.currentPage === 'index.html') {
            requiredElements.push(
                'sidebarLocationList',
                'sidebarBinaBlmHPL',
                'sidebarBinaSdhHPL',
                'sidebarBinaTdkHPL',
                'sidebarSerahSdhHPL',
                'sidebarSerahSkSerah',
                'sidebarPermasalahanMasy',
                'sidebarPermasalahanPerusahaan',
                'sidebarPermasalahanKwsHutan',
                'sidebarPermasalahanMHA',
                'sidebarPermasalahanInstansi',
                'sidebarPermasalahanLainLain'
            );
        }

        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.log(`⚠️ Missing elements in existing sidebar: ${missingElements.join(', ')}`);
            return false;
        }
        
        return true;
    }

    replaceExistingSidebar() {
        const existingSidebar = document.querySelector('.sidebar');
        if (!existingSidebar) {
            console.error('❌ No existing sidebar to replace');
            return;
        }

        console.log('🔄 Replacing existing sidebar...');
        
        // Create new sidebar content
        const newSidebarHTML = this.getSidebarHTML();
        
        // Replace the content
        existingSidebar.innerHTML = newSidebarHTML;
        
        console.log('✅ Sidebar content replaced successfully');
        
        // Now update the content
        this.updateSidebarContent();
    }

    createSidebar() {
        const body = document.body;
        const container = document.querySelector('.container');
        
        if (!container) {
            console.error('❌ Container not found');
            return;
        }

        console.log('🔧 Creating sidebar element...');

        // Create sidebar
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        sidebar.innerHTML = this.getSidebarHTML();
        
        // Insert sidebar before main content
        const mainContent = container.querySelector('.main-content');
        if (mainContent) {
            container.insertBefore(sidebar, mainContent);
            console.log('✅ Sidebar inserted before main-content');
        } else {
            container.appendChild(sidebar);
            console.log('✅ Sidebar appended to container');
        }

        // Verify sidebar was inserted
        const insertedSidebar = document.querySelector('.sidebar');
        if (insertedSidebar) {
            console.log('✅ Sidebar successfully inserted into DOM');
            console.log('📍 Sidebar location:', insertedSidebar.parentElement.tagName);
            
            // Force a reflow to ensure DOM is updated
            insertedSidebar.offsetHeight;
            
            // Add mobile toggle button
            this.addMobileToggle();
            
            // Now update the content
            this.updateSidebarContent();
        } else {
            console.error('❌ Failed to insert sidebar into DOM');
        }
    }

    getSidebarHTML() {
        console.log('🔧 Generating sidebar HTML for page:', this.currentPage);
        
        // Base sidebar structure
        let sidebarHTML = `
            <div class="sidebar-header">
                <div class="sidebar-logo">Trans-Data</div>
                <div class="sidebar-subtitle">Dashboard System</div>
            </div>
            
            <nav class="nav-menu">
                <a href="index.html" class="nav-item" data-page="index.html">
                    <i class="fas fa-home"></i>
                    <span>Dashboard</span>
                </a>
                <a href="analytics.html" class="nav-item" data-page="analytics.html">
                    <i class="fas fa-chart-bar"></i>
                    <span>Analytics</span>
                </a>
                <a href="search.html" class="nav-item" data-page="search.html">
                    <i class="fas fa-search"></i>
                    <span>Pencarian</span>
                </a>
                <a href="data.html" class="nav-item" data-page="data.html">
                    <i class="fas fa-database"></i>
                    <span>Data</span>
                </a>
            </nav>

            <div class="sidebar-section">
                <h3>Quick Info</h3>
                <p>Dashboard untuk monitoring permasalahan tanah transmigrasi di seluruh Indonesia.</p>
            </div>

            <div class="sidebar-section">
                <h3>Data Overview</h3>
                <ul>
                    <li>Lokasi: <span id="sidebarTotalLocations" class="data-highlight">-</span></li>
                    <li>Provinsi: <span id="sidebarTotalProvinces" class="data-highlight">-</span></li>
                    <li>Total KK: <span id="sidebarTotalKK" class="data-highlight">-</span></li>
                    <li>Status: <span id="sidebarDataStatus" class="status-indicator loading">Loading...</span></li>
                </ul>
            </div>
        `;

        // Add page-specific content
        if (this.currentPage === 'index.html') {
            console.log('📊 Adding index.html specific content');
            sidebarHTML += `
                <div class="sidebar-section">
                    <h3>Lokasi (SP)</h3>
                    <div class="location-list" id="sidebarLocationList">
                        <!-- Project locations will be populated by JavaScript -->
                    </div>
                </div>

                <div class="sidebar-section">
                    <h3>Status Summary</h3>
                    <ul>
                        <li>Bina - Belum HPL: <span id="sidebarBinaBlmHPL" class="data-highlight">-</span></li>
                        <li>Bina - Sudah HPL: <span id="sidebarBinaSdhHPL" class="data-highlight">-</span></li>
                        <li>Bina - Tidak HPL: <span id="sidebarBinaTdkHPL" class="data-highlight">-</span></li>
                        <li>Serah - Sudah HPL: <span id="sidebarSerahSdhHPL" class="data-highlight">-</span></li>
                        <li>Serah - SK Serah: <span id="sidebarSerahSkSerah" class="data-highlight">-</span></li>
                    </ul>
                </div>

                <div class="sidebar-section">
                    <h3>Permasalahan</h3>
                    <ul>
                        <li>Masyarakat: <span id="sidebarPermasalahanMasy" class="data-highlight">-</span></li>
                        <li>Perusahaan: <span id="sidebarPermasalahanPerusahaan" class="data-highlight">-</span></li>
                        <li>Kawasan Hutan: <span id="sidebarPermasalahanKwsHutan" class="data-highlight">-</span></li>
                        <li>MHA: <span id="sidebarPermasalahanMHA" class="data-highlight">-</span></li>
                        <li>Instansi: <span id="sidebarPermasalahanInstansi" class="data-highlight">-</span></li>
                        <li>Lain-lain: <span id="sidebarPermasalahanLainLain" class="data-highlight">-</span></li>
                    </ul>
                </div>
            `;
        }

        sidebarHTML += `
            <footer class="sidebar-footer">
                <p>© 2024 Trans-Data Dashboard</p>
                <p style="font-size: 11px; margin-top: 5px;">v2.0 - Production</p>
            </footer>
        `;

        console.log('✅ Sidebar HTML generated successfully');
        return sidebarHTML;
    }

    updateSidebarContent() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) {
            console.error('❌ Sidebar not found in updateSidebarContent');
            return;
        }

        console.log('🔄 Updating sidebar content...');
        console.log('📍 Sidebar found at:', sidebar.parentElement.tagName);

        // Update active state
        this.setupActiveState();
        
        // Wait for DOM elements to be ready before updating data
        this.waitForElementsAndUpdate();
    }

    waitForElementsAndUpdate() {
        console.log('⏳ Waiting for sidebar elements to be ready...');
        
        // Check if all required elements are present
        const requiredElements = [
            'sidebarTotalLocations',
            'sidebarTotalProvinces', 
            'sidebarTotalKK',
            'sidebarDataStatus'
        ];

        // Add page-specific elements for index.html
        if (this.currentPage === 'index.html') {
            requiredElements.push(
                'sidebarLocationList',
                'sidebarBinaBlmHPL',
                'sidebarBinaSdhHPL',
                'sidebarBinaTdkHPL',
                'sidebarSerahSdhHPL',
                'sidebarSerahSkSerah',
                'sidebarPermasalahanMasy',
                'sidebarPermasalahanPerusahaan',
                'sidebarPermasalahanKwsHutan',
                'sidebarPermasalahanMHA',
                'sidebarPermasalahanInstansi',
                'sidebarPermasalahanLainLain'
            );
        }

        // Check if all elements are present
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.log(`⏳ Missing elements: ${missingElements.join(', ')}`);
            console.log('🔄 Retrying in 100ms...');
            
            // Retry after 100ms
            setTimeout(() => {
                this.waitForElementsAndUpdate();
            }, 100);
            return;
        }

        console.log('✅ All required elements found, proceeding with updates...');
        
        // Update data overview
        this.updateDataOverview();
        
        // Update status
        this.updateDataStatus();

        // Update page-specific data
        if (this.currentPage === 'index.html') {
            this.updateIndexPageData();
        }

        console.log('✅ Sidebar content updated successfully');
    }

    updateIndexPageData() {
        console.log('📊 Updating index page specific data...');
        
        // Double-check if elements exist before updating
        if (!this.checkRequiredElements()) {
            console.log('⚠️ Required elements not found, skipping update');
            return;
        }
        
        // Update project locations if available
        if (window.dashboardData && window.dashboardData.length > 0) {
            this.updateProjectLocations();
            this.updateStatusSummary();
            this.updatePermasalahanSummary();
        } else {
            console.log('⚠️ No dashboard data available yet');
        }
    }

    checkRequiredElements() {
        const requiredElements = [
            'sidebarLocationList',
            'sidebarBinaBlmHPL',
            'sidebarBinaSdhHPL',
            'sidebarBinaTdkHPL',
            'sidebarSerahSdhHPL',
            'sidebarSerahSkSerah',
            'sidebarPermasalahanMasy',
            'sidebarPermasalahanPerusahaan',
            'sidebarPermasalahanKwsHutan',
            'sidebarPermasalahanMHA',
            'sidebarPermasalahanInstansi',
            'sidebarPermasalahanLainLain'
        ];

        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.warn(`⚠️ Missing required elements: ${missingElements.join(', ')}`);
            return false;
        }
        
        return true;
    }

    updateProjectLocations() {
        const locationList = document.getElementById('sidebarLocationList');
        if (!locationList) {
            console.warn('⚠️ sidebarLocationList not found');
            return;
        }

        console.log('📍 Updating project locations...');

        // Get unique project locations using kabupaten field directly
        const uniqueLocations = [...new Set(window.dashboardData.map(item => item.kabupaten))].slice(0, 10);

        locationList.innerHTML = uniqueLocations.map(location => 
            `<div class="location-item" data-location="${location}">${location}</div>`
        ).join('');

        // Add click event to location items
        const locationItems = locationList.querySelectorAll('.location-item');
        locationItems.forEach(item => {
            item.addEventListener('click', () => {
                // Highlight selected location
                locationItems.forEach(loc => loc.classList.remove('active'));
                item.classList.add('active');
                
                // Get selected location data
                const selectedLocation = item.dataset.location;
                console.log('📍 Selected location:', selectedLocation);
                
                // Dispatch event for dashboard integration
                document.dispatchEvent(new CustomEvent('sidebarLocationSelected', {
                    detail: { 
                        location: selectedLocation, 
                        locationData: this.getLocationData(selectedLocation)
                    }
                }));
                
                // Update dashboard based on selected location
                this.updateDashboardForLocation(selectedLocation);
            });
        });

        console.log(`✅ Updated ${uniqueLocations.length} project locations`);
    }

    updateDashboardForLocation(selectedLocation) {
        console.log('🔄 Updating dashboard for location:', selectedLocation);
        
        if (!window.dashboardData || !selectedLocation) {
            console.warn('⚠️ No data or location selected');
            return;
        }

        // Parse location to get kabupaten and upt
        const [kabupaten, upt] = selectedLocation.split(' - ');
        
        // Filter data for selected location
        const locationData = window.dashboardData.filter(item => 
            item.kabupaten === kabupaten && item.upt === upt
        );

        if (locationData.length === 0) {
            console.warn('⚠️ No data found for selected location');
            return;
        }

        console.log(`📊 Found ${locationData.length} records for location:`, locationData);

        // Update main dashboard content
        this.updateMainDashboard(locationData);
        
        // Update sidebar summary for selected location
        this.updateSidebarForLocation(locationData);
        
        // Show notification
        this.showLocationNotification(selectedLocation);
        
        // Dispatch event to update main page dashboard
        document.dispatchEvent(new CustomEvent('sidebarLocationSelected', {
            detail: { 
                location: selectedLocation, 
                locationData: locationData 
            }
        }));
    }

    updateMainDashboard(locationData) {
        console.log('🔄 Updating main dashboard...');
        
        // Update summary cards
        this.updateSummaryCards(locationData);
        
        // Update problem description
        this.updateProblemDescription(locationData);
        
        // Update follow-up action
        this.updateFollowUpAction(locationData);
        
        // Update recommendation
        this.updateRecommendation(locationData);
        
        // Update status summary
        this.updateStatusSummaryCards(locationData);
        
        // Update problem analysis
        this.updateProblemAnalysis(locationData);
    }

    updateSummaryCards(locationData) {
        // Calculate totals for selected location
        const totalKK = locationData.reduce((sum, item) => sum + (item.jmlKK || 0), 0);
        const totalSHM = locationData.reduce((sum, item) => sum + (item.jmlBidang || 0), 0);
        const totalKasus = locationData.length;

        // Update summary cards
        this.updateElement('totalKK', totalKK.toLocaleString());
        this.updateElement('totalSHM', totalSHM.toLocaleString());
        this.updateElement('totalKasus', totalKasus.toLocaleString());

        console.log(`✅ Summary cards updated: KK=${totalKK}, SHM=${totalSHM}, Kasus=${totalKasus}`);
    }

    updateProblemDescription(locationData) {
        // Get first item's problem description or aggregate
        const descriptions = locationData.map(item => item.deskripsiPermasalahan).filter(Boolean);
        
        if (descriptions.length > 0) {
            const description = descriptions.length === 1 ? 
                descriptions[0] : 
                `${descriptions.length} permasalahan ditemukan untuk lokasi ini`;
            
            this.updateElement('problemDescription', description);
            console.log('✅ Problem description updated');
        }
    }

    updateFollowUpAction(locationData) {
        // Get first item's follow-up action or aggregate
        const followUps = locationData.map(item => item.tindakLanjut).filter(Boolean);
        
        if (followUps.length > 0) {
            const followUp = followUps.length === 1 ? 
                followUps[0] : 
                `${followUps.length} tindak lanjut tersedia`;
            
            this.updateElement('followupAction', followUp);
            console.log('✅ Follow-up action updated');
        }
    }

    updateRecommendation(locationData) {
        // Get first item's recommendation or aggregate
        const recommendations = locationData.map(item => item.rekomendasi).filter(Boolean);
        
        if (recommendations.length > 0) {
            const recommendation = recommendations.length === 1 ? 
                recommendations[0] : 
                `${recommendations.length} rekomendasi tersedia`;
            
            this.updateElement('recommendation', recommendation);
            console.log('✅ Recommendation updated');
        }
    }

    updateStatusSummaryCards(locationData) {
        // Update status summary based on selected location
        const binaBlmHPL = locationData.filter(item => item.statusBina === 'blmHPL').length;
        const binaSdhHPL = locationData.filter(item => item.statusBina === 'sdhHPL').length;
        const binaTdkHPL = locationData.filter(item => item.statusBina === 'tdkHPL').length;
        const serahSdhHPL = locationData.filter(item => item.statusSerah === 'sdhHPL').length;
        const serahSkSerah = locationData.filter(item => item.statusSerah === 'skSerah').length;

        // Update status values
        this.updateElement('binaBlmHPL', binaBlmHPL > 0 ? 'Yes' : 'No');
        this.updateElement('binaSdhHPL', binaSdhHPL > 0 ? 'Yes' : 'No');
        this.updateElement('binaTdkHPL', binaTdkHPL > 0 ? 'Yes' : 'No');
        this.updateElement('serahSdhHPL', serahSdhHPL > 0 ? 'Yes' : 'No');
        
        // Update SK Serah with actual value if available
        const skSerahItem = locationData.find(item => item.statusSerah === 'skSerah');
        if (skSerahItem && skSerahItem.skSerah) {
            this.updateElement('serahSKSerah', skSerahItem.skSerah);
        } else {
            this.updateElement('serahSKSerah', serahSkSerah > 0 ? 'Yes' : 'No');
        }

        console.log('✅ Status summary cards updated');
    }

    updateProblemAnalysis(locationData) {
        // Count problem types for selected location
        const permasalahanMasy = locationData.filter(item => item.permasalahanMasyarakat).length;
        const permasalahanPerusahaan = locationData.filter(item => item.permasalahanPerusahaan).length;
        const permasalahanKwsHutan = locationData.filter(item => item.permasalahanKwsHutan).length;
        const permasalahanMHA = locationData.filter(item => item.permasalahanMHA).length;
        const permasalahanInstansi = locationData.filter(item => item.permasalahanInstansi).length;
        const permasalahanLainLain = locationData.filter(item => item.permasalahanLainLain).length;

        // Update sidebar problem summary for selected location
        this.updateSidebarElement('sidebarPermasalahanMasy', permasalahanMasy);
        this.updateSidebarElement('sidebarPermasalahanPerusahaan', permasalahanPerusahaan);
        this.updateSidebarElement('sidebarPermasalahanKwsHutan', permasalahanKwsHutan);
        this.updateSidebarElement('sidebarPermasalahanMHA', permasalahanMHA);
        this.updateSidebarElement('sidebarPermasalahanInstansi', permasalahanInstansi);
        this.updateSidebarElement('sidebarPermasalahanLainLain', permasalahanLainLain);

        console.log('✅ Problem analysis updated');
    }

    updateSidebarForLocation(locationData) {
        // Update sidebar status summary for selected location
        const binaBlmHPL = locationData.filter(item => item.statusBina === 'blmHPL').length;
        const binaSdhHPL = locationData.filter(item => item.statusBina === 'sdhHPL').length;
        const binaTdkHPL = locationData.filter(item => item.statusBina === 'tdkHPL').length;
        const serahSdhHPL = locationData.filter(item => item.statusSerah === 'sdhHPL').length;
        const serahSkSerah = locationData.filter(item => item.statusSerah === 'skSerah').length;

        // Update sidebar elements
        this.updateSidebarElement('sidebarBinaBlmHPL', binaBlmHPL);
        this.updateSidebarElement('sidebarBinaSdhHPL', binaSdhHPL);
        this.updateSidebarElement('sidebarBinaTdkHPL', binaTdkHPL);
        this.updateSidebarElement('sidebarSerahSdhHPL', serahSdhHPL);
        this.updateSidebarElement('sidebarSerahSkSerah', serahSkSerah);

        console.log('✅ Sidebar updated for selected location');
    }

    updateElement(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = newValue;
        } else {
            console.warn(`⚠️ Element ${elementId} not found for update`);
        }
    }

    showLocationNotification(location) {
        // Create notification element
        let notification = document.querySelector('.location-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'location-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 1000;
                font-size: 14px;
                max-width: 300px;
                animation: slideIn 0.3s ease-out;
            `;
            
            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(notification);
        }
        
        // Update notification content
        notification.textContent = `📍 Dashboard updated for: ${location}`;
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }

    updateSidebarElementWithRetry(elementId, value, maxRetries = 5) {
        let retryCount = 0;
        
        const tryUpdate = () => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value.toLocaleString();
                return true;
            } else if (retryCount < maxRetries) {
                retryCount++;
                console.log(`⏳ Retry ${retryCount}/${maxRetries} for element: ${elementId}`);
                setTimeout(tryUpdate, 100);
                return false;
            } else {
                console.warn(`⚠️ Failed to find element ${elementId} after ${maxRetries} retries`);
                return false;
            }
        };
        
        return tryUpdate();
    }

    updateSidebarElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value.toLocaleString();
        } else {
            console.warn(`⚠️ Element ${elementId} not found`);
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        console.log(`🔗 Setting up navigation for ${navItems.length} items`);
        
        navItems.forEach(item => {
            // Remove default link behavior for proper navigation
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetPage = item.dataset.page;
                if (targetPage && targetPage !== this.currentPage) {
                    this.navigateToPage(targetPage);
                }
            });
        });
    }

    navigateToPage(targetPage) {
        console.log('🔄 Navigating to:', targetPage);
        
        // Show loading state
        this.showLoadingState();
        
        // Navigate after short delay for smooth transition
        setTimeout(() => {
            window.location.href = targetPage;
        }, 150);
    }

    showLoadingState() {
        // Add loading class to body
        document.body.classList.add('page-loading');
        
        // Show loading indicator if exists
        const loadingEl = document.querySelector('.loading-indicator');
        if (loadingEl) {
            loadingEl.style.display = 'block';
        }
    }

    setupActiveState() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            const targetPage = item.dataset.page;
            if (targetPage === this.currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        console.log(`✅ Active state set for page: ${this.currentPage}`);
    }

    updateDataStatus() {
        const statusEl = document.getElementById('sidebarDataStatus');
        if (!statusEl) {
            console.warn('⚠️ sidebarDataStatus element not found');
            return;
        }
        
        if (window.dashboardData && window.dashboardData.length > 0) {
            statusEl.textContent = 'Connected';
            statusEl.className = 'status-indicator success';
        } else {
            statusEl.textContent = 'No Data';
            statusEl.className = 'status-indicator error';
        }
    }

    updateDataOverview() {
        // Update sidebar data if available
        if (window.dashboardData && window.dashboardData.length > 0) {
            const data = window.dashboardData;
            
            // Calculate totals
            const totalLocations = data.length;
            const totalProvinces = new Set(data.map(item => item.provinsi)).size;
            const totalKK = data.reduce((sum, item) => sum + (item.jmlKK || 0), 0);
            
            // Update sidebar
            this.updateDataElement('sidebarTotalLocations', totalLocations.toLocaleString());
            this.updateDataElement('sidebarTotalProvinces', totalProvinces.toLocaleString());
            this.updateDataElement('sidebarTotalKK', totalKK.toLocaleString());
        }
    }

    updateDataElement(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const oldValue = element.textContent;
        if (oldValue === newValue) return;
        
        element.textContent = newValue;
    }

    setupDataRefresh() {
        // Auto-refresh data every 30 seconds
        setInterval(() => {
            this.updateDataOverview();
            this.updateDataStatus();
            
            if (this.currentPage === 'index.html') {
                this.updateIndexPageData();
            }
        }, 30000);
    }

    setupMobileToggle() {
        // Add mobile toggle button
        this.addMobileToggle();
        
        // Add overlay
        this.addOverlay();
        
        // Setup event listeners
        this.setupMobileEvents();
    }

    addMobileToggle() {
        if (document.querySelector('.sidebar-toggle')) return;
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        toggleBtn.onclick = () => this.toggleSidebar();
        
        document.body.appendChild(toggleBtn);
    }

    addOverlay() {
        if (document.querySelector('.sidebar-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.onclick = () => this.closeSidebar();
        
        document.body.appendChild(overlay);
    }

    setupMobileEvents() {
        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
            }
        });
        
        // Close sidebar on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('open');
            
            // Update toggle button
            const toggleBtn = document.querySelector('.sidebar-toggle');
            if (toggleBtn) {
                toggleBtn.innerHTML = sidebar.classList.contains('open') ? 
                    '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            }
        }
    }

    closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            
            // Update toggle button
            const toggleBtn = document.querySelector('.sidebar-toggle');
            if (toggleBtn) {
                toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    }

    // Public method to refresh sidebar data
    refreshData() {
        this.updateDataOverview();
        this.updateDataStatus();
        
        if (this.currentPage === 'index.html') {
            this.updateIndexPageData();
        }
    }

    // Listen for dashboard updates
    setupDashboardIntegration() {
        console.log('🔗 Setting up dashboard integration...');
        
        // Listen for dashboard updates
        document.addEventListener('dashboardUpdated', (event) => {
            const { filteredData, activeFilters, selectedSidebarLocation } = event.detail;
            console.log('📊 Dashboard updated, syncing sidebar...');
            
            // Update sidebar with new data
            this.updateSidebarWithDashboardData(filteredData, activeFilters, selectedSidebarLocation);
        });
        
        // Listen for filter changes
        document.addEventListener('filtersChanged', (event) => {
            const filters = event.detail;
            console.log('🔍 Filters changed, updating sidebar...');
            
            // Update sidebar to reflect current filters
            this.updateSidebarWithFilters(filters);
        });
        
        // Listen for sidebar location updates from filtering
        document.addEventListener('updateSidebarLocations', (event) => {
            const { filteredData, activeFilters, shouldResetLocation } = event.detail;
            console.log('📍 Updating sidebar locations with filtered results...');
            
            // Update location list with filtered results
            this.updateLocationListWithFilteredData(filteredData, shouldResetLocation);
            
            // Update sidebar data overview with filtered results
            this.updateSidebarWithDashboardData(filteredData, activeFilters, shouldResetLocation ? null : this.selectedSidebarLocation);
        });
        
        console.log('✅ Dashboard integration setup complete');
    }

    // Update sidebar with dashboard data
    updateSidebarWithDashboardData(filteredData, activeFilters, selectedSidebarLocation) {
        console.log('🔄 Updating sidebar with dashboard data...');
        
        // Update data overview
        this.updateDataOverviewWithFilteredData(filteredData);
        
        // Update status summary
        this.updateStatusSummaryWithFilteredData(filteredData);
        
        // Update permasalahan summary
        this.updatePermasalahanSummaryWithFilteredData(filteredData);
        
        // Highlight selected location if any
        this.highlightSelectedLocation(selectedSidebarLocation);
        
        console.log('✅ Sidebar updated with dashboard data');
    }

    // Update data overview with filtered data
    updateDataOverviewWithFilteredData(filteredData) {
        if (!filteredData || filteredData.length === 0) {
            this.updateDataElement('sidebarTotalLocations', '0');
            this.updateDataElement('sidebarTotalProvinces', '0');
            this.updateDataElement('sidebarTotalKK', '0');
            this.updateDataElement('sidebarDataStatus', 'No Data');
            return;
        }
        
        const totalLocations = filteredData.length;
        const totalProvinces = new Set(filteredData.map(item => item.provinsi)).size;
        const totalKK = filteredData.reduce((sum, item) => sum + (item.jmlKK || 0), 0);
        
        this.updateDataElement('sidebarTotalLocations', totalLocations.toLocaleString());
        this.updateDataElement('sidebarTotalProvinces', totalProvinces.toLocaleString());
        this.updateDataElement('sidebarTotalKK', totalKK.toLocaleString());
        this.updateDataElement('sidebarDataStatus', 'Filtered');
    }

    // Update status summary with filtered data
    updateStatusSummaryWithFilteredData(filteredData) {
        if (!filteredData || filteredData.length === 0) {
            this.updateSidebarElement('sidebarBinaBlmHPL', '0');
            this.updateSidebarElement('sidebarBinaSdhHPL', '0');
            this.updateSidebarElement('sidebarBinaTdkHPL', '0');
            this.updateSidebarElement('sidebarSerahSdhHPL', '0');
            this.updateSidebarElement('sidebarSerahSkSerah', '0');
            return;
        }
        
        const binaBlmHPL = filteredData.filter(item => item.statusBinaBlmHPL).length;
        const binaSdhHPL = filteredData.filter(item => item.statusBinaSdhHPL).length;
        const binaTdkHPL = filteredData.filter(item => item.statusBinaTdkHPL).length;
        const serahSdhHPL = filteredData.filter(item => item.statusSerahSdhHPL).length;
        const serahSkSerah = filteredData.filter(item => item.statusSerahSKSerah).length;
        
        this.updateSidebarElement('sidebarBinaBlmHPL', binaBlmHPL);
        this.updateSidebarElement('sidebarBinaSdhHPL', binaSdhHPL);
        this.updateSidebarElement('sidebarBinaTdkHPL', binaTdkHPL);
        this.updateSidebarElement('sidebarSerahSdhHPL', serahSdhHPL);
        this.updateSidebarElement('sidebarSerahSkSerah', serahSkSerah);
    }

    // Update permasalahan summary with filtered data
    updatePermasalahanSummaryWithFilteredData(filteredData) {
        if (!filteredData || filteredData.length === 0) {
            this.updateSidebarElement('sidebarPermasalahanMasy', '0');
            this.updateSidebarElement('sidebarPermasalahanPerusahaan', '0');
            this.updateSidebarElement('sidebarPermasalahanKwsHutan', '0');
            this.updateSidebarElement('sidebarPermasalahanMHA', '0');
            this.updateSidebarElement('sidebarPermasalahanInstansi', '0');
            this.updateSidebarElement('sidebarPermasalahanLainLain', '0');
            return;
        }
        
        const permasalahanMasy = filteredData.filter(item => item.permasalahanOKUMasy).length;
        const permasalahanPerusahaan = filteredData.filter(item => item.permasalahanPerusahaan).length;
        const permasalahanKwsHutan = filteredData.filter(item => item.permasalahanKwsHutan).length;
        const permasalahanMHA = filteredData.filter(item => item.permasalahanMHA).length;
        const permasalahanInstansi = filteredData.filter(item => item.permasalahanInstansi).length;
        const permasalahanLainLain = filteredData.filter(item => item.permasalahanLainLain).length;
        
        this.updateSidebarElement('sidebarPermasalahanMasy', permasalahanMasy);
        this.updateSidebarElement('sidebarPermasalahanPerusahaan', permasalahanPerusahaan);
        this.updateSidebarElement('sidebarPermasalahanKwsHutan', permasalahanKwsHutan);
        this.updateSidebarElement('sidebarPermasalahanMHA', permasalahanMHA);
        this.updateSidebarElement('sidebarPermasalahanInstansi', permasalahanInstansi);
        this.updateSidebarElement('sidebarPermasalahanLainLain', permasalahanLainLain);
    }

    // Highlight selected location in sidebar
    highlightSelectedLocation(selectedLocation) {
        if (!selectedLocation) {
            // Remove all active states
            const locationItems = document.querySelectorAll('.location-item');
            locationItems.forEach(item => item.classList.remove('active'));
            return;
        }
        
        const locationItems = document.querySelectorAll('.location-item');
        locationItems.forEach(item => {
            if (item.dataset.location === selectedLocation) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Update sidebar with filters
    updateSidebarWithFilters(filters) {
        console.log('🔍 Updating sidebar with filters:', filters);
        
        // Update filter status in sidebar
        this.updateFilterStatus(filters);
        
        // Update data overview to show filtered count
        if (window.filteredData) {
            this.updateDataOverviewWithFilteredData(window.filteredData);
        }
    }

    // Update filter status in sidebar
    updateFilterStatus(filters) {
        // You can add visual indicators for active filters here
        console.log('🔍 Active filters:', filters);
        
        // Update data status to show filtered state
        const statusElement = document.getElementById('sidebarDataStatus');
        if (statusElement) {
            if (Object.keys(filters).some(key => filters[key])) {
                statusElement.textContent = 'Filtered';
                statusElement.className = 'status-indicator filtered';
            } else {
                statusElement.textContent = 'Connected';
                statusElement.className = 'status-indicator success';
            }
        }
    }

    // Update location list with filtered data
    updateLocationListWithFilteredData(filteredData, shouldResetLocation) {
        console.log('🔄 Updating location list with filtered data...');
        
        const locationList = document.getElementById('sidebarLocationList');
        if (!locationList) {
            console.warn('⚠️ sidebarLocationList not found');
            return;
        }

        // Get unique locations from filtered data - use kabupaten directly
        const uniqueLocations = [...new Set(filteredData.map(item => item.kabupaten))].slice(0, 10);

        console.log(`📍 Found ${uniqueLocations.length} locations from filtered data:`, uniqueLocations);

        // Clear current location list
        locationList.innerHTML = '';

        if (uniqueLocations.length === 0) {
            locationList.innerHTML = '<div class="no-locations">Tidak ada lokasi yang sesuai dengan filter</div>';
            return;
        }

        // Create location items - use kabupaten directly
        locationList.innerHTML = uniqueLocations.map(location => 
            `<div class="location-item" data-location="${location}">${location}</div>`
        ).join('');

        // Add click event to location items
        const locationItems = locationList.querySelectorAll('.location-item');
        locationItems.forEach(item => {
            item.addEventListener('click', () => {
                // Highlight selected location
                locationItems.forEach(loc => loc.classList.remove('active'));
                item.classList.add('active');
                
                // Get selected location data
                const selectedLocation = item.dataset.location;
                console.log('📍 Selected location from filtered list:', selectedLocation);
                
                // Store selected location
                this.selectedSidebarLocation = selectedLocation;
                
                // Dispatch event for dashboard integration
                document.dispatchEvent(new CustomEvent('sidebarLocationSelected', {
                    detail: { 
                        location: selectedLocation, 
                        locationData: this.getLocationData(selectedLocation)
                    }
                }));
                
                // Update dashboard based on selected location
                this.updateDashboardForLocation(selectedLocation);
            });
        });

        // Reset location selection if needed
        if (shouldResetLocation) {
            this.selectedSidebarLocation = null;
            console.log('🔄 Location selection reset');
        }

        console.log(`✅ Location list updated with ${uniqueLocations.length} locations`);
    }

    // Get location data for selected location
    getLocationData(selectedLocation) {
        if (!window.dashboardData || !selectedLocation) {
            return [];
        }

        // Filter data for selected location using kabupaten field directly
        const locationData = window.dashboardData.filter(item => 
            item.kabupaten === selectedLocation
        );

        console.log(`📊 Found ${locationData.length} records for location: ${selectedLocation}`);
        return locationData;
    }

    updateDashboardForLocation(selectedLocation) {
        console.log('🔄 Updating dashboard for location:', selectedLocation);
        
        if (!window.dashboardData || !selectedLocation) {
            console.warn('⚠️ No data or location selected');
            return;
        }

        // Get location data directly using kabupaten field
        const locationData = this.getLocationData(selectedLocation);

        if (locationData.length === 0) {
            console.warn('⚠️ No data found for selected location');
            return;
        }

        console.log(`📊 Found ${locationData.length} records for location:`, locationData);

        // Update main dashboard content
        this.updateMainDashboard(locationData);
        
        // Update sidebar summary for selected location
        this.updateSidebarForLocation(locationData);
        
        // Show notification
        this.showLocationNotification(selectedLocation);
        
        // Dispatch event to update main page dashboard
        document.dispatchEvent(new CustomEvent('sidebarLocationSelected', {
            detail: { 
                location: selectedLocation, 
                locationData: locationData 
            }
        }));
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 DOM loaded, initializing sidebar...');
    
    // Initialize sidebar immediately
    const initSidebar = () => {
        console.log('🚀 Creating sidebar manager...');
        window.sidebarManager = new SidebarManager();
        
        // Double-check if sidebar was created successfully
        setTimeout(() => {
            const sidebar = document.querySelector('.sidebar');
            if (!sidebar) {
                console.error('❌ Sidebar creation failed, retrying...');
                window.sidebarManager = new SidebarManager();
            } else {
                console.log('✅ Sidebar created successfully');
            }
        }, 200);
    };
    
    // Start initialization
    initSidebar();
});

// Fallback: Initialize if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM still loading, wait for DOMContentLoaded
    console.log('⏳ DOM still loading, waiting...');
} else {
    // DOM already loaded, initialize immediately
    console.log('🚀 DOM already loaded, initializing sidebar immediately...');
    window.sidebarManager = new SidebarManager();
}

// Export for use in other files
window.SidebarManager = SidebarManager;
