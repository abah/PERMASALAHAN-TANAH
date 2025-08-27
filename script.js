// Dashboard Data - Import dari file data.js
// Data sekarang disimpan di file terpisah untuk maintainability yang lebih baik

// Current selected location
let currentLocationId = 4; // Default to Kab. Pulau Morotai - UPT. Daruba SP.3

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
    updateDashboard(currentLocationId);
    addEventListeners();
}

// Populate filter options from data
function populateFilterOptions() {
    // Get unique values from data
    const provinsiList = [...new Set(dashboardData.map(item => item.provinsi))];
    const kabupatenList = [...new Set(dashboardData.map(item => item.kabupaten.split(' - ')[0]))];
    const tahunPatanList = [...new Set(dashboardData.map(item => item.tahunPatan).filter(tahun => tahun))];

    // Populate provinsi filter
    const provinsiFilter = document.getElementById('provinsiFilter');
    provinsiList.forEach(provinsi => {
        const option = document.createElement('option');
        option.value = provinsi;
        option.textContent = provinsi;
        provinsiFilter.appendChild(option);
    });

    // Populate kabupaten filter
    const kabupatenFilter = document.getElementById('kabupatenFilter');
    kabupatenList.forEach(kabupaten => {
        const option = document.createElement('option');
        option.value = kabupaten;
        option.textContent = kabupaten;
        kabupatenFilter.appendChild(option);
    });

    // Populate tahun patan filter
    const tahunPatanFilter = document.getElementById('tahunPatanFilter');
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
            switchLocation(location.id);
        });
        
        locationList.appendChild(locationItem);
    });
}

// Switch to a different location
function switchLocation(locationId) {
    currentLocationId = locationId;
    
    // Update active state in location list
    document.querySelectorAll('.location-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-id="${locationId}"]`).classList.add('active');
    
    // Update dashboard content
    updateDashboard(locationId);
}

// Update dashboard content based on selected location
function updateDashboard(locationId) {
    const location = dashboardData.find(loc => loc.id === locationId);
    if (!location) return;
    
    // Update header information
    currentLocationElement.textContent = location.kabupaten;
    currentYearElement.textContent = location.tahunPatan;
    
    // Update summary cards
    totalKKElement.textContent = location.jmlKK.toLocaleString();
    totalSHMElement.textContent = location.bebanTugasSHM.toLocaleString();
    totalKasusElement.textContent = location.totalKasus;
    
    // Update problem description, follow-up, and recommendation
    problemDescriptionElement.textContent = location.deskripsiPermasalahan;
    followupActionElement.textContent = location.tindakLanjut;
    recommendationElement.textContent = location.rekomendasi;
    
    // Update status values
    updateStatusValues(location);
    
    // Update analysis chart
    updateAnalysisChart(location);
    
    // Add animation
    addFadeInAnimation();
}

// Update status values
function updateStatusValues(location) {
    // Status Bina
    binaBlmHPLElement.textContent = location.statusBinaBlmHPL ? 'Yes' : 'No';
    binaBlmHPLElement.className = `status-value ${location.statusBinaBlmHPL ? 'active' : ''}`;
    
    binaSdhHPLElement.textContent = location.statusBinaSdhHPL ? 'Yes' : 'No';
    binaSdhHPLElement.className = `status-value ${location.statusBinaSdhHPL ? 'active' : ''}`;
    
    binaTdkHPLElement.textContent = location.statusBinaTdkHPL ? 'Yes' : 'No';
    binaTdkHPLElement.className = `status-value ${location.statusBinaTdkHPL ? 'active' : ''}`;
    
    // Status Serah
    serahSdhHPLElement.textContent = location.statusSerahSdhHPL ? 'Yes' : 'No';
    serahSdhHPLElement.className = `status-value ${location.statusSerahSdhHPL ? 'active' : ''}`;
    
    serahSKSerahElement.textContent = location.statusSerahSKSerah || 'No';
    serahSKSerahElement.className = `status-value ${location.statusSerahSKSerah ? 'active' : ''}`;
}

// Update analysis chart
function updateAnalysisChart(location) {
    const chartData = [
        { label: 'Masyarakat', value: location.permasalahanOKUMasy ? 1 : 0 },
        { label: 'Perusahaan', value: location.permasalahanPerusahaan ? 1 : 0 },
        { label: 'Kws Hutan', value: location.permasalahanKwsHutan ? 1 : 0 },
        { label: 'MHA', value: location.permasalahanMHA ? 1 : 0 },
        { label: 'Instansi', value: location.permasalahanInstansi ? 1 : 0 },
        { label: 'Lain-lain', value: location.permasalahanLainLain ? 1 : 0 }
    ];
    
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    
    analysisChartElement.innerHTML = '';
    
    chartData.forEach(item => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        
        const chartItem = document.createElement('div');
        chartItem.className = 'chart-item';
        chartItem.innerHTML = `
            <div class="chart-label">${item.label}</div>
            <div class="chart-bar">
                <div class="chart-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="chart-value">${item.value}</div>
        `;
        
        analysisChartElement.appendChild(chartItem);
    });
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
            }
        });
    });
    
    // User profile click
    document.querySelector('.user-profile').addEventListener('click', () => {
        alert('User profile clicked!');
    });
}

// Search functionality
function searchLocations(query) {
    const filteredData = dashboardData.filter(location => 
        location.kabupaten.toLowerCase().includes(query.toLowerCase()) ||
        location.provinsi.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filteredData.length > 0) {
        switchLocation(filteredData[0].id);
    }
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
    let filteredData = dashboardData.filter(item => {
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
    
    // Update summary cards with filtered data
    updateSummaryCardsWithFilter(filteredData);
    
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
            switchLocation(location.id);
        });
        
        locationList.appendChild(locationItem);
    });
}

// Update summary cards with filtered data
function updateSummaryCardsWithFilter(filteredData) {
    const totalKK = filteredData.reduce((sum, item) => sum + item.jmlKK, 0);
    const totalSHM = filteredData.reduce((sum, item) => sum + item.bebanTugasSHM, 0);
    const totalKasus = filteredData.reduce((sum, item) => sum + item.totalKasus, 0);
    
    document.getElementById('totalKK').textContent = totalKK.toLocaleString();
    document.getElementById('totalSHM').textContent = totalSHM.toLocaleString();
    document.getElementById('totalKasus').textContent = totalKasus;
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
    
    // Reset location list
    populateLocationList();
    
    // Reset summary cards
    updateSummaryCardsWithFilter(dashboardData);
    
    // Reset filter header
    const filterHeader = document.querySelector('.filter-header h2');
    filterHeader.textContent = 'Filter Data';
    filterHeader.style.color = '#1e293b';
}

// Export filtered data
function exportFilteredData() {
    const provinsi = document.getElementById('provinsiFilter').value;
    const kabupaten = document.getElementById('kabupatenFilter').value;
    const tahunPatan = document.getElementById('tahunPatanFilter').value;
    const statusBina = document.getElementById('statusBinaFilter').value;
    const statusSerah = document.getElementById('statusSerahFilter').value;
    const permasalahan = document.getElementById('permasalahanFilter').value;

    // Apply same filtering logic
    let filteredData = dashboardData.filter(item => {
        let match = true;

        if (provinsi && item.provinsi !== provinsi) match = false;
        if (kabupaten && !item.kabupaten.startsWith(kabupaten)) match = false;
        if (tahunPatan && item.tahunPatan !== tahunPatan) match = false;

        if (statusBina) {
            switch (statusBina) {
                case 'blmHPL': if (!item.statusBinaBlmHPL) match = false; break;
                case 'sdhHPL': if (!item.statusBinaSdhHPL) match = false; break;
                case 'tdkHPL': if (!item.statusBinaTdkHPL) match = false; break;
            }
        }

        if (statusSerah) {
            switch (statusSerah) {
                case 'sdhHPL': if (!item.statusSerahSdhHPL) match = false; break;
                case 'skSerah': if (!item.statusSerahSKSerah) match = false; break;
            }
        }

        if (permasalahan) {
            switch (permasalahan) {
                case 'masyarakat': if (!item.permasalahanOKUMasy) match = false; break;
                case 'perusahaan': if (!item.permasalahanPerusahaan) match = false; break;
                case 'kwsHutan': if (!item.permasalahanKwsHutan) match = false; break;
                case 'mha': if (!item.permasalahanMHA) match = false; break;
                case 'instansi': if (!item.permasalahanInstansi) match = false; break;
                case 'lainLain': if (!item.permasalahanLainLain) match = false; break;
            }
        }

        return match;
    });

    // Create CSV content
    const headers = ['ID', 'Provinsi', 'Kabupaten', 'Pola', 'Tahun Patan', 'Tahun Serah', 'Jumlah KK', 'Beban Tugas SHM', 'HPL', 'Total Kasus', 'Deskripsi Permasalahan'];
    const csvContent = [
        headers.join(','),
        ...filteredData.map(item => [
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
    link.setAttribute('download', `filtered_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Export data functionality (original)
function exportData() {
    const location = dashboardData.find(loc => loc.id === currentLocationId);
    if (!location) return;
    
    const dataStr = JSON.stringify(location, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${location.kabupaten.replace(/[^a-zA-Z0-9]/g, '_')}_data.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
                const locationIndex = parseInt(e.key) - 1;
                if (dashboardData[locationIndex]) {
                    switchLocation(dashboardData[locationIndex].id);
                }
                break;
            case 's':
                e.preventDefault();
                exportData();
                break;
        }
    }
});

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard);

// Add some utility functions
window.dashboardUtils = {
    searchLocations,
    exportData,
    getCurrentLocation: () => dashboardData.find(loc => loc.id === currentLocationId),
    getAllData: () => dashboardData
};
