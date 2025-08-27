// Dashboard Data - Import dari file data.js
// Data sekarang disimpan di file terpisah untuk maintainability yang lebih baik

// Global variables
let currentLocationId = null; // Tidak ada lokasi default, tampilkan global view
let filteredData = []; // Data yang sudah difilter

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

// Initialize the dashboard
function initDashboard() {
    populateLocationList();
    populateFilterOptions();
    updateGlobalDashboard();
    addEventListeners();
}

// Calculate global statistics
function calculateGlobalStats(data = dashboardData) {
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
function calculateProvinceStats(data = dashboardData) {
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
function calculateProblemStats(data = dashboardData) {
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
function calculateStatusStats(data = dashboardData) {
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
    const data = filteredData.length > 0 ? filteredData : dashboardData;
    const stats = calculateGlobalStats(data);
    const problemStats = calculateProblemStats(data);
    const statusStats = calculateStatusStats(data);
    const provinceStats = calculateProvinceStats(data);
    
    // Update header information
    if (currentLocationId) {
        const selectedLocation = dashboardData.find(loc => loc.id === currentLocationId);
        currentLocationElement.textContent = selectedLocation.kabupaten;
        currentYearElement.textContent = selectedLocation.tahunPatan;
        
        // Update summary cards for selected location
        totalKKElement.textContent = selectedLocation.jmlKK.toLocaleString();
        totalSHMElement.textContent = selectedLocation.bebanTugasSHM.toLocaleString();
        totalKasusElement.textContent = selectedLocation.totalKasus;
        
        // Update problem description with selected location data
        problemDescriptionElement.innerHTML = `
            <div class="problem-stats">
                <h4>Permasalahan di ${selectedLocation.kabupaten}:</h4>
                <div class="problem-detail">
                    <strong>Deskripsi Permasalahan:</strong>
                    <p>${selectedLocation.deskripsiPermasalahan}</p>
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
        
        // Update follow-up action with selected location data
        followupActionElement.innerHTML = `
            <div class="tindak-lanjut-detail">
                <h4>Tindak Lanjut di ${selectedLocation.kabupaten}:</h4>
                <div class="tindak-lanjut-content">
                    <p>${selectedLocation.tindakLanjut}</p>
                </div>
            </div>
        `;
        
        // Update recommendation with selected location data
        recommendationElement.innerHTML = `
            <div class="rekomendasi-detail">
                <h4>Rekomendasi untuk ${selectedLocation.kabupaten}:</h4>
                <div class="rekomendasi-content">
                    <p>${selectedLocation.rekomendasi}</p>
                </div>
            </div>
        `;
        
    } else {
        // Global overview
        currentLocationElement.textContent = `Overview Nasional`;
        currentYearElement.textContent = `${stats.yearRange.min} - ${stats.yearRange.max}`;
        
        // Update summary cards
        totalKKElement.textContent = stats.totalKK.toLocaleString();
        totalSHMElement.textContent = stats.totalSHM.toLocaleString();
        totalKasusElement.textContent = stats.totalKasus;
        
        // Update problem description with statistics
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
        
        // Update follow-up action with province summary
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
        
        // Update recommendation with status summary
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
    
    // Update status values
    updateStatusValues(statusStats);
    
    // Update analysis chart
    updateAnalysisChart(problemStats, provinceStats);
    
    // Add animation
    addFadeInAnimation();
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
    // Get unique values from data
    const provinsiList = [...new Set(dashboardData.map(item => item.provinsi))];
    const kabupatenList = [...new Set(dashboardData.map(item => item.kabupaten.split(' - ')[0]))];
    const tahunPatanList = [...new Set(dashboardData.map(item => item.tahunPatan).filter(tahun => tahun))];

    // Populate provinsi filter
    const provinsiFilter = document.getElementById('provinsiFilter');
    provinsiFilter.innerHTML = '<option value="">Semua Provinsi</option>';
    provinsiList.forEach(provinsi => {
        const option = document.createElement('option');
        option.value = provinsi;
        option.textContent = provinsi;
        provinsiFilter.appendChild(option);
    });

    // Populate kabupaten filter
    const kabupatenFilter = document.getElementById('kabupatenFilter');
    kabupatenFilter.innerHTML = '<option value="">Semua Kabupaten</option>';
    kabupatenList.forEach(kabupaten => {
        const option = document.createElement('option');
        option.value = kabupaten;
        option.textContent = kabupaten;
        kabupatenFilter.appendChild(option);
    });

    // Populate tahun patan filter
    const tahunPatanFilter = document.getElementById('tahunPatanFilter');
    tahunPatanFilter.innerHTML = '<option value="">Semua Tahun</option>';
    tahunPatanList.forEach(tahun => {
        const option = document.createElement('option');
        option.value = tahun;
        option.textContent = tahun;
        tahunPatanFilter.appendChild(option);
    });
}

// Update kabupaten options based on selected provinsi
function updateKabupatenOptions() {
    const selectedProvinsi = document.getElementById('provinsiFilter').value;
    const kabupatenFilter = document.getElementById('kabupatenFilter');
    
    // Clear current options
    kabupatenFilter.innerHTML = '<option value="">Semua Kabupaten</option>';
    
    if (selectedProvinsi) {
        // Get kabupaten for selected provinsi
        const filteredKabupaten = [...new Set(
            dashboardData
                .filter(item => item.provinsi === selectedProvinsi)
                .map(item => item.kabupaten.split(' - ')[0])
        )];
        
        filteredKabupaten.forEach(kabupaten => {
            const option = document.createElement('option');
            option.value = kabupaten;
            option.textContent = kabupaten;
            kabupatenFilter.appendChild(option);
        });
    } else {
        // Show all kabupaten
        const allKabupaten = [...new Set(dashboardData.map(item => item.kabupaten.split(' - ')[0]))];
        allKabupaten.forEach(kabupaten => {
            const option = document.createElement('option');
            option.value = kabupaten;
            option.textContent = kabupaten;
            kabupatenFilter.appendChild(option);
        });
    }
    
    // Reset kabupaten selection
    kabupatenFilter.value = '';
    
    // Apply filters
    applyFilters();
}

// Populate location list in sidebar
function populateLocationList() {
    locationList.innerHTML = '';
    
    dashboardData.forEach(location => {
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
    // Navigation menu items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Handle navigation
            const text = item.querySelector('span').textContent;
            if (text === 'Analytics') {
                window.location.href = 'analytics.html';
            } else if (text === 'Pencarian') {
                window.location.href = 'search.html';
            }
        });
    });
    
    // User profile click
    document.querySelector('.user-profile').addEventListener('click', () => {
        alert('User profile clicked!');
    });
}

// Apply filters to data
function applyFilters() {
    const provinsi = document.getElementById('provinsiFilter').value;
    const kabupaten = document.getElementById('kabupatenFilter').value;
    const tahunPatan = document.getElementById('tahunPatanFilter').value;
    const statusBina = document.getElementById('statusBinaFilter').value;
    const statusSerah = document.getElementById('statusSerahFilter').value;
    const permasalahan = document.getElementById('permasalahanFilter').value;

    // Filter data based on selected criteria
    filteredData = dashboardData.filter(item => {
        let match = true;

        // Filter by provinsi
        if (provinsi && item.provinsi !== provinsi) match = false;

        // Filter by kabupaten
        if (kabupaten && !item.kabupaten.startsWith(kabupaten)) match = false;

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

    // Update location list with filtered data
    updateLocationListWithFilter(filteredData);
    
    // Update dashboard with filtered data
    updateGlobalDashboard();
    
    // Show filter results count
    showFilterResults(filteredData.length);
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
