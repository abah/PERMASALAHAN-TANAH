// Dashboard Data - Import dari file data.js
// Data sekarang disimpan di file terpisah untuk maintainability yang lebih baik

// Global variables
let currentLocationId = null; // Tidak ada lokasi default, tampilkan global view
let filteredData = []; // Data yang sudah difilter
let selectedSidebarLocation = null; // Lokasi yang dipilih di sidebar
let activeFilters = {}; // Filter yang sedang aktif

// DOM Elements
const locationList = document.getElementById('locationList');
const currentLocationElement = document.getElementById('currentLocation');
const currentYearElement = document.getElementById('currentYear');
const totalKKElement = document.getElementById('totalKK');
const totalSHMElement = document.getElementById('totalSHM');
const totalKasusElement = document.getElementById('totalKasus');
const problemDescriptionElement = document.getElementById('problemDescription');
const followupActionElement = document.getElementById('followupAction');
const recommendationElement = document.getElementById('recommendation');
const binaBlmHPLElement = document.getElementById('binaBlmHPL');
const binaSdhHPLElement = document.getElementById('binaSdhHPL');
const binaTdkHPLElement = document.getElementById('binaTdkHPL');
const serahSdhHPLElement = document.getElementById('serahSdhHPL');
const serahSKSerahElement = document.getElementById('serahSKSerah');
const analysisChartElement = document.getElementById('analysisChart');

// Initialize the dashboard dengan Firebase
async function initDashboard() {
    try {
        console.log('🚀 Initializing dashboard...');
        
        // Check if Firebase is available
        if (window.db) {
            console.log('🔥 Firebase available, loading data...');
            try {
                // Load data dari Firebase
                const snapshot = await window.db.collection('transmigrasi').get();
                const firebaseData = snapshot.docs.map(doc => {
                    const data = doc.data();
                    // Convert Firebase data back to original format
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
        
        // Fallback to data.js if Firebase fails or not available
        if (!window.dashboardData || window.dashboardData.length === 0) {
            console.log('📁 Loading data from data.js...');
            
            // Wait for data.js to load
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
        
        // Ensure data structure is correct
        console.log('🔍 Validating data structure...');
        const sampleData = window.dashboardData[0];
        console.log('📊 Sample data structure:', sampleData);
        
        // Validate required fields
        const requiredFields = ['provinsi', 'kabupaten', 'upt', 'jmlKK', 'bebanTugasSHM'];
        const missingFields = requiredFields.filter(field => !sampleData.hasOwnProperty(field));
        
        if (missingFields.length > 0) {
            console.warn('⚠️ Missing fields in data:', missingFields);
            console.log('🔧 Attempting to fix data structure...');
            
            // Fix common field mapping issues
            window.dashboardData = window.dashboardData.map(item => ({
                ...item,
                upt: item.upt || item.upt || '',
                jmlKK: item.jmlKK || item.jumlah_kk || 0,
                bebanTugasSHM: item.bebanTugasSHM || item.beban_tugas_shm || 0,
                tahunPatan: item.tahunPatan || item.tahun_patan || '',
                tahunSerah: item.tahunSerah || item.tahun_serah || ''
            }));
        }
        
        // Initialize filtered data
        filteredData = [...window.dashboardData];
        
        console.log('📊 Data validation complete. Total records:', window.dashboardData.length);
        console.log('🔍 Available fields:', Object.keys(window.dashboardData[0]));
        
        // Update dashboard components
        console.log('🔄 Updating dashboard components...');
        
        // Debug data availability
        console.log('🔍 Debug: window.dashboardData available:', !!window.dashboardData);
        console.log('🔍 Debug: window.dashboardData length:', window.dashboardData ? window.dashboardData.length : 'undefined');
        if (window.dashboardData && window.dashboardData.length > 0) {
            console.log('🔍 Debug: Sample data:', window.dashboardData[0]);
        }
        
        populateLocationList();
        populateFilterOptions();
        updateGlobalDashboard();
        addEventListeners();
        
        // Initialize sidebar integration
        initializeSidebarIntegration();
        
        // Initialize charts
        initializeCharts();
        
        console.log('✅ Dashboard initialized successfully');
        
    } catch (error) {
        console.error('❌ Failed to initialize dashboard:', error);
        
        // Show user-friendly error message
        const errorMessage = error.message.includes('Firebase') ? 
            'Gagal memuat data dari Firebase. Mencoba data lokal...' :
            'Gagal memuat data. Cek console untuk detail.';
        
        alert(errorMessage);
        
        // Try to continue with any available data
        if (window.dashboardData && window.dashboardData.length > 0) {
            console.log('🔄 Attempting to continue with available data...');
            try {
                filteredData = [...window.dashboardData];
                populateLocationList();
                populateFilterOptions();
                updateGlobalDashboard();
                addEventListeners();
                initializeSidebarIntegration();
                initializeCharts();
                console.log('✅ Dashboard continued with available data');
            } catch (fallbackError) {
                console.error('❌ Fallback also failed:', fallbackError);
            }
        }
    }
}

// Calculate global statistics
function calculateGlobalStats(data = window.dashboardData) {
    const stats = {
        totalLocations: data.length,
        totalKK: data.reduce((sum, item) => sum + (item.jmlKK || 0), 0),
        totalSHM: data.reduce((sum, item) => sum + (item.bebanTugasSHM || 0), 0),
        totalKasus: data.reduce((sum, item) => sum + (item.totalKasus || 0), 0),
        uniqueProvinces: new Set(data.map(item => item.provinsi)).size,
        uniqueKabupatens: new Set(data.map(item => item.kabupaten)).size,
        yearRange: {
            min: Math.min(...data.map(item => parseInt(item.tahunPatan) || 0).filter(year => year > 0)),
            max: Math.max(...data.map(item => parseInt(item.tahunPatan) || 0).filter(year => year > 0))
        }
    };
    
    return stats;
}

// Calculate province statistics
function calculateProvinceStats(data = window.dashboardData) {
    const provinceMap = {};
    
    data.forEach(item => {
        if (!provinceMap[item.provinsi]) {
            provinceMap[item.provinsi] = {
                provinsi: item.provinsi,
                locations: 0,
                totalKK: 0,
                totalSHM: 0,
                totalKasus: 0
            };
        }
        
        provinceMap[item.provinsi].locations++;
        provinceMap[item.provinsi].totalKK += item.jmlKK || 0;
        provinceMap[item.provinsi].totalSHM += item.bebanTugasSHM || 0;
        provinceMap[item.provinsi].totalKasus += item.totalKasus || 0;
    });
    
    return Object.values(provinceMap).sort((a, b) => b.totalKasus - a.totalKasus);
}

// Calculate problem statistics
function calculateProblemStats(data = window.dashboardData) {
    return {
        kwsHutan: data.filter(item => item.permasalahanKwsHutan).length,
        perusahaan: data.filter(item => item.permasalahanPerusahaan).length,
        masyarakat: data.filter(item => item.permasalahanOKUMasy).length,
        mha: data.filter(item => item.permasalahanMHA).length,
        instansi: data.filter(item => item.permasalahanInstansi).length,
        lainLain: data.filter(item => item.permasalahanLainLain).length
    };
}

// Calculate status statistics
function calculateStatusStats(data = window.dashboardData) {
    return {
        binaBlmHPL: data.filter(item => item.statusBinaBlmHPL).length,
        binaSdhHPL: data.filter(item => item.statusBinaSdhHPL).length,
        binaTdkHPL: data.filter(item => item.statusBinaTdkHPL).length,
        serahSdhHPL: data.filter(item => item.statusSerahSdhHPL).length,
        serahSKSerah: data.filter(item => item.statusSerahSKSerah).length
    };
}

// Update global dashboard
function updateGlobalDashboard() {
    try {
        console.log('🔄 Updating global dashboard...');
        
        if (!window.dashboardData || window.dashboardData.length === 0) {
            console.warn('⚠️ No dashboard data available for update');
            return;
        }
        
        const data = filteredData.length > 0 ? filteredData : window.dashboardData;
        console.log(`📊 Using ${data.length} records for dashboard update`);
        
        const stats = calculateGlobalStats(data);
        const problemStats = calculateProblemStats(data);
        const statusStats = calculateStatusStats(data);
        const provinceStats = calculateProvinceStats(data);
        
        console.log('📈 Calculated stats:', { stats, problemStats, statusStats, provinceStats });
        
        // Update header information
        if (currentLocationId) {
            console.log('📍 Updating dashboard for specific location:', currentLocationId);
            const selectedLocation = window.dashboardData.find(loc => loc.id === currentLocationId);
            
            if (selectedLocation) {
                // Update header
                if (currentLocationElement) currentLocationElement.textContent = selectedLocation.kabupaten;
                if (currentYearElement) currentYearElement.textContent = selectedLocation.tahunPatan;
                
                // Update summary cards for selected location
                if (totalKKElement) totalKKElement.textContent = (selectedLocation.jmlKK || 0).toLocaleString();
                if (totalSHMElement) totalSHMElement.textContent = (selectedLocation.bebanTugasSHM || 0).toLocaleString();
                if (totalKasusElement) totalKasusElement.textContent = selectedLocation.totalKasus || 0;
                
                // Update problem description with selected location data
                if (problemDescriptionElement) {
                    problemDescriptionElement.innerHTML = `
                        <div class="problem-stats">
                            <h4>Permasalahan di ${selectedLocation.kabupaten}:</h4>
                            <div class="problem-detail">
                                <strong>Deskripsi Permasalahan:</strong>
                                <p>${selectedLocation.deskripsiPermasalahan || 'Tidak ada deskripsi'}</p>
                            </div>
                            <div class="problem-types">
                                <h5>Jenis Permasalahan:</h5>
                                <div class="problem-grid">
                                    <div class="problem-item">
                                        <span class="problem-label">Kawasan Hutan:</span>
                                        <span class="problem-value">${selectedLocation.permasalahanKwsHutan ? 'Ya' : 'Tidak'}</span>
                                    </div>
                                    <div class="problem-item">
                                        <span class="problem-label">Perusahaan:</span>
                                        <span class="problem-value">${selectedLocation.permasalahanPerusahaan ? 'Ya' : 'Tidak'}</span>
                                    </div>
                                    <div class="problem-item">
                                        <span class="problem-label">Masyarakat:</span>
                                        <span class="problem-value">${selectedLocation.permasalahanOKUMasy ? 'Ya' : 'Tidak'}</span>
                                    </div>
                                    <div class="problem-item">
                                        <span class="problem-label">MHA:</span>
                                        <span class="problem-value">${selectedLocation.permasalahanMHA ? 'Ya' : 'Tidak'}</span>
                                    </div>
                                    <div class="problem-item">
                                        <span class="problem-label">Instansi:</span>
                                        <span class="problem-value">${selectedLocation.permasalahanInstansi ? 'Ya' : 'Tidak'}</span>
                                    </div>
                                    <div class="problem-item">
                                        <span class="problem-label">Lain-lain:</span>
                                        <span class="problem-value">${selectedLocation.permasalahanLainLain ? 'Ya' : 'Tidak'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                
                // Update follow-up action with selected location data
                if (followupActionElement) {
                    followupActionElement.innerHTML = `
                        <div class="tindak-lanjut-detail">
                            <h4>Tindak Lanjut di ${selectedLocation.kabupaten}:</h4>
                            <div class="tindak-lanjut-content">
                                <p>${selectedLocation.tindakLanjut || 'Tidak ada tindak lanjut'}</p>
                            </div>
                        </div>
                    `;
                }
                
                // Update recommendation with selected location data
                if (recommendationElement) {
                    recommendationElement.innerHTML = `
                        <div class="rekomendasi-detail">
                            <h4>Rekomendasi untuk ${selectedLocation.kabupaten}:</h4>
                            <div class="rekomendasi-content">
                                <p>${selectedLocation.rekomendasi || 'Tidak ada rekomendasi'}</p>
                            </div>
                        </div>
                    `;
                }
                
                console.log('✅ Dashboard updated for specific location');
                
            } else {
                console.warn('⚠️ Selected location not found, falling back to global view');
                currentLocationId = null;
                updateGlobalDashboard(); // Recursive call for global view
                return;
            }
            
        } else {
            // Global overview
            console.log('🌍 Updating dashboard for global overview');
            
            if (currentLocationElement) currentLocationElement.textContent = `Overview Nasional`;
            if (currentYearElement) currentYearElement.textContent = `${stats.yearRange.min} - ${stats.yearRange.max}`;
            
            // Update summary cards
            if (totalKKElement) totalKKElement.textContent = stats.totalKK.toLocaleString();
            if (totalSHMElement) totalSHMElement.textContent = stats.totalSHM.toLocaleString();
            if (totalKasusElement) totalKasusElement.textContent = stats.totalKasus;
            
            // Update problem description with statistics
            if (problemDescriptionElement) {
                problemDescriptionElement.innerHTML = `
                    <div class="problem-stats">
                        <h4>Distribusi Permasalahan Nasional:</h4>
                        <div class="problem-grid">
                            <div class="problem-item">
                                <span class="problem-label">Kawasan Hutan:</span>
                                <span class="problem-value">${problemStats.kwsHutan} lokasi</span>
                            </div>
                            <div class="problem-item">
                                <span class="problem-label">Perusahaan:</span>
                                <span class="problem-value">${problemStats.perusahaan} lokasi</span>
                            </div>
                            <div class="problem-item">
                                <span class="problem-label">Masyarakat:</span>
                                <span class="problem-value">${problemStats.masyarakat} lokasi</span>
                            </div>
                            <div class="problem-item">
                                <span class="problem-label">MHA:</span>
                                <span class="problem-value">${problemStats.mha} lokasi</span>
                            </div>
                            <div class="problem-item">
                                <span class="problem-label">Instansi:</span>
                                <span class="problem-value">${problemStats.instansi} lokasi</span>
                            </div>
                            <div class="problem-item">
                                <span class="problem-label">Lain-lain:</span>
                                <span class="problem-value">${problemStats.lainLain} lokasi</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Update follow-up action with province summary
            if (followupActionElement) {
                followupActionElement.innerHTML = `
                    <div class="province-summary">
                        <h4>Top 5 Provinsi dengan Kasus Terbanyak:</h4>
                        <div class="province-list">
                            ${provinceStats.slice(0, 5).map(prov => `
                                <div class="province-item">
                                    <span class="province-name">${prov.provinsi}</span>
                                    <span class="province-stats">
                                        ${prov.locations} lokasi, ${prov.totalKasus} kasus
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Update recommendation with status summary
            if (recommendationElement) {
                recommendationElement.innerHTML = `
                    <div class="status-summary">
                        <h4>Status HPL Summary:</h4>
                        <div class="status-grid">
                            <div class="status-item">
                                <span class="status-label">Belum HPL:</span>
                                <span class="status-value">${statusStats.binaBlmHPL} lokasi</span>
                            </div>
                            <div class="status-item">
                                <span class="status-label">Sudah HPL:</span>
                                <span class="status-value">${statusStats.binaSdhHPL} lokasi</span>
                            </div>
                            <div class="status-item">
                                <span class="status-label">Tidak HPL:</span>
                                <span class="status-value">${statusStats.binaTdkHPL} lokasi</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            console.log('✅ Dashboard updated for global overview');
        }
        
        // Update status values
        updateStatusValues(statusStats);
        
        // Update analysis chart
        updateAnalysisChart(problemStats, provinceStats);
        
        console.log('✅ Global dashboard update completed');
        
    } catch (error) {
        console.error('❌ Error updating global dashboard:', error);
    }
}

// Update status values
function updateStatusValues(statusStats) {
    // Status Bina
    binaBlmHPLElement.textContent = `${statusStats.binaBlmHPL} lokasi`;
    binaBlmHPLElement.className = `status-value ${statusStats.binaBlmHPL > 0 ? 'active' : ''}`;
    
    binaSdhHPLElement.textContent = `${statusStats.binaSdhHPL} lokasi`;
    binaSdhHPLElement.className = `status-value ${statusStats.binaSdhHPL > 0 ? 'active' : ''}`;
    
    binaTdkHPLElement.textContent = `${statusStats.binaTdkHPL} lokasi`;
    binaTdkHPLElement.className = `status-value ${statusStats.binaTdkHPL > 0 ? 'active' : ''}`;
    
    // Status Serah
    serahSdhHPLElement.textContent = `${statusStats.serahSdhHPL} lokasi`;
    serahSdhHPLElement.className = `status-value ${statusStats.serahSdhHPL > 0 ? 'active' : ''}`;
    
    serahSKSerahElement.textContent = `${statusStats.serahSKSerah} lokasi`;
    serahSKSerahElement.className = `status-value ${statusStats.serahSKSerah > 0 ? 'active' : ''}`;
}

// Update analysis chart
function updateAnalysisChart(problemStats, provinceStats) {
    analysisChartElement.innerHTML = '';
    
    // Problem distribution chart
    const problemChart = document.createElement('div');
    problemChart.className = 'chart-section';
    problemChart.innerHTML = `
        <h4>Distribusi Permasalahan</h4>
        <div class="chart-container">
            ${Object.entries(problemStats).map(([key, value]) => {
                const percentage = Object.values(problemStats).reduce((sum, val) => sum + val, 0) > 0 
                    ? (value / Object.values(problemStats).reduce((sum, val) => sum + val, 0)) * 100 
                    : 0;
                return `
                    <div class="chart-item">
                        <div class="chart-label">${getProblemLabel(key)}</div>
                        <div class="chart-bar">
                            <div class="chart-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="chart-value">${value}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    analysisChartElement.appendChild(problemChart);
    
    // Top provinces chart
    const provinceChart = document.createElement('div');
    provinceChart.className = 'chart-section';
    provinceChart.innerHTML = `
        <h4>Top 5 Provinsi dengan Kasus Terbanyak</h4>
        <div class="chart-container">
            ${provinceStats.slice(0, 5).map((prov, index) => {
                const maxKasus = Math.max(...provinceStats.slice(0, 5).map(p => p.totalKasus));
                const percentage = maxKasus > 0 ? (prov.totalKasus / maxKasus) * 100 : 0;
                return `
                    <div class="chart-item">
                        <div class="chart-label">${prov.provinsi}</div>
                        <div class="chart-bar">
                            <div class="chart-fill" style="width: ${percentage}%"></div>
                        </div>
                        <div class="chart-value">${prov.totalKasus} kasus</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    analysisChartElement.appendChild(provinceChart);
}

// Helper function to get problem label
function getProblemLabel(key) {
    const labels = {
        kwsHutan: 'Kawasan Hutan',
        perusahaan: 'Perusahaan',
        masyarakat: 'Masyarakat',
        mha: 'MHA',
        instansi: 'Instansi',
        lainLain: 'Lain-lain'
    };
    return labels[key] || key;
}

// Populate filter options from data
function populateFilterOptions() {
    try {
        console.log('🔧 Populating filter options...');
        console.log('🔍 Debug: window.dashboardData:', window.dashboardData);
        console.log('🔍 Debug: window.dashboardData length:', window.dashboardData ? window.dashboardData.length : 'undefined');
        
        if (!window.dashboardData || window.dashboardData.length === 0) {
            console.warn('⚠️ No dashboard data available for filter options');
            return;
        }
        
        // Get unique values from data with validation
        const provinsiList = [...new Set(window.dashboardData.map(item => item.provinsi).filter(Boolean))];
        const kabupatenList = [...new Set(window.dashboardData.map(item => item.kabupaten).filter(Boolean))];
        const tahunPatanList = [...new Set(window.dashboardData.map(item => item.tahunPatan).filter(Boolean))];
        
        console.log(`📊 Filter options - Provinsi: ${provinsiList.length}, Kabupaten: ${kabupatenList.length}, Tahun: ${tahunPatanList.length}`);

        // Populate provinsi filter
        const provinsiFilter = document.getElementById('provinsiFilter');
        if (provinsiFilter) {
            provinsiFilter.innerHTML = '<option value="">Semua Provinsi</option>';
            provinsiList.sort().forEach(provinsi => {
                const option = document.createElement('option');
                option.value = provinsi;
                option.textContent = provinsi;
                provinsiFilter.appendChild(option);
            });
            console.log(`✅ Provinsi filter populated with ${provinsiList.length} options`);
        } else {
            console.warn('⚠️ Provinsi filter element not found');
        }

        // Populate kabupaten filter
        const kabupatenFilter = document.getElementById('kabupatenFilter');
        if (kabupatenFilter) {
            kabupatenFilter.innerHTML = '<option value="">Semua Kabupaten</option>';
            kabupatenList.sort().forEach(kabupaten => {
                const option = document.createElement('option');
                option.value = kabupaten;
                option.textContent = kabupaten;
                kabupatenFilter.appendChild(option);
            });
            console.log(`✅ Kabupaten filter populated with ${kabupatenList.length} options`);
        } else {
            console.warn('⚠️ Kabupaten filter element not found');
        }

        // Populate tahun patan filter
        const tahunPatanFilter = document.getElementById('tahunPatanFilter');
        if (tahunPatanFilter) {
            tahunPatanFilter.innerHTML = '<option value="">Semua Tahun</option>';
            tahunPatanList.sort((a, b) => a - b).forEach(tahun => {
                const option = document.createElement('option');
                option.value = tahun;
                option.textContent = tahun;
                tahunPatanFilter.appendChild(option);
            });
            console.log(`✅ Tahun Patan filter populated with ${tahunPatanList.length} options`);
        } else {
            console.warn('⚠️ Tahun Patan filter element not found');
        }
        
        console.log('✅ Filter options populated successfully');
        
    } catch (error) {
        console.error('❌ Error populating filter options:', error);
    }
}

// Update kabupaten options based on selected provinsi
function updateKabupatenOptions() {
    try {
        console.log('🔄 Updating kabupaten options...');
        
        const selectedProvinsi = document.getElementById('provinsiFilter')?.value;
        const kabupatenFilter = document.getElementById('kabupatenFilter');
        
        if (!kabupatenFilter) {
            console.warn('⚠️ Kabupaten filter element not found');
            return;
        }
        
        // Clear current options
        kabupatenFilter.innerHTML = '<option value="">Semua Kabupaten</option>';
        
        if (selectedProvinsi) {
            // Get kabupaten for selected provinsi
            const filteredKabupaten = [...new Set(
                window.dashboardData
                    .filter(item => item.provinsi === selectedProvinsi)
                    .map(item => item.kabupaten)
                    .filter(Boolean)
            )];
            
            filteredKabupaten.sort().forEach(kabupaten => {
                const option = document.createElement('option');
                option.value = kabupaten;
                option.textContent = kabupaten;
                kabupatenFilter.appendChild(option);
            });
            
            console.log(`✅ Kabupaten options updated for ${selectedProvinsi}: ${filteredKabupaten.length} options`);
        } else {
            // Show all kabupaten
            const allKabupaten = [...new Set(window.dashboardData.map(item => item.kabupaten).filter(Boolean))];
            allKabupaten.sort().forEach(kabupaten => {
                const option = document.createElement('option');
                option.value = kabupaten;
                option.textContent = kabupaten;
                kabupatenFilter.appendChild(option);
            });
            
            console.log(`✅ All kabupaten options restored: ${allKabupaten.length} options`);
        }
        
        // Reset kabupaten selection
        kabupatenFilter.value = '';
        
        // Apply filters
        applyFilters();
        
    } catch (error) {
        console.error('❌ Error updating kabupaten options:', error);
    }
}

// Populate location list in sidebar
function populateLocationList() {
    try {
        console.log('🔧 Populating location list...');
        
        if (!locationList) {
            console.log('⚠️ Location list element not found, skipping...');
            return;
        }
        
        if (!window.dashboardData || window.dashboardData.length === 0) {
            console.warn('⚠️ No dashboard data available for location list');
            locationList.innerHTML = '<div class="no-locations">Tidak ada data lokasi</div>';
            return;
        }
        
        locationList.innerHTML = '';
        
        // Get unique locations (limit to 20 for performance)
        const uniqueLocations = [...new Set(window.dashboardData.map(item => item.kabupaten))].slice(0, 20);
        
        uniqueLocations.forEach(location => {
            const locationItem = document.createElement('div');
            locationItem.className = `location-item ${location === currentLocationId ? 'active' : ''}`;
            locationItem.innerHTML = location;
            locationItem.dataset.id = location;
            
            locationItem.addEventListener('click', () => {
                filterByLocation(location);
            });
            
            locationList.appendChild(locationItem);
        });
        
        console.log(`✅ Location list populated with ${uniqueLocations.length} locations`);
        
    } catch (error) {
        console.error('❌ Error populating location list:', error);
    }
}

// Filter by specific location
function filterByLocation(locationId) {
    currentLocationId = locationId;
    
    // Update active state in location list
    document.querySelectorAll('.location-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-id="${locationId}"]`).classList.add('active');
    
    // Filter data to show only selected location
    filteredData = dashboardData.filter(item => item.id === locationId);
    
    // Update dashboard with filtered data
    updateGlobalDashboard();
    
    // Update filter header
    const location = dashboardData.find(loc => loc.id === locationId);
    const filterHeader = document.querySelector('.filter-header h2');
    filterHeader.textContent = `Filter Data (${location.kabupaten})`;
    filterHeader.style.color = '#3b82f6';
}

// Add fade-in animation to cards
function addFadeInAnimation() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = `fadeIn 0.5s ease-in ${index * 0.1}s both`;
    });
}

// Add event listeners
function addEventListeners() {
    // Filter change listeners
    document.getElementById('provinsiFilter')?.addEventListener('change', applyFilters);
    document.getElementById('kabupatenFilter')?.addEventListener('change', applyFilters);
    document.getElementById('tahunPatanFilter')?.addEventListener('change', applyFilters);
    document.getElementById('statusBinaFilter')?.addEventListener('change', applyFilters);
    document.getElementById('statusSerahFilter')?.addEventListener('change', applyFilters);
    document.getElementById('permasalahanFilter')?.addEventListener('change', applyFilters);

    // User profile dropdown functionality
    setupUserProfileDropdown();
    
    // Clear filters button
    document.querySelector('.btn-clear-filters')?.addEventListener('click', clearAllFilters);
    
    // Export button
    document.querySelector('.btn-export-filtered')?.addEventListener('click', exportFilteredData);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', handleOutsideClick);
}

// Setup user profile dropdown
function setupUserProfileDropdown() {
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (!userProfileBtn || !userDropdown) {
        console.warn('⚠️ User profile elements not found');
        return;
    }
    
    // Toggle dropdown
    userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleUserDropdown();
    });
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }
    
    // Profile and settings links
    const profileLink = document.getElementById('profileLink');
    const settingsLink = document.getElementById('settingsLink');
    
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            showProfileModal();
        });
    }
    
    if (settingsLink) {
        settingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            showSettingsModal();
        });
    }
    
    // Update user info
    updateUserInfo();
}

// Toggle user dropdown
function toggleUserDropdown() {
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (!userProfileBtn || !userDropdown) return;
    
    const isOpen = userDropdown.classList.contains('show');
    
    if (isOpen) {
        userDropdown.classList.remove('show');
        userProfileBtn.classList.remove('active');
    } else {
        userDropdown.classList.add('show');
        userProfileBtn.classList.add('active');
    }
}

// Close dropdown when clicking outside
function handleOutsideClick(event) {
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (!userProfileBtn || !userDropdown) return;
    
    if (!userProfileBtn.contains(event.target) && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove('show');
        userProfileBtn.classList.remove('active');
    }
}

// Update user information
function updateUserInfo() {
    // Get user info from Firebase Auth or localStorage
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // Update user name in header
        const userName = document.getElementById('userName');
        const userFullName = document.getElementById('userFullName');
        const userEmail = document.getElementById('userEmail');
        const userRole = document.getElementById('userRole');
        
        if (userName) userName.textContent = currentUser.displayName || currentUser.email || 'User';
        if (userFullName) userFullName.textContent = currentUser.displayName || 'User Name';
        if (userEmail) userEmail.textContent = currentUser.email || 'user@example.com';
        if (userRole) userRole.textContent = currentUser.role || 'Administrator';
    }
}

// Get current user info
function getCurrentUser() {
    // Try to get from Firebase Auth first
    if (window.firebaseAuth && window.firebaseAuth.currentUser) {
        return {
            displayName: window.firebaseAuth.currentUser.displayName,
            email: window.firebaseAuth.currentUser.email,
            role: 'Administrator' // Default role
        };
    }
    
    // Fallback to localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        try {
            return JSON.parse(userInfo);
        } catch (e) {
            console.warn('⚠️ Failed to parse user info from localStorage');
        }
    }
    
    // Return default user info
    return {
        displayName: 'User',
        email: 'user@example.com',
        role: 'Administrator'
    };
}

// Handle logout
function handleLogout() {
    try {
        console.log('🚪 Logging out...');
        
        // Show loading state
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            const originalText = logoutBtn.innerHTML;
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Logging out...</span>';
            logoutBtn.style.pointerEvents = 'none';
        }
        
        // Firebase logout if available
        if (window.firebaseAuth) {
            window.firebaseAuth.signOut().then(() => {
                console.log('✅ Firebase logout successful');
                performLogout();
            }).catch((error) => {
                console.error('❌ Firebase logout failed:', error);
                performLogout();
            });
        } else {
            performLogout();
        }
        
    } catch (error) {
        console.error('❌ Logout error:', error);
        performLogout();
    }
}

// Perform logout actions
function performLogout() {
    try {
        // Clear user data
        localStorage.removeItem('userInfo');
        localStorage.removeItem('authToken');
        
        // Close dropdown
        const userDropdown = document.getElementById('userDropdown');
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userDropdown) userDropdown.classList.remove('show');
        if (userProfileBtn) userProfileBtn.classList.remove('active');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
        
        console.log('✅ Logout completed');
        
    } catch (error) {
        console.error('❌ Error during logout cleanup:', error);
        // Force redirect anyway
        window.location.href = 'login.html';
    }
}

// Show profile modal
function showProfileModal() {
    showModal('profile');
    // Close dropdown
    const userDropdown = document.getElementById('userDropdown');
    const userProfileBtn = document.getElementById('userProfileBtn');
    if (userDropdown) userDropdown.classList.remove('show');
    if (userProfileBtn) userProfileBtn.classList.remove('active');
}

// Show settings modal
function showSettingsModal() {
    showModal('settings');
    // Close dropdown
    const userDropdown = document.getElementById('userDropdown');
    const userProfileBtn = document.getElementById('userProfileBtn');
    if (userDropdown) userDropdown.classList.remove('show');
    if (userProfileBtn) userProfileBtn.classList.remove('active');
}

// Show modal
function showModal(type) {
    const modal = document.getElementById('userModal');
    const modalContent = document.getElementById('modalContent');
    
    if (!modal || !modalContent) {
        createModal();
    }
    
    const modalElement = document.getElementById('userModal');
    const contentElement = document.getElementById('modalContent');
    
    if (type === 'profile') {
        contentElement.innerHTML = getProfileModalContent();
        document.getElementById('modalTitle').textContent = 'User Profile';
    } else if (type === 'settings') {
        contentElement.innerHTML = getSettingsModalContent();
        document.getElementById('modalTitle').textContent = 'Settings';
    }
    
    modalElement.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Load user data
    loadUserDataForModal();
}

// Create modal if it doesn't exist
function createModal() {
    const modalHTML = `
        <div id="userModal" class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h2 id="modalTitle">Modal Title</h2>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="modalContent">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    const modalStyles = `
        <style>
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
            }
            
            .modal-container {
                background: white;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                animation: modalSlideIn 0.3s ease;
            }
            
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.5rem;
                border-bottom: 1px solid #e2e8f0;
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                color: white;
            }
            
            .modal-header h2 {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 8px;
                transition: background 0.2s ease;
            }
            
            .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .modal-body {
                padding: 1.5rem;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .form-group {
                margin-bottom: 1rem;
            }
            
            .form-label {
                display: block;
                font-weight: 500;
                color: #374151;
                margin-bottom: 0.5rem;
            }
            
            .form-input {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .form-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }
            
            .btn-secondary {
                background: #f1f5f9;
                color: #475569;
                border: 2px solid #e2e8f0;
            }
            
            .btn-secondary:hover {
                background: #e2e8f0;
            }
            
            .setting-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem 0;
                border-bottom: 1px solid #f1f5f9;
            }
            
            .setting-item:last-child {
                border-bottom: none;
            }
            
            .toggle-switch {
                position: relative;
                width: 50px;
                height: 24px;
                background: #cbd5e1;
                border-radius: 12px;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            
            .toggle-switch.active {
                background: #10b981;
            }
            
            .toggle-switch::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s ease;
            }
            
            .toggle-switch.active::after {
                transform: translateX(26px);
            }
            
            .btn-group {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Get profile modal content
function getProfileModalContent() {
    const currentUser = getCurrentUser();
    const isAdmin = currentUser && (currentUser.role === 'Administrator' || currentUser.role === 'admin');
    
    let adminSection = '';
    if (isAdmin) {
        adminSection = `
            <div class="form-group" style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                <label class="form-label" style="color: #1e3a8a; font-weight: 600;">
                    <i class="fas fa-shield-alt"></i> Admin Panel
                </label>
                <div style="margin-top: 1rem;">
                    <button type="button" class="btn btn-primary" onclick="openAdminUsers()" style="width: 100%; margin-bottom: 0.5rem;">
                        <i class="fas fa-users-cog"></i>
                        Manage Admin Users
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="openSystemSettings()" style="width: 100%;">
                        <i class="fas fa-cogs"></i>
                        System Settings
                    </button>
                </div>
            </div>
        `;
    }
    
    return `
        <form id="profileForm">
            <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" class="form-input" id="modalFirstName" placeholder="Enter first name">
            </div>
            
            <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" class="form-input" id="modalLastName" placeholder="Enter last name">
            </div>
            
            <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" id="modalEmail" placeholder="Enter email address" disabled>
            </div>
            
            <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-input" id="modalPhone" placeholder="Enter phone number">
            </div>
            
            <div class="form-group">
                <label class="form-label">Department</label>
                <input type="text" class="form-input" id="modalDepartment" placeholder="Enter department">
            </div>
            
            ${adminSection}
            
            <div class="btn-group">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i>
                    Save Changes
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    Cancel
                </button>
            </div>
        </form>
    `;
}

// Get settings modal content
function getSettingsModalContent() {
    return `
        <div class="settings-content">
            <div class="setting-item">
                <div>
                    <strong>Email Notifications</strong>
                    <div style="font-size: 0.9rem; color: #64748b;">Receive updates via email</div>
                </div>
                <div class="toggle-switch active" onclick="toggleModalSetting(this, 'emailNotifications')"></div>
            </div>
            
            <div class="setting-item">
                <div>
                    <strong>Push Notifications</strong>
                    <div style="font-size: 0.9rem; color: #64748b;">Show browser notifications</div>
                </div>
                <div class="toggle-switch" onclick="toggleModalSetting(this, 'pushNotifications')"></div>
            </div>
            
            <div class="setting-item">
                <div>
                    <strong>Auto Logout</strong>
                    <div style="font-size: 0.9rem; color: #64748b;">Automatically log out after inactivity</div>
                </div>
                <div class="toggle-switch active" onclick="toggleModalSetting(this, 'autoLogout')"></div>
            </div>
            
            <div class="setting-item">
                <div>
                    <strong>Dark Mode</strong>
                    <div style="font-size: 0.9rem; color: #64748b;">Use dark color scheme</div>
                </div>
                <div class="toggle-switch" onclick="toggleModalSetting(this, 'darkMode')"></div>
            </div>
            
            <div class="btn-group">
                <button type="button" class="btn btn-primary" onclick="saveModalSettings()">
                    <i class="fas fa-save"></i>
                    Save Settings
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    Cancel
                </button>
            </div>
        </div>
    `;
}

// Load user data for modal
function loadUserDataForModal() {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // Update profile form fields
        const firstName = document.getElementById('modalFirstName');
        const lastName = document.getElementById('modalLastName');
        const email = document.getElementById('modalEmail');
        const phone = document.getElementById('modalPhone');
        const department = document.getElementById('modalDepartment');
        
        if (firstName) firstName.value = currentUser.firstName || '';
        if (lastName) lastName.value = currentUser.lastName || '';
        if (email) email.value = currentUser.email || '';
        if (phone) phone.value = currentUser.phone || '';
        if (department) department.value = currentUser.department || '';
    }
    
    // Setup form handler
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveProfileData();
        });
    }
}

// Save profile data
function saveProfileData() {
    const formData = {
        firstName: document.getElementById('modalFirstName')?.value || '',
        lastName: document.getElementById('modalLastName')?.value || '',
        phone: document.getElementById('modalPhone')?.value || '',
        department: document.getElementById('modalDepartment')?.value || ''
    };
    
    // Validate form data
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
        alert('First name and last name are required');
        return;
    }
    
    // Save to localStorage
    const currentUser = getCurrentUser();
    const updatedUser = { ...currentUser, ...formData };
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    
    // Update UI
    updateUserInfo();
    
    // Show success message
    alert('Profile updated successfully!');
    closeModal();
}

// Toggle modal setting
function toggleModalSetting(toggleElement, settingKey) {
    toggleElement.classList.toggle('active');
    
    // Save to localStorage
    const settings = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    settings[settingKey] = toggleElement.classList.contains('active');
    localStorage.setItem('userPreferences', JSON.stringify(settings));
}

// Save modal settings
function saveModalSettings() {
    alert('Settings saved successfully!');
    closeModal();
}

// Open Admin Users page
function openAdminUsers() {
    closeModal();
    window.location.href = 'admin-users.html';
}

// Open System Settings
function openSystemSettings() {
    closeModal();
    showModal('settings');
}

// Apply filters to data
function applyFilters() {
    try {
        const provinsi = document.getElementById('provinsiFilter')?.value || '';
        const kabupaten = document.getElementById('kabupatenFilter')?.value || '';
        const tahunPatan = document.getElementById('tahunPatanFilter')?.value || '';
        const statusBina = document.getElementById('statusBinaFilter')?.value || '';
        const statusSerah = document.getElementById('statusSerahFilter')?.value || '';
        const permasalahan = document.getElementById('permasalahanFilter')?.value || '';

        // Update active filters
        activeFilters = {
            provinsi,
            kabupaten,
            tahunPatan,
            statusBina,
            statusSerah,
            permasalahan
        };

        console.log('🔍 Applying filters:', activeFilters);

        // Filter data based on selected criteria
        let filtered = [...window.dashboardData];

        // Apply dropdown filters
        filtered = filtered.filter(item => {
            let match = true;

            // Filter by provinsi
            if (provinsi && item.provinsi !== provinsi) match = false;

            // Filter by kabupaten (use kabupaten field directly)
            if (kabupaten && !item.kabupaten.includes(kabupaten)) match = false;

            // Filter by tahun patan
            if (tahunPatan && item.tahunPatan !== tahunPatan) match = false;

            // Filter by status bina
            if (statusBina) {
                switch (statusBina) {
                    case 'blmHPL':
                        if (!item.statusBinaBlmHPL) match = false;
                        break;
                    case 'sdhHPL':
                        if (!item.statusBinaSdhHPL) match = false;
                        break;
                    case 'tdkHPL':
                        if (!item.statusBinaTdkHPL) match = false;
                        break;
                }
            }

            // Filter by status serah
            if (statusSerah) {
                switch (statusSerah) {
                    case 'sdhHPL':
                        if (!item.statusSerahSdhHPL) match = false;
                        break;
                    case 'skSerah':
                        if (!item.statusSerahSKSerah) match = false;
                        break;
                }
            }

            // Filter by permasalahan
            if (permasalahan) {
                switch (permasalahan) {
                    case 'masyarakat':
                        if (!item.permasalahanOKUMasy) match = false;
                        break;
                    case 'perusahaan':
                        if (!item.permasalahanPerusahaan) match = false;
                        break;
                    case 'kwsHutan':
                        if (!item.permasalahanKwsHutan) match = false;
                        break;
                    case 'mha':
                        if (!item.permasalahanMHA) match = false;
                        break;
                    case 'instansi':
                        if (!item.permasalahanInstansi) match = false;
                        break;
                    case 'lainLain':
                        if (!item.permasalahanLainLain) match = false;
                        break;
                }
            }

            return match;
        });

        // Apply sidebar location filter if selected
        if (selectedSidebarLocation) {
            filtered = filtered.filter(item => item.kabupaten === selectedSidebarLocation);
            console.log(`📍 Filtering by sidebar location: ${selectedSidebarLocation}`);
        }

        // Update filtered data
        filteredData = filtered;

        console.log(`✅ Filters applied. Results: ${filteredData.length} records`);

        // Update all dashboard components
        updateDashboardWithFilters();
        
        // Update sidebar with filtered results
        updateSidebarWithFilteredResults(filteredData);
        
        // Show filter results count
        showFilterResults(filteredData.length);
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('dashboardUpdated', {
            detail: { filteredData, activeFilters, selectedSidebarLocation }
        }));
        
    } catch (error) {
        console.error('❌ Error applying filters:', error);
    }
}

// Update dashboard with current filters
function updateDashboardWithFilters() {
    console.log('🔄 Updating dashboard with filters...');
    
    if (filteredData.length === 0) {
        // Show no results state
        showNoResultsState();
        return;
    }

    // Update based on whether a specific location is selected
    if (selectedSidebarLocation) {
        // Show specific location data
        updateDashboardForSpecificLocation(filteredData);
    } else {
        // Show aggregated data for filtered results
        updateDashboardForFilteredResults(filteredData);
    }
}

// Update dashboard for specific location
function updateDashboardForSpecificLocation(locationData) {
    console.log('📍 Updating dashboard for specific location...');
    
    // Update summary cards
    const totalKK = locationData.reduce((sum, item) => sum + (item.jmlKK || 0), 0);
    const totalSHM = locationData.reduce((sum, item) => sum + (item.bebanTugasSHM || 0), 0);
    const totalKasus = locationData.length;

    updateElement('totalKK', totalKK.toLocaleString());
    updateElement('totalSHM', totalSHM.toLocaleString());
    updateElement('totalKasus', totalKasus.toLocaleString());

    // Update problem description
    const descriptions = locationData.map(item => item.deskripsiPermasalahan).filter(Boolean);
    if (descriptions.length > 0) {
        const description = descriptions.length === 1 ? 
            descriptions[0] : 
            `${descriptions.length} permasalahan ditemukan untuk lokasi ini`;
        updateElement('problemDescription', description);
    }

    // Update follow-up action
    const followUps = locationData.map(item => item.tindakLanjut).filter(Boolean);
    if (followUps.length > 0) {
        const followUp = followUps.length === 1 ? 
            followUps[0] : 
            `${followUps.length} tindak lanjut tersedia`;
        updateElement('followupAction', followUp);
    }

    // Update recommendation
    const recommendations = locationData.map(item => item.rekomendasi).filter(Boolean);
    if (recommendations.length > 0) {
        const recommendation = recommendations.length === 1 ? 
            recommendations[0] : 
            `${recommendations.length} rekomendasi tersedia`;
        updateElement('recommendation', recommendation);
    }

    // Update status summary
    updateStatusSummaryForLocation(locationData);

    // Update current location display
    updateCurrentLocationDisplay(selectedSidebarLocation);
}

// Update dashboard for filtered results (aggregated)
function updateDashboardForFilteredResults(filteredData) {
    console.log('📊 Updating dashboard for filtered results...');
    
    // Calculate aggregated statistics
    const stats = calculateGlobalStats(filteredData);
    
    // Update summary cards
    updateElement('totalKK', stats.totalKK.toLocaleString());
    updateElement('totalSHM', stats.totalSHM.toLocaleString());
    updateElement('totalKasus', stats.totalKasus.toLocaleString());

    // Update problem description (aggregated)
    const descriptions = filteredData.map(item => item.deskripsiPermasalahan).filter(Boolean);
    if (descriptions.length > 0) {
        const uniqueDescriptions = [...new Set(descriptions)];
        const description = uniqueDescriptions.length === 1 ? 
            uniqueDescriptions[0] : 
            `Ditemukan ${descriptions.length} permasalahan dari ${filteredData.length} lokasi`;
        updateElement('problemDescription', description);
    }

    // Update follow-up action (aggregated)
    const followUps = filteredData.map(item => item.tindakLanjut).filter(Boolean);
    if (followUps.length > 0) {
        const uniqueFollowUps = [...new Set(followUps)];
        const followUp = uniqueFollowUps.length === 1 ? 
            uniqueFollowUps[0] : 
            `${uniqueFollowUps.length} tindak lanjut tersedia dari ${filteredData.length} lokasi`;
        updateElement('followupAction', followUp);
    }

    // Update recommendation (aggregated)
    const recommendations = filteredData.map(item => item.rekomendasi).filter(Boolean);
    if (recommendations.length > 0) {
        const uniqueRecommendations = [...new Set(recommendations)];
        const recommendation = uniqueRecommendations.length === 1 ? 
            uniqueRecommendations[0] : 
            `${uniqueRecommendations.length} rekomendasi tersedia dari ${filteredData.length} lokasi`;
        updateElement('recommendation', recommendation);
    }

    // Update status summary (aggregated)
    updateStatusSummaryForFilteredResults(filteredData);

    // Update current location display (show filter summary)
    updateCurrentLocationDisplay(`Filter: ${getFilterSummary()}`);
}

// Update status summary for specific location
function updateStatusSummaryForLocation(locationData) {
    const binaBlmHPL = locationData.filter(item => item.statusBinaBlmHPL).length;
    const binaSdhHPL = locationData.filter(item => item.statusBinaSdhHPL).length;
    const binaTdkHPL = locationData.filter(item => item.statusBinaTdkHPL).length;
    const serahSdhHPL = locationData.filter(item => item.statusSerahSdhHPL).length;
    const serahSkSerah = locationData.filter(item => item.statusSerahSKSerah).length;

    updateElement('binaBlmHPL', binaBlmHPL > 0 ? 'Yes' : 'No');
    updateElement('binaSdhHPL', binaSdhHPL > 0 ? 'Yes' : 'No');
    updateElement('binaTdkHPL', binaTdkHPL > 0 ? 'Yes' : 'No');
    updateElement('serahSdhHPL', serahSdhHPL > 0 ? 'Yes' : 'No');
    
    // Update SK Serah with actual value if available
    const skSerahItem = locationData.find(item => item.statusSerahSKSerah);
    if (skSerahItem && skSerahItem.statusSerahSKSerah) {
        updateElement('serahSKSerah', skSerahItem.statusSerahSKSerah);
    } else {
        updateElement('serahSKSerah', serahSkSerah > 0 ? 'Yes' : 'No');
    }
}

// Update status summary for filtered results
function updateStatusSummaryForFilteredResults(filteredData) {
    const binaBlmHPL = filteredData.filter(item => item.statusBinaBlmHPL).length;
    const binaSdhHPL = filteredData.filter(item => item.statusBinaSdhHPL).length;
    const binaTdkHPL = filteredData.filter(item => item.statusBinaTdkHPL).length;
    const serahSdhHPL = filteredData.filter(item => item.statusSerahSdhHPL).length;
    const serahSkSerah = filteredData.filter(item => item.statusSerahSKSerah).length;

    updateElement('binaBlmHPL', binaBlmHPL > 0 ? 'Yes' : 'No');
    updateElement('binaSdhHPL', binaSdhHPL > 0 ? 'Yes' : 'No');
    updateElement('binaTdkHPL', binaTdkHPL > 0 ? 'Yes' : 'No');
    updateElement('serahSdhHPL', serahSdhHPL > 0 ? 'Yes' : 'No');
    updateElement('serahSKSerah', serahSkSerah > 0 ? 'Yes' : 'No');
}

// Update current location display
function updateCurrentLocationDisplay(locationText) {
    if (currentLocationElement) {
        currentLocationElement.textContent = locationText;
    }
}

// Get filter summary for display
function getFilterSummary() {
    const filters = [];
    if (activeFilters.provinsi) filters.push(`Prov: ${activeFilters.provinsi}`);
    if (activeFilters.kabupaten) filters.push(`Kab: ${activeFilters.kabupaten}`);
    if (activeFilters.tahunPatan) filters.push(`Tahun: ${activeFilters.tahunPatan}`);
    if (activeFilters.statusBina) filters.push(`Bina: ${activeFilters.statusBina}`);
    if (activeFilters.statusSerah) filters.push(`Serah: ${activeFilters.statusSerah}`);
    if (activeFilters.permasalahan) filters.push(`Masalah: ${activeFilters.permasalahan}`);
    
    return filters.length > 0 ? filters.join(', ') : 'Semua Data';
}

// Update sidebar with current filters
function updateSidebarWithFilters() {
    // Dispatch event to update sidebar
    document.dispatchEvent(new CustomEvent('updateSidebar', {
        detail: { 
            filteredData, 
            activeFilters, 
            selectedSidebarLocation,
            totalRecords: filteredData.length
        }
    }));
}

// Update sidebar with filtered results
function updateSidebarWithFilteredResults(filteredData) {
    console.log('🔄 Updating sidebar with filtered results...');
    
    // Dispatch event to update sidebar location list
    document.dispatchEvent(new CustomEvent('updateSidebarLocations', {
        detail: { 
            filteredData, 
            activeFilters,
            shouldResetLocation: !selectedSidebarLocation // Reset location if no specific location selected
        }
    }));
}

// Show no results state
function showNoResultsState() {
    updateElement('totalKK', '0');
    updateElement('totalSHM', '0');
    updateElement('totalKasus', '0');
    updateElement('problemDescription', 'Tidak ada data yang sesuai dengan filter yang dipilih');
    updateElement('followupAction', 'Tidak ada tindak lanjut yang tersedia');
    updateElement('recommendation', 'Tidak ada rekomendasi yang tersedia');
    
    // Reset status summary
    updateElement('binaBlmHPL', 'No');
    updateElement('binaSdhHPL', 'No');
    updateElement('binaTdkHPL', 'No');
    updateElement('serahSdhHPL', 'No');
    updateElement('serahSKSerah', 'No');
    
    // Update current location display
    updateCurrentLocationDisplay('Tidak Ada Hasil');
}

// Helper function to update elements
function updateElement(elementId, newValue) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = newValue;
    } else {
        console.warn(`⚠️ Element ${elementId} not found for update`);
    }
}

// Update location list with filtered data
function updateLocationListWithFilter(filteredData) {
    const locationList = document.getElementById('locationList');
    locationList.innerHTML = '';
    
    if (filteredData.length === 0) {
        locationList.innerHTML = '<div class="no-results">Tidak ada data yang sesuai dengan filter</div>';
        return;
    }
    
    filteredData.forEach(location => {
        const locationItem = document.createElement('div');
        locationItem.className = `location-item ${location.id === currentLocationId ? 'active' : ''}`;
        locationItem.innerHTML = location.kabupaten;
        locationItem.dataset.id = location.id;
        
        locationItem.addEventListener('click', () => {
            filterByLocation(location.id);
        });
        
        locationList.appendChild(locationItem);
    });
}

// Show filter results count
function showFilterResults(count) {
    const filterHeader = document.querySelector('.filter-header h2');
    const originalText = 'Filter Data';
    
    if (count < dashboardData.length) {
        filterHeader.textContent = `${originalText} (${count} dari ${dashboardData.length} lokasi)`;
        filterHeader.style.color = '#3b82f6';
    } else {
        filterHeader.textContent = originalText;
        filterHeader.style.color = '#1e293b';
    }
}

// Clear all filters
function clearAllFilters() {
    document.getElementById('provinsiFilter').value = '';
    document.getElementById('kabupatenFilter').value = '';
    document.getElementById('tahunPatanFilter').value = '';
    document.getElementById('statusBinaFilter').value = '';
    document.getElementById('statusSerahFilter').value = '';
    document.getElementById('permasalahanFilter').value = '';
    
    // Reset filtered data
    filteredData = [];
    currentLocationId = null;
    
    // Reset location list
    populateLocationList();
    
    // Reset dashboard to global view
    updateGlobalDashboard();
    
    // Reset filter header
    const filterHeader = document.querySelector('.filter-header h2');
    filterHeader.textContent = 'Filter Data';
    filterHeader.style.color = '#1e293b';
}

// Export filtered data
function exportFilteredData() {
    const dataToExport = filteredData.length > 0 ? filteredData : dashboardData;
    
    // Create CSV content
    const headers = ['ID', 'Provinsi', 'Kabupaten', 'Pola', 'Tahun Patan', 'Tahun Serah', 'Jumlah KK', 'Beban Tugas SHM', 'HPL', 'Total Kasus', 'Deskripsi Permasalahan'];
    const csvContent = [
        headers.join(','),
        ...dataToExport.map(item => [
            item.id,
            `"${item.provinsi}"`,
            `"${item.kabupaten}"`,
            `"${item.pola}"`,
            `"${item.tahunPatan}"`,
            `"${item.tahunSerah}"`,
            item.jmlKK,
            item.bebanTugasSHM,
            `"${item.hpl}"`,
            item.totalKasus,
            `"${item.deskripsiPermasalahan}"`
        ].join(','))
    ].join('\n');

    // Download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize sidebar integration
function initializeSidebarIntegration() {
    console.log('🔗 Initializing sidebar integration...');
    
    // Listen for sidebar location selection
    document.addEventListener('sidebarLocationSelected', (event) => {
        const selectedLocation = event.detail;
        console.log('📍 Sidebar location selected:', selectedLocation);
        
        // Check if event.detail is an object with location and locationData
        if (typeof selectedLocation === 'object' && selectedLocation.location) {
            // New format with locationData
            const { location, locationData } = selectedLocation;
            console.log('📍 Location data received:', location, locationData);
            
            // Update selected sidebar location
            selectedSidebarLocation = location;
            
            // Update dashboard directly with location data
            updateDashboardForSpecificLocation(locationData);
            
            // Update current location display
            updateCurrentLocationDisplay(location);
            
        } else {
            // Old format - just location string
            selectedSidebarLocation = selectedLocation;
            
            // Apply current filters with sidebar location
            applyFiltersWithSidebar();
        }
    });
    
    // Listen for filter changes
    document.addEventListener('filtersChanged', (event) => {
        const filters = event.detail;
        console.log('🔍 Filters changed:', filters);
        
        // Update active filters
        activeFilters = { ...filters };
        
        // Apply filters with current sidebar location
        applyFiltersWithSidebar();
    });
    
    console.log('✅ Sidebar integration initialized');
}

// Apply filters with sidebar location
function applyFiltersWithSidebar() {
    let currentFilters = { ...activeFilters };

    // If a location is selected in the sidebar, add it to filters
    if (selectedSidebarLocation) {
        currentFilters.location = selectedSidebarLocation;
    }

    // Apply the combined filters
    applyFilters();
}

// Initialize Charts
function initializeCharts() {
    console.log('🎨 Initializing charts...');
    
    // Distribution Chart
    const distributionCtx = document.getElementById('distributionChart');
    if (distributionCtx) {
        console.log('📊 Creating distribution chart...');
        new Chart(distributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Masyarakat', 'Perusahaan', 'Kawasan Hutan', 'MHA', 'Instansi', 'Lain-lain'],
                datasets: [{
                    data: [45, 20, 15, 10, 8, 2],
                    backgroundColor: [
                        '#3b82f6',
                        '#22c55e',
                        '#f59e0b',
                        '#ef4444',
                        '#8b5cf6',
                        '#6b7280'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                family: 'Inter'
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    } else {
        console.warn('⚠️ Distribution chart canvas not found');
    }

    // Trend Chart
    const trendCtx = document.getElementById('trendChart');
    if (trendCtx) {
        console.log('📈 Creating trend chart...');
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Total Kasus',
                    data: [180, 195, 210, 225, 235, 240],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter'
                            }
                        }
                    }
                }
            }
        });
    } else {
        console.warn('⚠️ Trend chart canvas not found');
    }
    
    console.log('✅ Charts initialization completed');
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);

// Add some utility functions
window.dashboardUtils = {
    calculateGlobalStats,
    calculateProvinceStats,
    calculateProblemStats,
    exportFilteredData,
    getAllData: () => dashboardData
};
