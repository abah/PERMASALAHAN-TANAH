// Data Table Management JavaScript
console.log('Data Table JS loaded');

// Global variables
let currentData = [];
let filteredData = [];
let currentPage = 1;
const itemsPerPage = 10;
let editingId = null;

// DOM Elements
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const provinsiFilter = document.getElementById('provinsiFilter');
const statusFilter = document.getElementById('statusFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const addNewBtn = document.getElementById('addNewBtn');
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const totalRecords = document.getElementById('totalRecords');
const totalRecordsPagination = document.getElementById('totalRecordsPagination');
const startRecord = document.getElementById('startRecord');
const endRecord = document.getElementById('endRecord');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageNumbers = document.getElementById('pageNumbers');

// Initialize data table
function initDataTable() {
    console.log('Initializing data table...');
    
    // Try to load from localStorage first
    if (loadFromLocalStorage()) {
        console.log('Data loaded from localStorage');
        currentData = [...dashboardData];
    } else {
        console.log('Loading from data.js');
        currentData = [...dashboardData];
    }
    
    filteredData = [...currentData];
    
    updateTotalRecords();
    populateFilters();
    renderTable();
    setupEventListeners();
    
    // Check for unsaved changes
    setTimeout(() => {
        checkForUnsavedChanges();
    }, 1000);
}

// Update total records display
function updateTotalRecords() {
    const total = filteredData.length;
    totalRecords.textContent = total;
    totalRecordsPagination.textContent = total;
}

// Populate filter options
function populateFilters() {
    // Populate provinsi filter
    const provinsiList = [...new Set(currentData.map(item => item.provinsi))];
    provinsiList.forEach(provinsi => {
        const option = document.createElement('option');
        option.value = provinsi;
        option.textContent = provinsi;
        provinsiFilter.appendChild(option);
    });
}

// Render table with current data
function renderTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    pageData.forEach(item => {
        const row = createTableRow(item);
        tableBody.appendChild(row);
    });
    
    updatePagination();
}

// Create table row
function createTableRow(item) {
    const row = document.createElement('tr');
    
    // Determine status based on data
    const hasProblems = item.permasalahanOKUMasy || item.permasalahanPerusahaan || 
                       item.permasalahanKwsHutan || item.permasalahanMHA || 
                       item.permasalahanInstansi || item.permasalahanLainLain;
    
    const status = hasProblems ? 'active' : 'inactive';
    const statusText = hasProblems ? 'Ada Masalah' : 'Tidak Ada Masalah';
    
    row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.provinsi}</td>
        <td>${item.kabupaten}</td>
        <td>${item.pola || '-'}</td>
        <td>${item.tahunPatan || '-'}</td>
        <td>${item.jmlKK.toLocaleString()}</td>
        <td>${item.bebanTugasSHM.toLocaleString()}</td>
        <td>${item.totalKasus}</td>
        <td><span class="status-badge ${status}">${statusText}</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-edit" onclick="editData(${item.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteData(${item.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    
    startRecord.textContent = filteredData.length > 0 ? startIndex + 1 : 0;
    endRecord.textContent = endIndex;
    
    // Update pagination buttons
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages;
    
    // Generate page numbers
    pageNumbers.innerHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        pageNumbers.appendChild(pageBtn);
    }
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    renderTable();
}

// Search functionality
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const provinsiValue = provinsiFilter.value;
    const statusValue = statusFilter.value;
    
    filteredData = currentData.filter(item => {
        let matchesSearch = true;
        let matchesProvinsi = true;
        let matchesStatus = true;
        
        // Search filter
        if (searchTerm) {
            matchesSearch = item.provinsi.toLowerCase().includes(searchTerm) ||
                           item.kabupaten.toLowerCase().includes(searchTerm) ||
                           item.pola?.toLowerCase().includes(searchTerm) ||
                           item.tahunPatan?.toLowerCase().includes(searchTerm);
        }
        
        // Provinsi filter
        if (provinsiValue) {
            matchesProvinsi = item.provinsi === provinsiValue;
        }
        
        // Status filter
        if (statusValue) {
            const hasProblems = item.permasalahanOKUMasy || item.permasalahanPerusahaan || 
                               item.permasalahanKwsHutan || item.permasalahanMHA || 
                               item.permasalahanInstansi || item.permasalahanLainLain;
            
            if (statusValue === 'active') {
                matchesStatus = hasProblems;
            } else if (statusValue === 'inactive') {
                matchesStatus = !hasProblems;
            }
        }
        
        return matchesSearch && matchesProvinsi && matchesStatus;
    });
    
    currentPage = 1;
    updateTotalRecords();
    renderTable();
}

// Clear all filters
function clearFilters() {
    searchInput.value = '';
    provinsiFilter.value = '';
    statusFilter.value = '';
    filteredData = [...currentData];
    currentPage = 1;
    updateTotalRecords();
    renderTable();
}

// Edit data
function editData(id) {
    editingId = id;
    const item = currentData.find(data => data.id === id);
    if (!item) return;
    
    // Populate edit form
    document.getElementById('editId').value = item.id;
    document.getElementById('editProvinsi').value = item.provinsi;
    document.getElementById('editKabupaten').value = item.kabupaten;
    document.getElementById('editPola').value = item.pola || '';
    document.getElementById('editTahunPatan').value = item.tahunPatan || '';
    document.getElementById('editTahunSerah').value = item.tahunSerah || '';
    document.getElementById('editJmlKK').value = item.jmlKK;
    document.getElementById('editBebanTugasSHM').value = item.bebanTugasSHM;
    document.getElementById('editHPL').value = item.hpl || '';
    document.getElementById('editTotalKasus').value = item.totalKasus;
    
    // Checkboxes
    document.getElementById('editStatusBinaBlmHPL').checked = item.statusBinaBlmHPL;
    document.getElementById('editStatusBinaSdhHPL').checked = item.statusBinaSdhHPL;
    document.getElementById('editStatusBinaTdkHPL').checked = item.statusBinaTdkHPL;
    document.getElementById('editStatusSerahSdhHPL').checked = item.statusSerahSdhHPL;
    document.getElementById('editStatusSerahSKSerah').value = item.statusSerahSKSerah || '';
    
    document.getElementById('editPermasalahanOKUMasy').checked = item.permasalahanOKUMasy;
    document.getElementById('editPermasalahanPerusahaan').checked = item.permasalahanPerusahaan;
    document.getElementById('editPermasalahanKwsHutan').checked = item.permasalahanKwsHutan;
    document.getElementById('editPermasalahanMHA').checked = item.permasalahanMHA;
    document.getElementById('editPermasalahanInstansi').checked = item.permasalahanInstansi;
    document.getElementById('editPermasalahanLainLain').checked = item.permasalahanLainLain;
    
    // Textareas
    document.getElementById('editDeskripsiPermasalahan').value = item.deskripsiPermasalahan || '';
    document.getElementById('editTindakLanjut').value = item.tindakLanjut || '';
    document.getElementById('editRekomendasi').value = item.rekomendasi || '';
    
    // Show modal
    document.getElementById('editModal').style.display = 'block';
}

// Save data to file (persistent storage)
function saveDataToFile() {
    try {
        // Create updated data.js content
        const dataContent = `// Trans-Data Dashboard Data
// File terpisah untuk menyimpan semua data dashboard

const dashboardData = ${JSON.stringify(currentData, null, 4)};

// Export data untuk browser
if (typeof window !== 'undefined') {
    window.dashboardData = dashboardData;
}`;

        // Create download link for updated data.js
        const blob = new Blob([dataContent], { type: 'application/javascript' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'data.js');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('Data berhasil disimpan! File data.js telah di-download. Silakan ganti file data.js yang lama dengan yang baru.');
        return true;
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Gagal menyimpan data: ' + error.message);
        return false;
    }
}

// Save data to localStorage as backup
function saveToLocalStorage() {
    try {
        localStorage.setItem('dashboardData', JSON.stringify(currentData));
        localStorage.setItem('lastSaved', new Date().toISOString());
        console.log('Data saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// Load data from localStorage
function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('dashboardData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            currentData = parsedData;
            dashboardData.length = 0;
            dashboardData.push(...parsedData);
            console.log('Data loaded from localStorage');
            return true;
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
    return false;
}

// Auto-save functionality
function autoSave() {
    saveToLocalStorage();
    updateDataStatus('saved');
}

// Update data status display
function updateDataStatus(status) {
    const dataStatus = document.getElementById('dataStatus');
    if (!dataStatus) return;
    
    dataStatus.className = `data-status ${status}`;
    
    switch (status) {
        case 'saved':
            dataStatus.innerHTML = '<i class="fas fa-check-circle"></i><span>Data tersimpan di localStorage</span>';
            break;
        case 'unsaved':
            dataStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Ada perubahan yang belum disimpan</span>';
            break;
        default:
            dataStatus.innerHTML = '<i class="fas fa-info-circle"></i><span>Data tersimpan di memory browser</span>';
    }
}

// Check for unsaved changes
function checkForUnsavedChanges() {
    const savedData = localStorage.getItem('dashboardData');
    if (savedData) {
        const saved = JSON.parse(savedData);
        const current = JSON.stringify(currentData);
        if (saved !== current) {
            updateDataStatus('unsaved');
            return true;
        }
    }
    updateDataStatus('saved');
    return false;
}

// Save edited data
function saveEditedData(formData) {
    const index = currentData.findIndex(item => item.id === editingId);
    if (index === -1) return false;
    
    // Update data
    currentData[index] = {
        ...currentData[index],
        provinsi: formData.provinsi,
        kabupaten: formData.kabupaten,
        pola: formData.pola,
        tahunPatan: formData.tahunPatan,
        tahunSerah: formData.tahunSerah,
        jmlKK: parseInt(formData.jmlKK),
        bebanTugasSHM: parseInt(formData.bebanTugasSHM),
        hpl: formData.hpl,
        totalKasus: parseInt(formData.totalKasus),
        statusBinaBlmHPL: formData.statusBinaBlmHPL,
        statusBinaSdhHPL: formData.statusBinaSdhHPL,
        statusBinaTdkHPL: formData.statusBinaTdkHPL,
        statusSerahSdhHPL: formData.statusSerahSdhHPL,
        statusSerahSKSerah: formData.statusSerahSKSerah,
        permasalahanOKUMasy: formData.permasalahanOKUMasy,
        permasalahanPerusahaan: formData.permasalahanPerusahaan,
        permasalahanKwsHutan: formData.permasalahanKwsHutan,
        permasalahanMHA: formData.permasalahanMHA,
        permasalahanInstansi: formData.permasalahanInstansi,
        permasalahanLainLain: formData.permasalahanLainLain,
        deskripsiPermasalahan: formData.deskripsiPermasalahan,
        tindakLanjut: formData.tindakLanjut,
        rekomendasi: formData.rekomendasi
    };
    
    // Update global dashboardData
    const globalIndex = dashboardData.findIndex(item => item.id === editingId);
    if (globalIndex !== -1) {
        dashboardData[globalIndex] = currentData[index];
    }
    
    // Auto-save
    autoSave();
    
    return true;
}

// Delete data
function deleteData(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
    
    // Remove from current data
    currentData = currentData.filter(item => item.id !== id);
    
    // Remove from global dashboardData
    dashboardData = dashboardData.filter(item => item.id !== id);
    
    // Auto-save
    autoSave();
    
    // Re-render
    performSearch();
}

// Add new data
function addNewData(formData) {
    const newId = Math.max(...currentData.map(item => item.id)) + 1;
    
    const newItem = {
        id: newId,
        provinsi: formData.provinsi,
        kabupaten: formData.kabupaten,
        pola: formData.pola,
        tahunPatan: formData.tahunPatan,
        tahunSerah: formData.tahunSerah,
        jmlKK: parseInt(formData.jmlKK),
        bebanTugasSHM: parseInt(formData.bebanTugasSHM),
        hpl: formData.hpl,
        statusBinaBlmHPL: formData.statusBinaBlmHPL,
        statusBinaSdhHPL: formData.statusBinaSdhHPL,
        statusBinaTdkHPL: formData.statusBinaTdkHPL,
        statusSerahSdhHPL: formData.statusSerahSdhHPL,
        statusSerahSKSerah: formData.statusSerahSKSerah,
        permasalahanOKUMasy: formData.permasalahanOKUMasy,
        permasalahanPerusahaan: formData.permasalahanPerusahaan,
        permasalahanKwsHutan: formData.permasalahanKwsHutan,
        permasalahanMHA: formData.permasalahanMHA,
        permasalahanInstansi: formData.permasalahanInstansi,
        permasalahanLainLain: formData.permasalahanLainLain,
        totalKasus: parseInt(formData.totalKasus),
        deskripsiPermasalahan: formData.deskripsiPermasalahan,
        tindakLanjut: formData.tindakLanjut,
        rekomendasi: formData.rekomendasi
    };
    
    // Add to current data
    currentData.push(newItem);
    
    // Add to global dashboardData
    dashboardData.push(newItem);
    
    // Auto-save
    autoSave();
    
    // Re-render
    performSearch();
}

// Export data to CSV
function exportToCSV() {
    const headers = [
        'ID', 'Provinsi', 'Kabupaten', 'Pola', 'Tahun Patan', 'Tahun Serah',
        'Jumlah KK', 'Beban Tugas SHM', 'HPL', 'Total Kasus',
        'Status Bina Blm HPL', 'Status Bina Sdh HPL', 'Status Bina Tdk HPL',
        'Status Serah Sdh HPL', 'Status Serah SK Serah',
        'Permasalahan Masyarakat', 'Permasalahan Perusahaan', 'Permasalahan Kawasan Hutan',
        'Permasalahan MHA', 'Permasalahan Instansi', 'Permasalahan Lain-lain',
        'Deskripsi Permasalahan', 'Tindak Lanjut', 'Rekomendasi'
    ];
    
    const csvContent = [
        headers.join(','),
        ...filteredData.map(item => [
            item.id,
            `"${item.provinsi}"`,
            `"${item.kabupaten}"`,
            `"${item.pola || ''}"`,
            `"${item.tahunPatan || ''}"`,
            `"${item.tahunSerah || ''}"`,
            item.jmlKK,
            item.bebanTugasSHM,
            `"${item.hpl || ''}"`,
            item.totalKasus,
            item.statusBinaBlmHPL,
            item.statusBinaSdhHPL,
            item.statusBinaTdkHPL,
            item.statusSerahSdhHPL,
            `"${item.statusSerahSKSerah || ''}"`,
            item.permasalahanOKUMasy,
            item.permasalahanPerusahaan,
            item.permasalahanKwsHutan,
            item.permasalahanMHA,
            item.permasalahanInstansi,
            item.permasalahanLainLain,
            `"${item.deskripsiPermasalahan || ''}"`,
            `"${item.tindakLanjut || ''}"`,
            `"${item.rekomendasi || ''}"`
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data_transmigrasi_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Import data from CSV
function importFromCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        const importedData = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            const values = lines[i].split(',');
            const item = {};
            
            headers.forEach((header, index) => {
                const value = values[index] || '';
                const cleanValue = value.replace(/"/g, '').trim();
                
                switch (header.trim()) {
                    case 'ID':
                        item.id = parseInt(cleanValue) || 0;
                        break;
                    case 'Provinsi':
                        item.provinsi = cleanValue;
                        break;
                    case 'Kabupaten':
                        item.kabupaten = cleanValue;
                        break;
                    case 'Pola':
                        item.pola = cleanValue;
                        break;
                    case 'Tahun Patan':
                        item.tahunPatan = cleanValue;
                        break;
                    case 'Tahun Serah':
                        item.tahunSerah = cleanValue;
                        break;
                    case 'Jumlah KK':
                        item.jmlKK = parseInt(cleanValue) || 0;
                        break;
                    case 'Beban Tugas SHM':
                        item.bebanTugasSHM = parseInt(cleanValue) || 0;
                        break;
                    case 'HPL':
                        item.hpl = cleanValue;
                        break;
                    case 'Total Kasus':
                        item.totalKasus = parseInt(cleanValue) || 0;
                        break;
                    case 'Status Bina Blm HPL':
                        item.statusBinaBlmHPL = cleanValue === 'true';
                        break;
                    case 'Status Bina Sdh HPL':
                        item.statusBinaSdhHPL = cleanValue === 'true';
                        break;
                    case 'Status Bina Tdk HPL':
                        item.statusBinaTdkHPL = cleanValue === 'true';
                        break;
                    case 'Status Serah Sdh HPL':
                        item.statusSerahSdhHPL = cleanValue === 'true';
                        break;
                    case 'Status Serah SK Serah':
                        item.statusSerahSKSerah = cleanValue;
                        break;
                    case 'Permasalahan Masyarakat':
                        item.permasalahanOKUMasy = cleanValue === 'true';
                        break;
                    case 'Permasalahan Perusahaan':
                        item.permasalahanPerusahaan = cleanValue === 'true';
                        break;
                    case 'Permasalahan Kawasan Hutan':
                        item.permasalahanKwsHutan = cleanValue === 'true';
                        break;
                    case 'Permasalahan MHA':
                        item.permasalahanMHA = cleanValue === 'true';
                        break;
                    case 'Permasalahan Instansi':
                        item.permasalahanInstansi = cleanValue === 'true';
                        break;
                    case 'Permasalahan Lain-lain':
                        item.permasalahanLainLain = cleanValue === 'true';
                        break;
                    case 'Deskripsi Permasalahan':
                        item.deskripsiPermasalahan = cleanValue;
                        break;
                    case 'Tindak Lanjut':
                        item.tindakLanjut = cleanValue;
                        break;
                    case 'Rekomendasi':
                        item.rekomendasi = cleanValue;
                        break;
                }
            });
            
            if (item.id && item.provinsi && item.kabupaten) {
                importedData.push(item);
            }
        }
        
        // Add imported data
        importedData.forEach(item => {
            if (!currentData.find(existing => existing.id === item.id)) {
                currentData.push(item);
                dashboardData.push(item);
            }
        });
        
        alert(`Berhasil mengimpor ${importedData.length} data baru`);
        performSearch();
    };
    
    reader.readAsText(file);
}

// Setup event listeners
function setupEventListeners() {
    // Search and filter
    searchInput.addEventListener('input', performSearch);
    provinsiFilter.addEventListener('change', performSearch);
    statusFilter.addEventListener('change', performSearch);
    clearFiltersBtn.addEventListener('click', clearFilters);
    
    // Pagination
    prevPage.addEventListener('click', () => {
        if (currentPage > 1) goToPage(currentPage - 1);
    });
    nextPage.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) goToPage(currentPage + 1);
    });
    
    // Action buttons
    addNewBtn.addEventListener('click', () => {
        document.getElementById('addModal').style.display = 'block';
    });
    
    exportDataBtn.addEventListener('click', exportToCSV);
    importDataBtn.addEventListener('click', () => {
        document.getElementById('importModal').style.display = 'block';
    });
    
    // Modal close buttons
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
    });
    
    document.getElementById('closeAddModal').addEventListener('click', () => {
        document.getElementById('addModal').style.display = 'none';
    });
    
    document.getElementById('closeImportModal').addEventListener('click', () => {
        document.getElementById('importModal').style.display = 'none';
    });
    
    // Cancel buttons
    document.getElementById('cancelEdit').addEventListener('click', () => {
        document.getElementById('editModal').style.display = 'none';
    });
    
    document.getElementById('cancelAdd').addEventListener('click', () => {
        document.getElementById('addModal').style.display = 'none';
    });
    
    document.getElementById('cancelImport').addEventListener('click', () => {
        document.getElementById('importModal').style.display = 'none';
    });
    
    // Form submissions
    document.getElementById('editForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            provinsi: document.getElementById('editProvinsi').value,
            kabupaten: document.getElementById('editKabupaten').value,
            pola: document.getElementById('editPola').value,
            tahunPatan: document.getElementById('editTahunPatan').value,
            tahunSerah: document.getElementById('editTahunSerah').value,
            jmlKK: document.getElementById('editJmlKK').value,
            bebanTugasSHM: document.getElementById('editBebanTugasSHM').value,
            hpl: document.getElementById('editHPL').value,
            totalKasus: document.getElementById('editTotalKasus').value,
            statusBinaBlmHPL: document.getElementById('editStatusBinaBlmHPL').checked,
            statusBinaSdhHPL: document.getElementById('editStatusBinaSdhHPL').checked,
            statusBinaTdkHPL: document.getElementById('editStatusBinaTdkHPL').checked,
            statusSerahSdhHPL: document.getElementById('editStatusSerahSdhHPL').checked,
            statusSerahSKSerah: document.getElementById('editStatusSerahSKSerah').value,
            permasalahanOKUMasy: document.getElementById('editPermasalahanOKUMasy').checked,
            permasalahanPerusahaan: document.getElementById('editPermasalahanPerusahaan').checked,
            permasalahanKwsHutan: document.getElementById('editPermasalahanKwsHutan').checked,
            permasalahanMHA: document.getElementById('editPermasalahanMHA').checked,
            permasalahanInstansi: document.getElementById('editPermasalahanInstansi').checked,
            permasalahanLainLain: document.getElementById('editPermasalahanLainLain').checked,
            deskripsiPermasalahan: document.getElementById('editDeskripsiPermasalahan').value,
            tindakLanjut: document.getElementById('editTindakLanjut').value,
            rekomendasi: document.getElementById('editRekomendasi').value
        };
        
        if (saveEditedData(formData)) {
            document.getElementById('editModal').style.display = 'none';
            alert('Data berhasil diperbarui');
        }
    });
    
    document.getElementById('addForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            provinsi: document.getElementById('addProvinsi').value,
            kabupaten: document.getElementById('addKabupaten').value,
            pola: document.getElementById('addPola').value,
            tahunPatan: document.getElementById('addTahunPatan').value,
            tahunSerah: document.getElementById('addTahunSerah').value,
            jmlKK: document.getElementById('addJmlKK').value,
            bebanTugasSHM: document.getElementById('addBebanTugasSHM').value,
            hpl: document.getElementById('addHPL').value,
            totalKasus: document.getElementById('addTotalKasus').value,
            statusBinaBlmHPL: document.getElementById('addStatusBinaBlmHPL').checked,
            statusBinaSdhHPL: document.getElementById('addStatusBinaSdhHPL').checked,
            statusBinaTdkHPL: document.getElementById('addStatusBinaTdkHPL').checked,
            statusSerahSdhHPL: document.getElementById('addStatusSerahSdhHPL').checked,
            statusSerahSKSerah: document.getElementById('addStatusSerahSKSerah').value,
            permasalahanOKUMasy: document.getElementById('addPermasalahanOKUMasy').checked,
            permasalahanPerusahaan: document.getElementById('addPermasalahanPerusahaan').checked,
            permasalahanKwsHutan: document.getElementById('addPermasalahanKwsHutan').checked,
            permasalahanMHA: document.getElementById('addPermasalahanMHA').checked,
            permasalahanInstansi: document.getElementById('addPermasalahanInstansi').checked,
            permasalahanLainLain: document.getElementById('addPermasalahanLainLain').checked,
            deskripsiPermasalahan: document.getElementById('addDeskripsiPermasalahan').value,
            tindakLanjut: document.getElementById('addTindakLanjut').value,
            rekomendasi: document.getElementById('addRekomendasi').value
        };
        
        addNewData(formData);
        document.getElementById('addModal').style.display = 'none';
        document.getElementById('addForm').reset();
        alert('Data berhasil ditambahkan');
    });
    
    document.getElementById('processImport').addEventListener('click', () => {
        const fileInput = document.getElementById('csvFile');
        const file = fileInput.files[0];
        
        if (file) {
            importFromCSV(file);
            document.getElementById('importModal').style.display = 'none';
            fileInput.value = '';
        } else {
            alert('Silakan pilih file CSV terlebih dahulu');
        }
    });

    // Save data to file button
    document.getElementById('saveDataBtn').addEventListener('click', saveDataToFile);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modals = ['editModal', 'addModal', 'importModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initDataTable);

// Global functions for onclick handlers
window.editData = editData;
window.deleteData = deleteData;
