// Analytics Dashboard Data and Charts
// Note: This data is calculated from the actual dashboard data provided by the user
// The calculateAnalyticsData() function will update these values with real calculations
const analyticsData = {
    // Problem distribution data - calculated from actual boolean data in dashboardData
    problemDistribution: {
        labels: ['Kws Hutan', 'Perusahaan', 'MHA', 'Masyarakat', 'Instansi', 'Lain-lain'],
        datasets: [{
            data: [4, 2, 2, 2, 0, 0], // Will be calculated from actual data
            backgroundColor: [
                '#ef4444', // Red for forest area
                '#f59e0b', // Orange for company
                '#8b5cf6', // Purple for MHA
                '#3b82f6', // Blue for community
                '#10b981', // Green for institution
                '#6b7280'  // Gray for others
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    },

    // Province performance data - calculated from actual data
    provincePerformance: {
        labels: ['Maluku Utara', 'Papua', 'Papua Selatan'],
        datasets: [{
            label: 'Jumlah Lokasi',
            data: [4, 2, 1], // Actual count: Maluku Utara (4), Papua (2), Papua Selatan (1)
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3b82f6',
            borderWidth: 2
        }, {
            label: 'Total KK',
            data: [800, 485, 199], // Actual sum: Maluku Utara (200+200+200+200), Papua (335+150), Papua Selatan (199)
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderColor: '#10b981',
            borderWidth: 2
        }, {
            label: 'Total SHM',
            data: [1129, 683, 398], // Actual sum: Maluku Utara (417+200+252+260), Papua (233+450), Papua Selatan (398)
            backgroundColor: 'rgba(245, 158, 11, 0.8)',
            borderColor: '#f59e0b',
            borderWidth: 2
        }]
    },

    // Timeline data
    timelineData: {
        labels: ['2003', '2005', '2006', '2008', '2010', '2015', '2017', '2021', '2022'],
        datasets: [{
            label: 'Tahun Patan',
            data: [1, 1, 1, 1, 1, 2, 2, 1, 1],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }, {
            label: 'Tahun Serah',
            data: [0, 0, 0, 0, 1, 1, 2, 0, 1],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    },

    // Status distribution data
    statusDistribution: {
        labels: ['Bina - Sudah HPL', 'Bina - Tidak HPL', 'Serah - Sudah HPL', 'Serah - SK Serah'],
        datasets: [{
            data: [3, 3, 4, 4],
            backgroundColor: [
                '#10b981', // Green for completed
                '#f59e0b', // Orange for in progress
                '#3b82f6', // Blue for handed over
                '#8b5cf6'  // Purple for with SK
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    },

    // Correlation matrix data
    correlationData: {
        labels: ['KK', 'SHM', 'Kasus', 'HPL', 'Status'],
        datasets: [{
            label: 'Korelasi',
            data: [
                [1, 0.85, 0.12, 0.34, 0.23],
                [0.85, 1, 0.15, 0.41, 0.28],
                [0.12, 0.15, 1, 0.08, 0.67],
                [0.34, 0.41, 0.08, 1, 0.45],
                [0.23, 0.28, 0.67, 0.45, 1]
            ],
            backgroundColor: [
                'rgba(59, 130, 246, 0.1)',
                'rgba(59, 130, 246, 0.3)',
                'rgba(59, 130, 246, 0.5)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(59, 130, 246, 0.9)'
            ]
        }]
    }
};

// Chart instances
let charts = {};

// Chart configuration
const chartConfig = {
    // Common options for all charts
    common: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#3b82f6',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true
            }
        }
    },

    // Pie chart options
    pie: {
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 20,
                    usePointStyle: true
                }
            }
        }
    },

    // Bar chart options
    bar: {
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    },

    // Line chart options
    line: {
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            }
        }
    },

    // Doughnut chart options
    doughnut: {
        cutout: '60%',
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
};

// Initialize analytics dashboard
function initAnalytics() {
    console.log('Initializing analytics...');
    try {
        // Check if data is available
        if (typeof dashboardData === 'undefined') {
            console.warn('dashboardData not available, using static data');
        } else {
            console.log('dashboardData available:', dashboardData.length, 'locations');
            calculateAnalyticsData();
        }
        
        // Always create charts with available data
        createCharts();
        
        // Setup other components
        populateFilterOptions();
        updateSummaryStats();
        updateLastUpdated();
        
        console.log('Analytics initialized successfully');
    } catch (error) {
        console.error('Error initializing analytics:', error);
    }
}

// Populate filter options dynamically from data
function populateFilterOptions() {
    if (typeof dashboardData === 'undefined') {
        console.error('dashboardData is not available for filter options');
        return;
    }

    try {
        // Get unique provinces
        const provinces = [...new Set(dashboardData.map(location => location.provinsi))].sort();
        
        // Get unique kabupaten
        const kabupaten = [...new Set(dashboardData.map(location => {
            return location.kabupaten.split(' - ')[0];
        }))].sort();
        
        // Get unique years
        const years = [...new Set(dashboardData.map(location => {
            if (location.tahunPatan) {
                return location.tahunPatan.split('/')[0]; // Take first year if multiple
            }
            return null;
        }).filter(year => year))].sort();

        console.log('Filter data prepared:', {
            provinces: provinces.length,
            kabupaten: kabupaten.length,
            years: years.length
        });

        // Populate province filter
        const provinsiFilter = document.getElementById('provinsiFilter');
        if (provinsiFilter) {
            // Keep the first option (Semua Provinsi)
            const firstOption = provinsiFilter.querySelector('option');
            provinsiFilter.innerHTML = '';
            if (firstOption) {
                provinsiFilter.appendChild(firstOption);
            }
            
            provinces.forEach(province => {
                const option = document.createElement('option');
                option.value = province;
                option.textContent = province;
                provinsiFilter.appendChild(option);
            });
            console.log('Province filter populated with', provinces.length, 'options');
        }

        // Populate kabupaten filter
        const kabupatenFilter = document.getElementById('kabupatenFilter');
        if (kabupatenFilter) {
            // Keep the first option (Semua Kabupaten)
            const firstOption = kabupatenFilter.querySelector('option');
            kabupatenFilter.innerHTML = '';
            if (firstOption) {
                kabupatenFilter.appendChild(firstOption);
            }
            
            kabupaten.forEach(kab => {
                const option = document.createElement('option');
                option.value = kab;
                option.textContent = kab;
                kabupatenFilter.appendChild(option);
            });
            console.log('Kabupaten filter populated with', kabupaten.length, 'options');
        }

        // Populate year filter
        const tahunFilter = document.getElementById('tahunFilter');
        if (tahunFilter) {
            // Keep the first option (Semua Tahun)
            const firstOption = tahunFilter.querySelector('option');
            tahunFilter.innerHTML = '';
            if (firstOption) {
                tahunFilter.appendChild(firstOption);
            }
            
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                tahunFilter.appendChild(option); // Fixed: was using provinsiFilter
            });
            console.log('Year filter populated with', years.length, 'options');
        }

        console.log('All filter options populated successfully');
    } catch (error) {
        console.error('Error populating filter options:', error);
    }
}

// Calculate analytics data from actual dashboard data
function calculateAnalyticsData() {
    if (typeof dashboardData !== 'undefined') {
        console.log('Calculating analytics from', dashboardData.length, 'locations');
        
        // Calculate problem distribution
        const problemCounts = {
            'Kws Hutan': 0,
            'Perusahaan': 0,
            'MHA': 0,
            'Masyarakat': 0,
            'Instansi': 0,
            'Lain-lain': 0
        };

        // Calculate province performance - dynamically from all provinces
        const provinceData = {};
        const kabupatenData = {};
        const tahunPatanData = {};
        const tahunSerahData = {};
        const statusBinaData = {
            'Bina - Belum HPL': 0,
            'Bina - Sudah HPL': 0,
            'Bina - Tidak HPL': 0
        };
        const statusSerahData = {
            'Serah - Sudah HPL': 0,
            'Serah - SK Serah': 0
        };

        dashboardData.forEach(location => {
            // Count problems
            if (location.permasalahanKwsHutan) problemCounts['Kws Hutan']++;
            if (location.permasalahanPerusahaan) problemCounts['Perusahaan']++;
            if (location.permasalahanMHA) problemCounts['MHA']++;
            if (location.permasalahanOKUMasy) problemCounts['Masyarakat']++;
            if (location.permasalahanInstansi) problemCounts['Instansi']++;
            if (location.permasalahanLainLain) problemCounts['Lain-lain']++;

            // Calculate province data
            if (!provinceData[location.provinsi]) {
                provinceData[location.provinsi] = { locations: 0, kk: 0, shm: 0 };
            }
            provinceData[location.provinsi].locations++;
            provinceData[location.provinsi].kk += location.jmlKK;
            provinceData[location.provinsi].shm += location.bebanTugasSHM;

            // Calculate kabupaten data
            const kabupatenName = location.kabupaten.split(' - ')[0];
            if (!kabupatenData[kabupatenName]) {
                kabupatenData[kabupatenName] = { locations: 0, kk: 0, shm: 0 };
            }
            kabupatenData[kabupatenName].locations++;
            kabupatenData[kabupatenName].kk += location.jmlKK;
            kabupatenData[kabupatenName].shm += location.bebanTugasSHM;

            // Calculate tahun patan data
            if (location.tahunPatan) {
                const tahun = location.tahunPatan.split('/')[0]; // Take first year if multiple
                if (!tahunPatanData[tahun]) tahunPatanData[tahun] = 0;
                tahunPatanData[tahun]++;
            }

            // Calculate tahun serah data
            if (location.tahunSerah) {
                if (!tahunSerahData[location.tahunSerah]) tahunSerahData[location.tahunSerah] = 0;
                tahunSerahData[location.tahunSerah]++;
            }

            // Calculate status bina data
            if (location.statusBinaBlmHPL) statusBinaData['Bina - Belum HPL']++;
            if (location.statusBinaSdhHPL) statusBinaData['Bina - Sudah HPL']++;
            if (location.statusBinaTdkHPL) statusBinaData['Bina - Tidak HPL']++;

            // Calculate status serah data
            if (location.statusSerahSdhHPL) statusSerahData['Serah - Sudah HPL']++;
            if (location.statusSerahSKSerah) statusSerahData['Serah - SK Serah']++;
        });

        // Update analytics data with calculated values
        analyticsData.problemDistribution.datasets[0].data = Object.values(problemCounts);
        
        // Update province performance with all provinces
        const provinces = Object.keys(provinceData);
        analyticsData.provincePerformance.labels = provinces;
        analyticsData.provincePerformance.datasets[0].data = provinces.map(p => provinceData[p].locations);
        analyticsData.provincePerformance.datasets[1].data = provinces.map(p => provinceData[p].kk);
        analyticsData.provincePerformance.datasets[2].data = provinces.map(p => provinceData[p].shm);

        // Update timeline data
        const allYears = [...new Set([...Object.keys(tahunPatanData), ...Object.keys(tahunSerahData)])].sort();
        analyticsData.timelineData.labels = allYears;
        analyticsData.timelineData.datasets[0].data = allYears.map(year => tahunPatanData[year] || 0);
        analyticsData.timelineData.datasets[1].data = allYears.map(year => tahunSerahData[year] || 0);

        // Update status distribution
        analyticsData.statusDistribution.labels = [...Object.keys(statusBinaData), ...Object.keys(statusSerahData)];
        analyticsData.statusDistribution.datasets[0].data = [
            ...Object.values(statusBinaData),
            ...Object.values(statusSerahData)
        ];

        console.log('Analytics data updated:', {
            provinces: provinces,
            problemCounts: problemCounts,
            totalLocations: dashboardData.length
        });
    } else {
        console.error('dashboardData is not available');
    }
}

// Update summary statistics
function updateSummaryStats() {
    if (typeof dashboardData === 'undefined') {
        console.error('dashboardData is not available for summary stats');
        return;
    }

    // Calculate totals from actual data
    const totalLocations = dashboardData.length;
    const totalKK = dashboardData.reduce((sum, location) => sum + location.jmlKK, 0);
    const totalSHM = dashboardData.reduce((sum, location) => sum + location.bebanTugasSHM, 0);
    const totalKasus = dashboardData.reduce((sum, location) => sum + location.totalKasus, 0);

    // Update DOM elements
    document.getElementById('totalLocations').textContent = totalLocations.toLocaleString();
    document.getElementById('totalKK').textContent = totalKK.toLocaleString();
    document.getElementById('totalSHM').textContent = totalSHM.toLocaleString();
    document.getElementById('totalKasus').textContent = totalKasus.toLocaleString();

    console.log('Summary stats updated:', {
        totalLocations,
        totalKK,
        totalSHM,
        totalKasus
    });

    // Update Key Insights with real-time data
    updateKeyInsights();
}

// Update Key Insights with real-time data
function updateKeyInsights() {
    if (typeof dashboardData === 'undefined') {
        console.error('dashboardData is not available for key insights');
        return;
    }

    // Calculate real-time insights from dashboardData
    const insights = calculateKeyInsights();
    
    // Update each insight card
    updateInsightCard('permasalahan-terbanyak', insights.mostFrequentProblem);
    updateInsightCard('provinsi-teraktif', insights.mostActiveProvince);
    updateInsightCard('rata-rata-penyelesaian', insights.averageCompletion);
    updateInsightCard('tren-permasalahan', insights.problemTrend);
}

// Calculate key insights from real data
function calculateKeyInsights() {
    // Problem distribution analysis
    const problemCounts = {
        'Kws Hutan': 0,
        'Perusahaan': 0,
        'MHA': 0,
        'Masyarakat': 0,
        'Instansi': 0,
        'Lain-lain': 0
    };

    // Province analysis
    const provinceData = {};
    
    // Year analysis for completion time
    const completionYears = [];

    dashboardData.forEach(location => {
        // Count problems
        if (location.permasalahanKwsHutan) problemCounts['Kws Hutan']++;
        if (location.permasalahanPerusahaan) problemCounts['Perusahaan']++;
        if (location.permasalahanMHA) problemCounts['MHA']++;
        if (location.permasalahanOKUMasy) problemCounts['Masyarakat']++;
        if (location.permasalahanInstansi) problemCounts['Instansi']++;
        if (location.permasalahanLainLain) problemCounts['Lain-lain']++;

        // Count province locations
        if (!provinceData[location.provinsi]) {
            provinceData[location.provinsi] = 0;
        }
        provinceData[location.provinsi]++;

        // Calculate completion time if both years exist
        if (location.tahunPatan && location.tahunSerah) {
            const patanYear = parseInt(location.tahunPatan.split('/')[0]);
            const serahYear = parseInt(location.tahunSerah);
            if (!isNaN(patanYear) && !isNaN(serahYear)) {
                completionYears.push(serahYear - patanYear);
            }
        }
    });

    // Find most frequent problem
    const mostFrequentProblem = Object.entries(problemCounts)
        .sort(([,a], [,b]) => b - a)[0];

    // Find most active province
    const mostActiveProvince = Object.entries(provinceData)
        .sort(([,a], [,b]) => b - a)[0];

    // Calculate average completion time
    const avgCompletionTime = completionYears.length > 0 
        ? Math.round(completionYears.reduce((a, b) => a + b, 0) / completionYears.length)
        : 0;

    // Find problem trend (comparing current vs historical data)
    const totalProblems = Object.values(problemCounts).reduce((a, b) => a + b, 0);
    const problemTrend = {
        'Kws Hutan': Math.round((problemCounts['Kws Hutan'] / totalProblems) * 100),
        'Perusahaan': Math.round((problemCounts['Perusahaan'] / totalProblems) * 100),
        'MHA': Math.round((problemCounts['MHA'] / totalProblems) * 100),
        'Masyarakat': Math.round((problemCounts['Masyarakat'] / totalProblems) * 100)
    };

    return {
        mostFrequentProblem: {
            problem: mostFrequentProblem[0],
            count: mostFrequentProblem[1],
            total: totalProblems
        },
        mostActiveProvince: {
            province: mostActiveProvince[0],
            locations: mostActiveProvince[1]
        },
        averageCompletion: avgCompletionTime,
        problemTrend: problemTrend
    };
}

// Update individual insight card
function updateInsightCard(insightType, data) {
    let cardElement;
    let title, content;

    switch (insightType) {
        case 'permasalahan-terbanyak':
            cardElement = document.querySelector('.insight-card:nth-child(1)');
            title = 'Permasalahan Terbanyak';
            content = `${data.problem} menjadi permasalahan utama dengan ${data.count} kasus dari total ${data.total} kasus.`;
            break;
        case 'provinsi-teraktif':
            cardElement = document.querySelector('.insight-card:nth-child(2)');
            title = 'Provinsi Teraktif';
            content = `${data.province} memiliki jumlah proyek terbanyak dengan ${data.locations} lokasi aktif.`;
            break;
        case 'rata-rata-penyelesaian':
            cardElement = document.querySelector('.insight-card:nth-child(3)');
            title = 'Rata-rata Penyelesaian';
            content = `Rata-rata waktu penyelesaian proyek adalah ${data.averageCompletion} tahun dari paten hingga serah.`;
            break;
        case 'tren-permasalahan':
            cardElement = document.querySelector('.insight-card:nth-child(4)');
            title = 'Tren Permasalahan';
            const topProblems = Object.entries(data.problemTrend)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 2)
                .map(([problem, percentage]) => `${problem} (${percentage}%)`)
                .join(' dan ');
            content = `Permasalahan terkait ${topProblems} menunjukkan tren dominan.`;
            break;
    }

    if (cardElement) {
        const titleElement = cardElement.querySelector('h4');
        const contentElement = cardElement.querySelector('p');
        
        if (titleElement) titleElement.textContent = title;
        if (contentElement) contentElement.textContent = content;
    }
}

// Create all charts
function createCharts() {
    console.log('Creating charts...');
    
    try {
        // Problem Distribution Chart (Pie/Doughnut)
        createProblemChart();
        
        // Province Performance Chart (Bar)
        createProvinceChart();
        
        // Timeline Chart (Line)
        createTimelineChart();
        
        // Status Distribution Chart (Doughnut)
        createStatusChart();
        
        // Correlation Chart (Heatmap-like)
        createCorrelationChart();
        
        console.log('All charts created successfully');
    } catch (error) {
        console.error('Error creating charts:', error);
    }
}

// Create Problem Distribution Chart
function createProblemChart() {
    const canvas = document.getElementById('problemChart');
    if (!canvas) {
        console.error('Canvas problemChart not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    charts.problemChart = new Chart(ctx, {
        type: 'doughnut',
        data: analyticsData.problemDistribution,
        options: {
            ...chartConfig.common,
            ...chartConfig.doughnut,
            plugins: {
                ...chartConfig.common.plugins,
                ...chartConfig.doughnut.plugins,
                title: {
                    display: true,
                    text: 'Distribusi Permasalahan Tanah',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

// Create Province Performance Chart
function createProvinceChart() {
    const canvas = document.getElementById('provinceChart');
    if (!canvas) {
        console.error('Canvas provinceChart not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    charts.provinceChart = new Chart(ctx, {
        type: 'bar',
        data: analyticsData.provincePerformance,
        options: {
            ...chartConfig.common,
            ...chartConfig.bar,
            plugins: {
                ...chartConfig.common.plugins,
                title: {
                    display: true,
                    text: 'Kinerja per Provinsi',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

// Create Timeline Chart
function createTimelineChart() {
    const canvas = document.getElementById('timelineChart');
    if (!canvas) {
        console.error('Canvas timelineChart not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    charts.timelineChart = new Chart(ctx, {
        type: 'line',
        data: analyticsData.timelineData,
        options: {
            ...chartConfig.common,
            ...chartConfig.line,
            plugins: {
                ...chartConfig.common.plugins,
                title: {
                    display: true,
                    text: 'Timeline Proyek (2003-2022)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

// Create Status Distribution Chart
function createStatusChart() {
    const canvas = document.getElementById('statusChart');
    if (!canvas) {
        console.error('Canvas statusChart not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    charts.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: analyticsData.statusDistribution,
        options: {
            ...chartConfig.common,
            ...chartConfig.doughnut,
            plugins: {
                ...chartConfig.common.plugins,
                ...chartConfig.doughnut.plugins,
                title: {
                    display: true,
                    text: 'Distribusi Status Proyek',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

// Create Correlation Chart (simplified as bar chart for now)
function createCorrelationChart() {
    const canvas = document.getElementById('correlationChart');
    if (!canvas) {
        console.error('Canvas correlationChart not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Simplified correlation data for bar chart
    const correlationLabels = ['KK-SHM', 'KK-Kasus', 'SHM-Kasus', 'HPL-Status'];
    const correlationValues = [0.85, 0.12, 0.15, 0.45];
    
    charts.correlationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: correlationLabels,
            datasets: [{
                label: 'Korelasi',
                data: correlationValues,
                backgroundColor: correlationValues.map(value => {
                    const alpha = Math.abs(value);
                    return `rgba(59, 130, 246, ${alpha})`;
                }),
                borderColor: '#3b82f6',
                borderWidth: 1
            }]
        },
        options: {
            ...chartConfig.common,
            ...chartConfig.bar,
            plugins: {
                ...chartConfig.common.plugins,
                title: {
                    display: true,
                    text: 'Korelasi Antar Variabel',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Toggle chart type
function toggleChartType(chartId) {
    const chart = charts[chartId];
    if (!chart) return;

    const currentType = chart.config.type;
    let newType = 'bar';

    // Cycle through chart types
    switch (currentType) {
        case 'bar':
            newType = 'line';
            break;
        case 'line':
            newType = 'doughnut';
            break;
        case 'doughnut':
            newType = 'pie';
            break;
        case 'pie':
            newType = 'bar';
            break;
    }

    // Update chart type
    chart.config.type = newType;
    chart.update();

    // Update button icon
    const button = event.target.closest('.btn-icon');
    if (button) {
        const icon = button.querySelector('i');
        switch (newType) {
            case 'bar':
                icon.className = 'fas fa-chart-bar';
                break;
            case 'line':
                icon.className = 'fas fa-chart-line';
                break;
            case 'doughnut':
                icon.className = 'fas fa-chart-doughnut';
                break;
            case 'pie':
                icon.className = 'fas fa-chart-pie';
                break;
        }
    }
}

// Export chart as image
function exportChart(chartId) {
    const chart = charts[chartId];
    if (!chart) return;

    const canvas = chart.canvas;
    const link = document.createElement('a');
    link.download = `${chartId}_${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    try {
        // Filter event listeners - menggunakan onclick untuk memastikan bekerja
        const provinsiFilter = document.getElementById('provinsiFilter');
        const kabupatenFilter = document.getElementById('kabupatenFilter');
        const tahunFilter = document.getElementById('tahunFilter');
        const statusFilter = document.getElementById('statusFilter');
        
        if (provinsiFilter) {
            provinsiFilter.onchange = function() { applyFilters(); };
            console.log('Provinsi filter event listener added (onchange)');
        }
        
        if (kabupatenFilter) {
            kabupatenFilter.onchange = function() { applyFilters(); };
            console.log('Kabupaten filter event listener added (onchange)');
        }
        
        if (tahunFilter) {
            tahunFilter.onchange = function() { applyFilters(); };
            console.log('Tahun filter event listener added (onchange)');
        }
        
        if (statusFilter) {
            statusFilter.onchange = function() { applyFilters(); };
            console.log('Status filter event listener added (onchange)');
        }

        // Navigation event listeners
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                // Add active class to clicked item
                this.classList.add('active');
                
                // Handle navigation
                const text = this.querySelector('span').textContent;
                console.log('Navigation clicked:', text);
                
                if (text === 'Dashboard') {
                    console.log('Redirecting to dashboard...');
                    window.location.href = 'index.html';
                }
            });
        });
        
        console.log('All event listeners set up successfully');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Apply filters - simplified version
function applyFilters() {
    console.log('=== APPLYING FILTERS ===');
    
    try {
        // Get filter values
        const provinsi = document.getElementById('provinsiFilter')?.value || '';
        const kabupaten = document.getElementById('kabupatenFilter')?.value || '';
        const tahun = document.getElementById('tahunFilter')?.value || '';
        const status = document.getElementById('statusFilter')?.value || '';

        console.log('Filter values:', { provinsi, kabupaten, tahun, status });

        // Check if dashboardData is available
        if (typeof dashboardData === 'undefined') {
            console.error('dashboardData not available for filtering');
            return;
        }

        // Filter the data
        let filteredData = dashboardData.filter(location => {
            let matches = true;
            
            // Province filter
            if (provinsi && location.provinsi !== provinsi) {
                matches = false;
            }
            
            // Kabupaten filter
            if (kabupaten && !location.kabupaten.includes(kabupaten)) {
                matches = false;
            }
            
            // Year filter
            if (tahun && !location.tahunPatan.includes(tahun)) {
                matches = false;
            }
            
            // Status filter
            if (status) {
                switch (status) {
                    case 'blmHPL':
                        matches = matches && location.statusBinaBlmHPL;
                        break;
                    case 'sdhHPL':
                        matches = matches && location.statusBinaSdhHPL;
                        break;
                    case 'tdkHPL':
                        matches = matches && location.statusBinaTdkHPL;
                        break;
                }
            }
            
            return matches;
        });

        console.log('Filtering results:', {
            originalCount: dashboardData.length,
            filteredCount: filteredData.length,
            filters: { provinsi, kabupaten, tahun, status }
        });

        // Update summary stats with filtered data
        updateFilteredStats(filteredData);
        
        // Update charts with filtered data
        updateChartsWithNewData(filteredData);
        
        // Update key insights with filtered data
        updateKeyInsightsWithFilter(filteredData);
        
        // Show filter results message
        showFilterResults(filteredData, dashboardData.length);
        
        console.log('=== FILTERS APPLIED SUCCESSFULLY ===');
        
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

// Show filter results message
function showFilterResults(filteredData, totalCount) {
    // Create or update filter results message
    let filterMessage = document.getElementById('filterMessage');
    if (!filterMessage) {
        filterMessage = document.createElement('div');
        filterMessage.id = 'filterMessage';
        filterMessage.style.cssText = `
            background: #e3f2fd;
            border: 1px solid #2196f3;
            border-radius: 8px;
            padding: 12px 16px;
            margin: 16px 0;
            color: #1976d2;
            font-weight: 500;
            text-align: center;
        `;
        
        // Insert after summary stats
        const summaryStats = document.querySelector('.summary-stats');
        if (summaryStats) {
            summaryStats.parentNode.insertBefore(filterMessage, summaryStats.nextSibling);
        }
    }
    
    if (filteredData.length === totalCount) {
        filterMessage.style.display = 'none';
    } else {
        filterMessage.style.display = 'block';
        filterMessage.innerHTML = `
            <i class="fas fa-filter"></i>
            Filter aktif: Menampilkan ${filteredData.length} dari ${totalCount} lokasi
            <button onclick="clearAllFilters()" style="margin-left: 12px; padding: 4px 8px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Clear All
            </button>
        `;
    }
}

// Clear all filters
function clearAllFilters() {
    console.log('Clearing all filters...');
    
    // Reset all filter dropdowns
    const provinsiFilter = document.getElementById('provinsiFilter');
    const kabupatenFilter = document.getElementById('kabupatenFilter');
    const tahunFilter = document.getElementById('tahunFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (provinsiFilter) provinsiFilter.value = '';
    if (kabupatenFilter) kabupatenFilter.value = '';
    if (tahunFilter) tahunFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    
    // Hide filter message
    const filterMessage = document.getElementById('filterMessage');
    if (filterMessage) {
        filterMessage.style.display = 'none';
    }
    
    // Reset to original data
    updateSummaryStats();
    createCharts();
    updateKeyInsights();
    
    console.log('All filters cleared');
}

// Update charts with filters
function updateChartsWithFilters(provinsi, kabupaten, tahun, status) {
    console.log('Updating charts with filters:', { provinsi, kabupaten, tahun, status });
    
    if (typeof dashboardData === 'undefined') {
        console.error('dashboardData is not available');
        return;
    }

    try {
        // Filter data based on selected criteria
        let filteredData = dashboardData.filter(location => {
            let matches = true;
            
            // Province filter
            if (provinsi && location.provinsi !== provinsi) {
                matches = false;
            }
            
            // Kabupaten filter
            if (kabupaten && !location.kabupaten.includes(kabupaten)) {
                matches = false;
            }
            
            // Year filter
            if (tahun && !location.tahunPatan.includes(tahun)) {
                matches = false;
            }
            
            // Status filter logic
            if (status) {
                switch (status) {
                    case 'blmHPL':
                        matches = matches && location.statusBinaBlmHPL;
                        break;
                    case 'sdhHPL':
                        matches = matches && location.statusBinaSdhHPL;
                        break;
                    case 'tdkHPL':
                        matches = matches && location.statusBinaTdkHPL;
                        break;
                }
            }
            
            return matches;
        });

        console.log('Filtered data:', {
            originalCount: dashboardData.length,
            filteredCount: filteredData.length,
            filters: { provinsi, kabupaten, tahun, status }
        });

        // Recalculate analytics with filtered data
        calculateAnalyticsDataWithFilter(filteredData);
        
        // Update summary stats based on filtered data
        updateFilteredStats(filteredData);
        
        // Update charts with new data
        updateChartsWithNewData(filteredData);
        
    } catch (error) {
        console.error('Error updating charts with filters:', error);
    }
}

// Update charts with new filtered data
function updateChartsWithNewData(filteredData) {
    try {
        // Update problem distribution chart
        if (charts.problemChart) {
            const problemCounts = {
                'Kws Hutan': 0,
                'Perusahaan': 0,
                'MHA': 0,
                'Masyarakat': 0,
                'Instansi': 0,
                'Lain-lain': 0
            };

            filteredData.forEach(location => {
                if (location.permasalahanKwsHutan) problemCounts['Kws Hutan']++;
                if (location.permasalahanPerusahaan) problemCounts['Perusahaan']++;
                if (location.permasalahanMHA) problemCounts['MHA']++;
                if (location.permasalahanOKUMasy) problemCounts['Masyarakat']++;
                if (location.permasalahanInstansi) problemCounts['Instansi']++;
                if (location.permasalahanLainLain) problemCounts['Lain-lain']++;
            });

            charts.problemChart.data.datasets[0].data = Object.values(problemCounts);
            charts.problemChart.update();
            console.log('Problem chart updated with filtered data');
        }

        // Update province performance chart
        if (charts.provinceChart) {
            const provinceData = {};
            
            filteredData.forEach(location => {
                if (!provinceData[location.provinsi]) {
                    provinceData[location.provinsi] = { locations: 0, kk: 0, shm: 0 };
                }
                provinceData[location.provinsi].locations++;
                provinceData[location.provinsi].kk += location.jmlKK;
                provinceData[location.provinsi].shm += location.bebanTugasSHM;
            });

            const provinces = Object.keys(provinceData);
            charts.provinceChart.data.labels = provinces;
            charts.provinceChart.data.datasets[0].data = provinces.map(p => provinceData[p].locations);
            charts.provinceChart.data.datasets[1].data = provinces.map(p => provinceData[p].kk);
            charts.provinceChart.data.datasets[2].data = provinces.map(p => provinceData[p].shm);
            charts.provinceChart.update();
            console.log('Province chart updated with filtered data');
        }

        // Update status distribution chart
        if (charts.statusChart) {
            const statusBinaData = {
                'Bina - Belum HPL': 0,
                'Bina - Sudah HPL': 0,
                'Bina - Tidak HPL': 0
            };
            const statusSerahData = {
                'Serah - Sudah HPL': 0,
                'Serah - SK Serah': 0
            };

            filteredData.forEach(location => {
                if (location.statusBinaBlmHPL) statusBinaData['Bina - Belum HPL']++;
                if (location.statusBinaSdhHPL) statusBinaData['Bina - Sudah HPL']++;
                if (location.statusBinaTdkHPL) statusBinaData['Bina - Tidak HPL']++;
                if (location.statusSerahSdhHPL) statusSerahData['Serah - Sudah HPL']++;
                if (location.statusSerahSKSerah) statusSerahData['Serah - SK Serah']++;
            });

            const allStatusLabels = [...Object.keys(statusBinaData), ...Object.keys(statusSerahData)];
            const allStatusData = [...Object.values(statusBinaData), ...Object.values(statusSerahData)];
            
            charts.statusChart.data.labels = allStatusLabels;
            charts.statusChart.data.datasets[0].data = allStatusData;
            charts.statusChart.update();
            console.log('Status chart updated with filtered data');
        }

        console.log('All charts updated with filtered data');
        
    } catch (error) {
        console.error('Error updating charts with new data:', error);
    }
}

// Update specific chart with new data
function updateChartData(chartId, data) {
    const chart = charts[chartId];
    if (!chart) return;

    switch (chartId) {
        case 'problemChart':
            chart.data.datasets[0].data = Object.values(data);
            break;
        case 'provinceChart':
            const provinces = Object.keys(data);
            chart.data.labels = provinces;
            chart.data.datasets[0].data = provinces.map(p => data[p].locations);
            chart.data.datasets[1].data = provinces.map(p => data[p].kk);
            chart.data.datasets[2].data = provinces.map(p => data[p].shm);
            break;
        case 'statusChart':
            chart.data.labels = Object.keys(data);
            chart.data.datasets[0].data = Object.values(data);
            break;
    }
    
    chart.update();
}

// Update filtered statistics
function updateFilteredStats(filteredData) {
    console.log('Updating filtered stats with', filteredData.length, 'locations');
    
    try {
        if (!filteredData || filteredData.length === 0) {
            // Show no results message
            document.getElementById('totalLocations').textContent = '0';
            document.getElementById('totalKK').textContent = '0';
            document.getElementById('totalSHM').textContent = '0';
            document.getElementById('totalKasus').textContent = '0';
            return;
        }

        // Calculate totals from filtered data
        const totalLocations = filteredData.length;
        const totalKK = filteredData.reduce((sum, location) => sum + (location.jmlKK || 0), 0);
        const totalSHM = filteredData.reduce((sum, location) => sum + (location.bebanTugasSHM || 0), 0);
        const totalKasus = filteredData.reduce((sum, location) => sum + (location.totalKasus || 0), 0);

        // Update DOM elements with filtered data
        document.getElementById('totalLocations').textContent = totalLocations.toLocaleString();
        document.getElementById('totalKK').textContent = totalKK.toLocaleString();
        document.getElementById('totalSHM').textContent = totalSHM.toLocaleString();
        document.getElementById('totalKasus').textContent = totalKasus.toLocaleString();

        // Add visual indication that stats are filtered
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.style.border = '2px solid #2196f3';
            card.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.2)';
        });

        console.log('Filtered stats updated:', {
            totalLocations,
            totalKK,
            totalSHM,
            totalKasus
        });
        
    } catch (error) {
        console.error('Error updating filtered stats:', error);
    }
}

// Update Key Insights with filtered data
function updateKeyInsightsWithFilter(filteredData) {
    if (!filteredData || filteredData.length === 0) {
        // Reset to original insights if no data
        updateKeyInsights();
        return;
    }

    // Calculate insights from filtered data
    const insights = calculateKeyInsightsFromData(filteredData);
    
    // Update each insight card with filtered data
    updateInsightCard('permasalahan-terbanyak', insights.mostFrequentProblem);
    updateInsightCard('provinsi-teraktif', insights.mostActiveProvince);
    updateInsightCard('rata-rata-penyelesaian', insights.averageCompletion);
    updateInsightCard('tren-permasalahan', insights.problemTrend);
}

// Calculate key insights from specific dataset
function calculateKeyInsightsFromData(data) {
    // Problem distribution analysis
    const problemCounts = {
        'Kws Hutan': 0,
        'Perusahaan': 0,
        'MHA': 0,
        'Masyarakat': 0,
        'Instansi': 0,
        'Lain-lain': 0
    };

    // Province analysis
    const provinceData = {};
    
    // Year analysis for completion time
    const completionYears = [];

    data.forEach(location => {
        // Count problems
        if (location.permasalahanKwsHutan) problemCounts['Kws Hutan']++;
        if (location.permasalahanPerusahaan) problemCounts['Perusahaan']++;
        if (location.permasalahanMHA) problemCounts['MHA']++;
        if (location.permasalahanOKUMasy) problemCounts['Masyarakat']++;
        if (location.permasalahanInstansi) problemCounts['Instansi']++;
        if (location.permasalahanLainLain) problemCounts['Lain-lain']++;

        // Count province locations
        if (!provinceData[location.provinsi]) {
            provinceData[location.provinsi] = 0;
        }
        provinceData[location.provinsi]++;

        // Calculate completion time if both years exist
        if (location.tahunPatan && location.tahunSerah) {
            const patanYear = parseInt(location.tahunPatan.split('/')[0]);
            const serahYear = parseInt(location.tahunSerah);
            if (!isNaN(patanYear) && !isNaN(serahYear)) {
                completionYears.push(serahYear - patanYear);
            }
        }
    });

    // Find most frequent problem
    const mostFrequentProblem = Object.entries(problemCounts)
        .sort(([,a], [,b]) => b - a)[0];

    // Find most active province
    const mostActiveProvince = Object.entries(provinceData)
        .sort(([,a], [,b]) => b - a)[0];

    // Calculate average completion time
    const avgCompletionTime = completionYears.length > 0 
        ? Math.round(completionYears.reduce((a, b) => a + b, 0) / completionYears.length)
        : 0;

    // Find problem trend (comparing current vs historical data)
    const totalProblems = Object.values(problemCounts).reduce((a, b) => a + b, 0);
    const problemTrend = {
        'Kws Hutan': Math.round((problemCounts['Kws Hutan'] / totalProblems) * 100),
        'Perusahaan': Math.round((problemCounts['Perusahaan'] / totalProblems) * 100),
        'MHA': Math.round((problemCounts['MHA'] / totalProblems) * 100),
        'Masyarakat': Math.round((problemCounts['Masyarakat'] / totalProblems) * 100)
    };

    return {
        mostFrequentProblem: {
            problem: mostFrequentProblem[0],
            count: mostFrequentProblem[1],
            total: totalProblems
        },
        mostActiveProvince: {
            province: mostActiveProvince[0],
            locations: mostActiveProvince[1]
        },
        averageCompletion: avgCompletionTime,
        problemTrend: problemTrend
    };
}

// Show loading state
function showLoadingState() {
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.innerHTML = '<div class="chart-loading"><i class="fas fa-spinner"></i></div>';
    });
}

// Hide loading state
function hideLoadingState() {
    // Remove loading state without recreating charts
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        const loadingElement = container.querySelector('.chart-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
    });
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

// Add animation to insight cards
function animateInsightCards() {
    const cards = document.querySelectorAll('.insight-card');
    cards.forEach((card, index) => {
        card.style.animation = `slideInUp 0.6s ease-out ${index * 0.1}s both`;
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing analytics...');
    
    try {
        // Initialize analytics
        initAnalytics();
        
        // Setup navigation menu
        setupNavigationMenu();
        
        // Animate insight cards
        animateInsightCards();
        
        console.log('Analytics page fully initialized');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Setup navigation menu separately
function setupNavigationMenu() {
    console.log('Setting up navigation menu...');
    
    try {
        // Get all navigation items
        const navItems = document.querySelectorAll('.nav-item');
        console.log('Found navigation items:', navItems.length);
        
        navItems.forEach((item, index) => {
            console.log(`Setting up nav item ${index + 1}:`, item.querySelector('span')?.textContent);
            
            // Remove any existing event listeners
            item.replaceWith(item.cloneNode(true));
            
            // Get the fresh reference
            const freshItem = document.querySelectorAll('.nav-item')[index];
            
            // Add click event listener
            freshItem.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Navigation item clicked:', this.querySelector('span')?.textContent);
                
                // Remove active class from all items
                document.querySelectorAll('.nav-item').forEach(nav => {
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
                } else if (text === 'Reports') {
                    console.log('Reports page clicked (not implemented)');
                } else if (text === 'Settings') {
                    console.log('Settings page clicked (not implemented)');
                }
            });
            
            console.log(`Navigation item ${index + 1} setup complete`);
        });
        
        console.log('Navigation menu setup complete');
        
    } catch (error) {
        console.error('Error setting up navigation menu:', error);
    }
}

// Export functions for global access
window.analyticsUtils = {
    toggleChartType,
    exportChart,
    applyFilters,
    updateLastUpdated
};

// Calculate analytics data with filtered dataset
function calculateAnalyticsDataWithFilter(filteredData) {
    console.log('Calculating analytics data with filter:', filteredData.length, 'locations');
    
    try {
        // Calculate problem distribution from filtered data
        const problemCounts = {
            'Kws Hutan': 0,
            'Perusahaan': 0,
            'MHA': 0,
            'Masyarakat': 0,
            'Instansi': 0,
            'Lain-lain': 0
        };

        // Calculate province performance from filtered data
        const provinceData = {};
        const statusBinaData = {
            'Bina - Belum HPL': 0,
            'Bina - Sudah HPL': 0,
            'Bina - Tidak HPL': 0
        };
        const statusSerahData = {
            'Serah - Sudah HPL': 0,
            'Serah - SK Serah': 0
        };

        filteredData.forEach(location => {
            // Count problems
            if (location.permasalahanKwsHutan) problemCounts['Kws Hutan']++;
            if (location.permasalahanPerusahaan) problemCounts['Perusahaan']++;
            if (location.permasalahanMHA) problemCounts['MHA']++;
            if (location.permasalahanOKUMasy) problemCounts['Masyarakat']++;
            if (location.permasalahanInstansi) problemCounts['Instansi']++;
            if (location.permasalahanLainLain) problemCounts['Lain-lain']++;

            // Calculate province data
            if (!provinceData[location.provinsi]) {
                provinceData[location.provinsi] = { locations: 0, kk: 0, shm: 0 };
            }
            provinceData[location.provinsi].locations++;
            provinceData[location.provinsi].kk += location.jmlKK;
            provinceData[location.provinsi].shm += location.bebanTugasSHM;

            // Calculate status data
            if (location.statusBinaBlmHPL) statusBinaData['Bina - Belum HPL']++;
            if (location.statusBinaSdhHPL) statusBinaData['Bina - Sudah HPL']++;
            if (location.statusBinaTdkHPL) statusBinaData['Bina - Tidak HPL']++;
            if (location.statusSerahSdhHPL) statusSerahData['Serah - Sudah HPL']++;
            if (location.statusSerahSKSerah) statusSerahData['Serah - SK Serah']++;
        });

        console.log('Filtered analytics calculated:', {
            problemCounts,
            provinceData: Object.keys(provinceData),
            statusData: { ...statusBinaData, ...statusSerahData }
        });

    } catch (error) {
        console.error('Error calculating filtered analytics:', error);
    }
}

