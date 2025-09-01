// Analytics Dashboard - Using Real Data from Firebase
console.log('🚀 Analytics.js loaded successfully');

// Debug function to check if everything is working
function debugAnalytics() {
    console.log('🔍 Debug Analytics Status:');
    console.log('- Window.dashboardData:', window.dashboardData ? window.dashboardData.length : 'Not loaded');
    console.log('- Firebase db:', window.db ? 'Available' : 'Not available');
    console.log('- Chart.js:', typeof Chart !== 'undefined' ? 'Available' : 'Not available');
    console.log('- DOM Elements:');
    console.log('  - problemChart:', document.getElementById('problemChart') ? 'Found' : 'Not found');
    console.log('  - provinceChart:', document.getElementById('provinceChart') ? 'Found' : 'Not found');
    console.log('  - timelineChart:', document.getElementById('timelineChart') ? 'Found' : 'Not found');
    console.log('  - statusChart:', document.getElementById('statusChart') ? 'Found' : 'Not found');
    console.log('  - totalLocations:', document.getElementById('totalLocations') ? 'Found' : 'Not found');
}

// Global variables
// dashboardData akan diambil dari window.dashboardData atau data.js

// Chart instances
let charts = {};

// Chart configuration
const chartConfig = {
    common: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: { size: 12 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#3b82f6',
                borderWidth: 1,
                cornerRadius: 8
            }
        }
    },
    doughnut: {
        cutout: '60%',
        plugins: { legend: { position: 'bottom' } }
    },
    bar: {
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
            x: { grid: { display: false } }
        }
    },
    line: {
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
            x: { grid: { color: 'rgba(0, 0, 0, 0.1)' } }
        }
    }
};

// Initialize analytics dashboard dengan Firebase (same as index.html)
async function initAnalytics() {
    try {
        console.log('🚀 Initializing analytics...');
        
        // Check if Firebase is available
        if (window.db) {
            console.log('🔥 Firebase available, loading data...');
            try {
                // Load data dari Firebase (same as script.js)
                const snapshot = await window.db.collection('transmigrasi').get();
                const firebaseData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firebase data back to original format (same as script.js)
                    return {
                        id: data.id || doc.id,
                        provinsi: data.provinsi || '',
                        kabupaten: data.kabupaten || '',
                        upt: data.upt || '',
                        pola: data.pola || '',
                        tahunPatan: data.tahun_patan || data.tahunPatan || '',
                        tahunSerah: data.tahun_serah || data.tahunSerah || '',
                        jmlKK: data.jumlah_kk || data.jmlKK || 0,
                        bebanTugasSHM: data.beban_tugas_shm || data.bebanTugasSHM || 0,
                        hpl: data.hpl || '',
                        statusBinaBlmHPL: data.status_bina_blm_hpl || data.statusBinaBlmHPL || false,
                        statusBinaSdhHPL: data.status_bina_sdh_hpl || data.statusBinaSdhHPL || false,
                        statusBinaTdkHPL: data.status_bina_tdk_hpl || data.statusBinaTdkHPL || false,
                        statusSerahSdhHPL: data.status_serah_sdh_hpl || data.statusSerahSdhHPL || false,
                        statusSerahSKSerah: data.status_serah_sk_serah || data.statusSerahSKSerah || '',
                        permasalahanOKUMasy: data.permasalahan_oku_masy || data.permasalahanOKUMasy || false,
                        permasalahanPerusahaan: data.permasalahan_perusahaan || data.permasalahanPerusahaan || false,
                        permasalahanKwsHutan: data.permasalahan_kws_hutan || data.permasalahanKwsHutan || false,
                        permasalahanMHA: data.permasalahan_mha || data.permasalahanMHA || false,
                        permasalahanInstansi: data.permasalahan_instansi || data.permasalahanInstansi || false,
                        permasalahanLainLain: data.permasalahan_lain_lain || data.permasalahanLainLain || false,
                        totalKasus: data.total_kasus || data.totalKasus || 0,
                        deskripsiPermasalahan: data.deskripsi_permasalahan || data.deskripsiPermasalahan || '',
                        tindakLanjut: data.tindak_lanjut || data.tindakLanjut || '',
                        rekomendasi: data.rekomendasi || ''
                    };
                });
                
                if (firebaseData.length > 0) {
                    window.dashboardData = firebaseData;
                    console.log(`✅ Firebase data loaded: ${firebaseData.length} records`);
                } else {
                    throw new Error('No Firebase data available');
                }
            } catch (firebaseError) {
                console.warn('⚠️ Firebase loading failed, falling back to data.js:', firebaseError);
                throw firebaseError; // Force fallback
            }
        }
        
        // Fallback to data.js if Firebase fails or not available (same as script.js)
        if (!window.dashboardData || window.dashboardData.length === 0) {
            console.log('📁 Loading data from data.js...');
            
            // Wait for data.js to load (same as script.js)
            let attempts = 0;
            while (!window.dashboardData && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (!window.dashboardData || window.dashboardData.length === 0) {
                throw new Error('No data available from data.js');
            }
            
            console.log(`✅ Data.js loaded: ${window.dashboardData.length} records`);
        }
        
        // Ensure data structure is correct (same as script.js)
        console.log('🔍 Validating data structure...');
        const sampleData = window.dashboardData[0];
        console.log('📊 Sample data structure:', sampleData);
        
        // Validate required fields (same as script.js)
        const requiredFields = ['provinsi', 'kabupaten', 'upt', 'jmlKK', 'bebanTugasSHM'];
        const missingFields = requiredFields.filter(field => !sampleData.hasOwnProperty(field));
        
        if (missingFields.length > 0) {
            console.warn('⚠️ Missing fields in data:', missingFields);
            console.log('🔧 Attempting to fix data structure...');
            
            // Fix common field mapping issues (same as script.js)
            window.dashboardData = window.dashboardData.map(item => ({
                ...item,
                upt: item.upt || item.upt || '',
                jmlKK: item.jmlKK || item.jumlah_kk || 0,
                bebanTugasSHM: item.bebanTugasSHM || item.beban_tugas_shm || 0,
                tahunPatan: item.tahunPatan || item.tahun_patan || '',
                tahunSerah: item.tahunSerah || item.tahun_serah || ''
            }));
        }
        
        console.log('✅ Data validation completed successfully');
        console.log(`📊 Final data count: ${window.dashboardData.length} records`);
        
        // Create charts with real data
        createCharts();
        
        // Update summary stats with real data
        updateSummaryStats();
        
        // Update last updated timestamp
        updateLastUpdated();
        
        // Update data summary display
        updateDataSummary();
        
        // Setup navigation menu
        setupNavigationMenu();
        
        // Initialize sidebar integration
        if (typeof initSidebar === 'function') {
            initSidebar();
        }
        
        console.log('✅ Analytics initialized successfully with', window.dashboardData.length, 'records');
    } catch (error) {
        console.error('❌ Error initializing analytics:', error);
        alert('Gagal memuat data dari database. Cek console untuk detail.');
    }
}

// Create all charts with real data
function createCharts() {
    console.log('Creating charts with real data...');
    
    try {
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('❌ Chart.js not loaded');
            return;
        }
        
        // Check if we have data
        if (!window.dashboardData || window.dashboardData.length === 0) {
            console.error('❌ No data available for charts');
            return;
        }
        
        createProblemChart();
        createProvinceChart();
        createTimelineChart();
        createStatusChart();
        console.log('✅ All charts created successfully with real data');
    } catch (error) {
        console.error('❌ Error creating charts:', error);
    }
}

// Create Problem Distribution Chart with real data
function createProblemChart() {
    const canvas = document.getElementById('problemChart');
    if (!canvas) {
        console.error('Canvas problemChart not found');
        return;
    }
    
    // Calculate real problem distribution from window.dashboardData
    const problemCounts = {
        'Kws Hutan': 0,
        'Perusahaan': 0,
        'MHA': 0,
        'Masyarakat': 0,
        'Instansi': 0,
        'Lain-lain': 0
    };

    window.dashboardData.forEach(location => {
        if (location.permasalahanKwsHutan) problemCounts['Kws Hutan']++;
        if (location.permasalahanPerusahaan) problemCounts['Perusahaan']++;
        if (location.permasalahanMHA) problemCounts['MHA']++;
        if (location.permasalahanOKUMasy) problemCounts['Masyarakat']++;
        if (location.permasalahanInstansi) problemCounts['Instansi']++;
        if (location.permasalahanLainLain) problemCounts['Lain-lain']++;
    });

    const ctx = canvas.getContext('2d');
    charts.problemChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(problemCounts),
            datasets: [{
                data: Object.values(problemCounts),
                backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#6b7280'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            ...chartConfig.common,
            ...chartConfig.doughnut,
            plugins: {
                ...chartConfig.common.plugins,
                title: {
                    display: true,
                    text: 'Distribusi Permasalahan Tanah (Data Real)',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
    
    console.log('Problem chart created with real data:', problemCounts);
}

// Create Province Performance Chart with real data
function createProvinceChart() {
    const canvas = document.getElementById('provinceChart');
    if (!canvas) return;
    
    // Calculate real province performance from window.dashboardData
    const provinceData = {};
    
    window.dashboardData.forEach(location => {
        if (!provinceData[location.provinsi]) {
            provinceData[location.provinsi] = { locations: 0, kk: 0, shm: 0 };
        }
        provinceData[location.provinsi].locations++;
        provinceData[location.provinsi].kk += location.jmlKK || 0;
        provinceData[location.provinsi].shm += location.bebanTugasSHM || 0;
    });

    const provinces = Object.keys(provinceData);
    const locationCounts = provinces.map(p => provinceData[p].locations);
    const kkCounts = provinces.map(p => provinceData[p].kk);
    const shmCounts = provinces.map(p => provinceData[p].shm);
    
    const ctx = canvas.getContext('2d');
    charts.provinceChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: provinces,
            datasets: [{
                label: 'Jumlah Lokasi',
                data: locationCounts,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: '#3b82f6',
                borderWidth: 2
            }, {
                label: 'Total KK',
                data: kkCounts,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: '#10b981',
                borderWidth: 2
            }, {
                label: 'Total SHM',
                data: shmCounts,
                backgroundColor: 'rgba(245, 158, 11, 0.8)',
                borderColor: '#f59e0b',
                borderWidth: 2
            }]
        },
        options: {
            ...chartConfig.common,
            ...chartConfig.bar,
            plugins: {
                ...chartConfig.common.plugins,
                title: {
                    display: true,
                    text: 'Kinerja per Provinsi (Data Real)',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
    
    console.log('Province chart created with real data:', provinces.length, 'provinces');
}

// Create Timeline Chart with real data
function createTimelineChart() {
    const canvas = document.getElementById('timelineChart');
    if (!canvas) return;
    
    // Calculate real timeline data from window.dashboardData
    const tahunPatanData = {};
    const tahunSerahData = {};
    
    window.dashboardData.forEach(location => {
        if (location.tahunPatan) {
            const tahun = location.tahunPatan.split('/')[0];
            if (!tahunPatanData[tahun]) tahunPatanData[tahun] = 0;
            tahunPatanData[tahun]++;
        }
        if (location.tahunSerah) {
            if (!tahunSerahData[location.tahunSerah]) tahunSerahData[location.tahunSerah] = 0;
            tahunSerahData[location.tahunSerah]++;
        }
    });

    const allYears = [...new Set([...Object.keys(tahunPatanData), ...Object.keys(tahunSerahData)])].sort();
    const patanData = allYears.map(year => tahunPatanData[year] || 0);
    const serahData = allYears.map(year => tahunSerahData[year] || 0);
    
    const ctx = canvas.getContext('2d');
    charts.timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allYears,
            datasets: [{
                label: 'Tahun Patan',
                data: patanData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Tahun Serah',
                data: serahData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...chartConfig.common,
            ...chartConfig.line,
            plugins: {
                ...chartConfig.common.plugins,
                title: {
                    display: true,
                    text: 'Timeline Proyek (Data Real)',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
    
    console.log('Timeline chart created with real data:', allYears.length, 'years');
}

// Create Status Distribution Chart with real data
function createStatusChart() {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    
    // Calculate real status distribution from window.dashboardData
    const statusBinaData = {
        'Bina - Belum HPL': 0,
        'Bina - Sudah HPL': 0,
        'Bina - Tidak HPL': 0
    };
    const statusSerahData = {
        'Serah - Sudah HPL': 0,
        'Serah - SK Serah': 0
    };

    window.dashboardData.forEach(location => {
        if (location.statusBinaBlmHPL) statusBinaData['Bina - Belum HPL']++;
        if (location.statusBinaSdhHPL) statusBinaData['Bina - Sudah HPL']++;
        if (location.statusBinaTdkHPL) statusBinaData['Bina - Tidak HPL']++;
        if (location.statusSerahSdhHPL) statusSerahData['Serah - Sudah HPL']++;
        if (location.statusSerahSKSerah) statusSerahData['Serah - SK Serah']++;
    });

    const allStatusLabels = [...Object.keys(statusBinaData), ...Object.keys(statusSerahData)];
    const allStatusData = [...Object.values(statusBinaData), ...Object.values(statusSerahData)];
    
    const ctx = canvas.getContext('2d');
    charts.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: allStatusLabels,
            datasets: [{
                data: allStatusData,
                backgroundColor: ['#ef4444', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            ...chartConfig.common,
            ...chartConfig.doughnut,
            plugins: {
                ...chartConfig.common.plugins,
                title: {
                    display: true,
                    text: 'Distribusi Status (Data Real)',
                    font: { size: 16, weight: 'bold' }
                }
            }
        }
    });
    
    console.log('Status chart created with real data:', allStatusLabels);
}

// Update summary statistics with real data
function updateSummaryStats() {
    try {
        if (typeof window.dashboardData === 'undefined') {
            console.error('window.dashboardData not available for summary stats');
            return;
        }
    
    // Calculate totals from real window.dashboardData
    const totalLocations = window.dashboardData.length;
    const totalKK = window.dashboardData.reduce((sum, location) => sum + (location.jmlKK || 0), 0);
    const totalSHM = window.dashboardData.reduce((sum, location) => sum + (location.bebanTugasSHM || 0), 0);
    const totalKasus = window.dashboardData.reduce((sum, location) => sum + (location.totalKasus || 0), 0);

        // Update DOM elements with real data
        document.getElementById('totalLocations').textContent = totalLocations.toLocaleString();
        document.getElementById('totalKK').textContent = totalKK.toLocaleString();
        document.getElementById('totalSHM').textContent = totalSHM.toLocaleString();
        document.getElementById('totalKasus').textContent = totalKasus.toLocaleString();
        
        console.log('Summary stats updated with real data:', {
            totalLocations,
            totalKK,
            totalSHM,
            totalKasus
        });
    } catch (error) {
        console.error('Error updating summary stats:', error);
    }
}

// Update last updated timestamp
function updateLastUpdated() {
    try {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.getElementById('lastUpdated').textContent = now.toLocaleDateString('id-ID', options);
    } catch (error) {
        console.error('Error updating timestamp:', error);
    }
}

// Update data summary display with static information
function updateDataSummary() {
    try {
        if (typeof window.dashboardData === 'undefined') {
            console.error('window.dashboardData not available for data summary');
            return;
        }

        // Get unique provinces count
        const uniqueProvinces = new Set(window.dashboardData.map(location => location.provinsi));
        const totalProvinces = uniqueProvinces.size;

        // Get year range from tahunPatan and tahunSerah
        let allYears = [];
        dashboardData.forEach(location => {
            if (location.tahunPatan) {
                const years = location.tahunPatan.split('/');
                allYears.push(...years.map(y => parseInt(y)).filter(y => !isNaN(y)));
            }
            if (location.tahunSerah) {
                allYears.push(parseInt(location.tahunSerah));
            }
        });
        
        const minYear = Math.min(...allYears.filter(y => !isNaN(y)));
        const maxYear = Math.max(...allYears.filter(y => !isNaN(y)));

        // Update display elements
        const totalLocationsDisplay = document.getElementById('totalLocationsDisplay');
        const totalProvincesDisplay = document.getElementById('totalProvincesDisplay');
        const minYearDisplay = document.getElementById('minYearDisplay');
        const maxYearDisplay = document.getElementById('maxYearDisplay');

        if (totalLocationsDisplay) totalLocationsDisplay.textContent = window.dashboardData.length;
        if (totalProvincesDisplay) totalProvincesDisplay.textContent = totalProvinces;
        if (minYearDisplay) minYearDisplay.textContent = minYear;
        if (maxYearDisplay) maxYearDisplay.textContent = maxYear;

        console.log('Data summary updated:', {
            totalLocations: window.dashboardData.length,
            totalProvinces,
            yearRange: `${minYear}-${maxYear}`
        });
    } catch (error) {
        console.error('Error updating data summary:', error);
    }
}

// Setup navigation menu for Ultimate Dashboard
function setupNavigationMenu() {
    console.log('Setting up Ultimate Dashboard navigation menu...');
    
    try {
        // Get all navigation items
        const navItems = document.querySelectorAll('.nav-item-ultimate');
        console.log('Found navigation items:', navItems.length);
        
        navItems.forEach((item, index) => {
            console.log(`Setting up nav item ${index + 1}:`, item.querySelector('span')?.textContent);
            
            // Add click event listener
            item.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Navigation item clicked:', this.querySelector('span')?.textContent);
                
                // Remove active class from all items
                document.querySelectorAll('.nav-item-ultimate').forEach(nav => {
                    nav.classList.remove('active');
                });
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Handle navigation
                const text = this.querySelector('span')?.textContent;
                console.log('Navigation text:', text);
                
                if (text === 'Dashboard') {
                    console.log('Redirecting to dashboard...');
                    window.location.href = 'index.html';
                } else if (text === 'Analytics') {
                    console.log('Already on analytics page');
                } else if (text === 'Pencarian') {
                    console.log('Redirecting to search page...');
                    window.location.href = 'search.html';
                } else if (text === 'Data') {
                    console.log('Redirecting to data page...');
                    window.location.href = 'data.html';
                } else if (text === 'Admin Users') {
                    console.log('Redirecting to admin users page...');
                    window.location.href = 'admin-users.html';
                }
            });
            
            console.log(`Navigation item ${index + 1} setup complete`);
        });
        
        console.log('Ultimate Dashboard navigation menu setup complete');
        
    } catch (error) {
        console.error('Error setting up navigation menu:', error);
    }
}

// Toggle chart type
function toggleChartType(chartId) {
    const chart = charts[chartId];
    if (!chart) return;

    const currentType = chart.config.type;
    let newType = 'bar';

    switch (currentType) {
        case 'bar': newType = 'line'; break;
        case 'line': newType = 'doughnut'; break;
        case 'doughnut': newType = 'pie'; break;
        case 'pie': newType = 'bar'; break;
    }

    chart.config.type = newType;
    chart.update();
}

// Export chart
function exportChart(chartId) {
    const chart = charts[chartId];
    if (!chart) return;
    
    const canvas = chart.canvas;
    const link = document.createElement('a');
    link.download = `${chartId}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing analytics with real data...');
    
    // Debug first
    setTimeout(() => {
        debugAnalytics();
    }, 1000);
    
    // Then initialize
    setTimeout(() => {
        initAnalytics();
    }, 1500);
});

// User dropdown functions
function toggleUserDropdown() {
    console.log('Toggle user dropdown clicked');
    // This will be handled by the main dashboard system
}

// Export functions for global access
window.analyticsUtils = {
    toggleChartType,
    exportChart,
    toggleUserDropdown
};

// Make functions globally available
window.toggleChartType = toggleChartType;
window.exportChart = exportChart;
window.toggleUserDropdown = toggleUserDropdown;
window.debugAnalytics = debugAnalytics;

