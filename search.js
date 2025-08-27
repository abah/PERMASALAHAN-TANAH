// Simple & Realtime Search JavaScript
console.log('Search.js loaded - Simple & Realtime Version');

// Global variables
let allData = [];
let searchTimeout;
let searchStartTime = 0;
let currentFilter = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Setting up simple realtime search');
    setupRealtimeSearch();
});

function setupRealtimeSearch() {
    try {
        // Get data from data.js
        if (typeof dashboardData !== 'undefined') {
            allData = dashboardData;
            console.log('Data loaded from data.js:', allData.length, 'locations');
        } else {
            console.error('dashboardData not found, using empty array');
            allData = [];
        }
        
        // Update total count
        updateTotalCount();
        
        // Setup search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // Real-time search on input
            searchInput.addEventListener('input', function() {
                const query = this.value.trim();
                
                // Show/hide clear button
                const clearBtn = document.getElementById('clearBtn');
                if (clearBtn) {
                    clearBtn.style.display = query.length > 0 ? 'block' : 'none';
                }
                
                // Clear previous timeout
                if (searchTimeout) {
                    clearTimeout(searchTimeout);
                }
                
                // Set new timeout for real-time search
                searchTimeout = setTimeout(() => {
                    performRealtimeSearch(query);
                }, 300); // 300ms delay for better performance
            });
            
            // Enter key
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performRealtimeSearch(this.value.trim());
                }
            });
            
            console.log('Search input event listeners added');
        }
        
        // Setup clear button
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                clearSearch();
            });
            console.log('Clear button event listener added');
        }
        
        // Setup clear results button
        const clearResults = document.getElementById('clearResults');
        if (clearResults) {
            clearResults.addEventListener('click', function() {
                clearSearch();
            });
            console.log('Clear results button event listener added');
        }
        
        // Setup export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function() {
                exportToCSV();
            });
            console.log('Export button event listener added');
        }
        
        // Setup try again button
        const tryAgainBtn = document.getElementById('tryAgainBtn');
        if (tryAgainBtn) {
            tryAgainBtn.addEventListener('click', function() {
                clearSearch();
            });
            console.log('Try again button event listener added');
        }
        
        // Setup quick filters
        setupQuickFilters();
        
        // Setup tip tags
        setupTipTags();
        
        // Setup modal close events
        setupModalEvents();
        
        console.log('Simple realtime search setup complete');
        
    } catch (error) {
        console.error('Error setting up search:', error);
    }
}

function setupQuickFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            
            // Remove active class from all filters
            filterTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Apply filter
            applyQuickFilter(filterType);
            
            console.log('Quick filter applied:', filterType);
        });
    });
    
    console.log('Quick filters setup complete');
}

function setupTipTags() {
    const tipTags = document.querySelectorAll('.tip-tag');
    tipTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const searchTerm = this.textContent;
            
            // Set search input value
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = searchTerm;
                searchInput.focus();
            }
            
            // Perform search
            performRealtimeSearch(searchTerm);
            
            console.log('Tip tag clicked:', searchTerm);
        });
    });
    
    console.log('Tip tags setup complete');
}

function applyQuickFilter(filterType) {
    currentFilter = filterType;
    
    // Get current search query
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.trim() : '';
    
    // Perform search with filter
    performRealtimeSearch(query);
}

function updateTotalCount() {
    const totalCount = document.getElementById('totalCount');
    if (totalCount) {
        totalCount.textContent = allData.length.toLocaleString();
    }
}

function performRealtimeSearch(query) {
    console.log('Performing realtime search for:', query, 'with filter:', currentFilter);
    
    // Record search start time
    searchStartTime = Date.now();
    
    // Hide all states first
    hideAllStates();
    
    if (!query && !currentFilter) {
        showInitialState();
        return;
    }
    
    // Apply search and filter
    let results = allData;
    
    // Apply text search
    if (query) {
        results = results.filter(item => {
            const searchableText = [
                item.provinsi || '',
                item.kabupaten || '',
                item.pola || '',
                item.tahunPatan || '',
                item.deskripsiPermasalahan || '',
                item.tindakLanjut || '',
                item.rekomendasi || ''
            ].join(' ').toLowerCase();
            
            return searchableText.includes(query.toLowerCase());
        });
    }
    
    // Apply quick filter
    if (currentFilter) {
        results = applyFilterLogic(results, currentFilter);
    }
    
    console.log('Search results:', results.length, 'locations found');
    
    // Display results
    if (results.length > 0) {
        displaySearchResults(results);
    } else {
        showNoResults();
    }
}

function applyFilterLogic(data, filterType) {
    switch (filterType) {
        case 'provinsi':
            // Show unique provinces
            const provinces = [...new Set(data.map(item => item.provinsi))].sort();
            return provinces.map(provinsi => ({
                id: `provinsi_${provinsi}`,
                kabupaten: provinsi,
                provinsi: provinsi,
                pola: 'Provinsi',
                tahunPatan: '-',
                jmlKK: data.filter(item => item.provinsi === provinsi).length,
                bebanTugasSHM: 0,
                totalKasus: 0,
                isProvinceSummary: true
            }));
            
        case 'kabupaten':
            // Show unique kabupatens
            const kabupatens = [...new Set(data.map(item => item.kabupaten))].sort();
            return kabupatens.map(kabupaten => ({
                id: `kabupaten_${kabupaten}`,
                kabupaten: kabupaten,
                provinsi: data.find(item => item.kabupaten === kabupaten)?.provinsi || '-',
                pola: 'Kabupaten',
                tahunPatan: '-',
                jmlKK: 1,
                bebanTugasSHM: 0,
                totalKasus: 0,
                isKabupatenSummary: true
            }));
            
        case 'tahun':
            // Show unique years
            const years = [...new Set(data.map(item => item.tahunPatan).filter(Boolean))].sort();
            return years.map(year => ({
                id: `tahun_${year}`,
                kabupaten: `Tahun ${year}`,
                provinsi: 'Semua Provinsi',
                pola: 'Tahun',
                tahunPatan: year,
                jmlKK: data.filter(item => item.tahunPatan === year).length,
                bebanTugasSHM: 0,
                totalKasus: 0,
                isYearSummary: true
            }));
            
        case 'status':
            // Show status summary
            const statusSummary = [
                {
                    id: 'status_blm',
                    kabupaten: 'Belum HPL',
                    provinsi: 'Status Bina',
                    pola: 'Status',
                    tahunPatan: '-',
                    jmlKK: data.filter(item => item.statusBinaBlmHPL).length,
                    bebanTugasSHM: 0,
                    totalKasus: 0,
                    isStatusSummary: true
                },
                {
                    id: 'status_sdh',
                    kabupaten: 'Sudah HPL',
                    provinsi: 'Status Bina',
                    pola: 'Status',
                    tahunPatan: '-',
                    jmlKK: data.filter(item => item.statusBinaSdhHPL).length,
                    bebanTugasSHM: 0,
                    totalKasus: 0,
                    isStatusSummary: true
                }
            ];
            return statusSummary;
            
        default:
            return data;
    }
}

function displaySearchResults(results) {
    // Show search results
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.style.display = 'block';
        
        // Update results count
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = results.length;
        }
        
        // Update search time
        const searchTime = document.getElementById('searchTime');
        if (searchTime) {
            const searchDuration = Date.now() - searchStartTime;
            searchTime.textContent = `(${searchDuration}ms)`;
        }
        
        // Populate results list
        const resultsList = document.getElementById('resultsList');
        if (resultsList) {
            resultsList.innerHTML = '';
            
            results.forEach(item => {
                const resultItem = createResultItem(item);
                resultsList.appendChild(resultItem);
            });
        }
    }
}

function createResultItem(item) {
    const resultItem = document.createElement('div');
    resultItem.className = 'result-item';
    
    // Check if it's a summary item
    if (item.isProvinceSummary || item.isKabupatenSummary || item.isYearSummary || item.isStatusSummary) {
        resultItem.classList.add('summary-item');
    }
    
    // Get status badge
    const statusBadge = getStatusBadge(item);
    
    resultItem.innerHTML = `
        <div class="result-header">
            <h3 class="result-title">${item.kabupaten || 'Nama Lokasi Tidak Tersedia'}</h3>
            <span class="result-status">${statusBadge}</span>
        </div>
        <div class="result-details">
            <div class="result-detail">
                <span class="detail-label">Provinsi</span>
                <span class="detail-value">${item.provinsi || '-'}</span>
            </div>
            <div class="result-detail">
                <span class="detail-label">Pola</span>
                <span class="detail-value">${item.pola || '-'}</span>
            </div>
            <div class="result-detail">
                <span class="detail-label">Tahun Patan</span>
                <span class="detail-value">${item.tahunPatan || '-'}</span>
            </div>
            <div class="result-detail">
                <span class="detail-label">JML KK</span>
                <span class="detail-value">${item.jmlKK ? item.jmlKK.toLocaleString() : '-'}</span>
            </div>
            <div class="result-detail">
                <span class="detail-label">SHM</span>
                <span class="detail-value">${item.bebanTugasSHM ? item.bebanTugasSHM.toLocaleString() : '-'}</span>
            </div>
            <div class="result-detail">
                <span class="detail-label">Total Kasus</span>
                <span class="detail-value">${item.totalKasus || '-'}</span>
            </div>
        </div>
        <div class="result-actions">
            ${!item.isProvinceSummary && !item.isKabupatenSummary && !item.isYearSummary && !item.isStatusSummary ? 
                `<button class="btn-detail" onclick="showLocationDetail(${item.id})">
                    <i class="fas fa-eye"></i> Detail
                </button>` : 
                `<span class="summary-info">Klik untuk lihat detail</span>`
            }
        </div>
    `;
    
    // Add click event for summary items
    if (item.isProvinceSummary || item.isKabupatenSummary || item.isYearSummary || item.isStatusSummary) {
        resultItem.addEventListener('click', function() {
            showSummaryDetail(item);
        });
    }
    
    return resultItem;
}

function getStatusBadge(item) {
    if (item.isProvinceSummary) return 'Provinsi';
    if (item.isKabupatenSummary) return 'Kabupaten';
    if (item.isYearSummary) return 'Tahun';
    if (item.isStatusSummary) return 'Status';
    
    if (item.statusBinaBlmHPL) {
        return 'Belum HPL';
    } else if (item.statusBinaSdhHPL) {
        return 'Sudah HPL';
    } else if (item.statusBinaTdkHPL) {
        return 'Tidak HPL';
    } else if (item.statusSerahSdhHPL) {
        return 'Serah - Sudah HPL';
    } else if (item.statusSerahSKSerah) {
        return 'Serah - SK Serah';
    } else {
        return '-';
    }
}

function showSummaryDetail(summaryItem) {
    let filteredData = [];
    let title = '';
    
    switch (summaryItem.id.split('_')[0]) {
        case 'provinsi':
            filteredData = allData.filter(item => item.provinsi === summaryItem.kabupaten);
            title = `Detail Provinsi: ${summaryItem.kabupaten}`;
            break;
        case 'kabupaten':
            filteredData = allData.filter(item => item.kabupaten === summaryItem.kabupaten);
            title = `Detail Kabupaten: ${summaryItem.kabupaten}`;
            break;
        case 'tahun':
            filteredData = allData.filter(item => item.tahunPatan === summaryItem.tahunPatan);
            title = `Detail Tahun: ${summaryItem.tahunPatan}`;
            break;
        case 'status':
            if (summaryItem.kabupaten === 'Belum HPL') {
                filteredData = allData.filter(item => item.statusBinaBlmHPL);
            } else if (summaryItem.kabupaten === 'Sudah HPL') {
                filteredData = allData.filter(item => item.statusBinaSdhHPL);
            }
            title = `Detail Status: ${summaryItem.kabupaten}`;
            break;
    }
    
    // Show filtered results
    displaySearchResults(filteredData);
    
    // Update search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = summaryItem.kabupaten;
    }
}

function showNoResults() {
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.style.display = 'block';
    }
}

function showInitialState() {
    const initialState = document.getElementById('initialState');
    if (initialState) {
        initialState.style.display = 'block';
    }
}

function hideAllStates() {
    const searchResults = document.getElementById('searchResults');
    const noResults = document.getElementById('noResults');
    const initialState = document.getElementById('initialState');
    
    if (searchResults) searchResults.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
    if (initialState) initialState.style.display = 'none';
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    
    // Clear filter
    currentFilter = null;
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => tag.classList.remove('active'));
    
    showInitialState();
}

function exportToCSV() {
    try {
        // Get current results
        const resultsList = document.getElementById('resultsList');
        if (!resultsList || resultsList.children.length === 0) {
            alert('Tidak ada hasil untuk diexport');
            return;
        }
        
        // Get all result items
        const resultItems = Array.from(resultsList.children);
        const data = [];
        
        // Extract data from each result item
        resultItems.forEach(item => {
            const title = item.querySelector('.result-title').textContent;
            const details = item.querySelectorAll('.detail-value');
            
            const row = {
                'Kabupaten/Lokasi': title,
                'Provinsi': details[0]?.textContent || '-',
                'Pola': details[1]?.textContent || '-',
                'Tahun Patan': details[2]?.textContent || '-',
                'JML KK': details[3]?.textContent || '-',
                'SHM': details[4]?.textContent || '-',
                'Total Kasus': details[5]?.textContent || '-'
            };
            
            data.push(row);
        });
        
        // Convert to CSV
        const csvContent = convertToCSV(data);
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `search_results_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Results exported to CSV');
        
    } catch (error) {
        console.error('Error exporting results:', error);
        alert('Error saat export data');
    }
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            // Escape quotes and wrap in quotes if contains comma
            return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

function showLocationDetail(locationId) {
    try {
        const location = allData.find(loc => loc.id === locationId);
        
        if (!location) {
            console.error('Location not found:', locationId);
            return;
        }
        
        // Update modal title
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = location.kabupaten || 'Detail Lokasi';
        }
        
        // Build modal content
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = buildDetailContent(location);
        }
        
        // Show modal
        const detailModal = document.getElementById('detailModal');
        if (detailModal) {
            detailModal.style.display = 'block';
        }
        
        console.log('Location detail modal opened for:', location.kabupaten);
        
    } catch (error) {
        console.error('Error showing location detail:', error);
    }
}

function buildDetailContent(location) {
    return `
        <div class="detail-grid">
            <div class="detail-item">
                <label>Provinsi</label>
                <div class="value">${location.provinsi || '-'}</div>
            </div>
            <div class="detail-item">
                <label>Kabupaten/Lokasi</label>
                <div class="value">${location.kabupaten || '-'}</div>
            </div>
            <div class="detail-item">
                <label>Pola</label>
                <div class="value">${location.pola || '-'}</div>
            </div>
            <div class="detail-item">
                <label>Tahun Patan</label>
                <div class="value">${location.tahunPatan || '-'}</div>
            </div>
            <div class="detail-item">
                <label>Tahun Serah</label>
                <div class="value">${location.tahunSerah || '-'}</div>
            </div>
            <div class="detail-item">
                <label>JML KK</label>
                <div class="value">${location.jmlKK ? location.jmlKK.toLocaleString() : '-'}</div>
            </div>
            <div class="detail-item">
                <label>Beban Tugas SHM</label>
                <div class="value">${location.bebanTugasSHM ? location.bebanTugasSHM.toLocaleString() : '-'}</div>
            </div>
            <div class="detail-item">
                <label>Total Kasus</label>
                <div class="value">${location.totalKasus || '-'}</div>
            </div>
        </div>
        
        ${location.deskripsiPermasalahan ? `
        <div class="description-section">
            <h4>Deskripsi Permasalahan</h4>
            <div class="description-content">${location.deskripsiPermasalahan}</div>
        </div>
        ` : ''}
        
        ${location.tindakLanjut ? `
        <div class="description-section">
            <h4>Tindak Lanjut</h4>
            <div class="description-content">${location.tindakLanjut}</div>
        </div>
        ` : ''}
        
        ${location.rekomendasi ? `
        <div class="description-section">
            <h4>Rekomendasi</h4>
            <div class="description-content">${location.rekomendasi}</div>
        </div>
        ` : ''}
    `;
}

function setupModalEvents() {
    // Close button
    const closeBtn = document.querySelector('#detailModal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDetailModal);
    }
    
    // Close when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('detailModal');
        if (event.target === modal) {
            closeDetailModal();
        }
    });
}

function closeDetailModal() {
    const modal = document.getElementById('detailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Export functions for global access
window.searchUtils = {
    showLocationDetail,
    closeDetailModal
};

console.log('Simple realtime search ready - Type to search!');
