# Trans-Data Dashboard

A modern, responsive dashboard application for managing and analyzing land problem data across various regions in Indonesia. Built with HTML, CSS, and JavaScript.

## Features

### 🎨 Modern Design
- Clean, professional interface with light blue color scheme
- Responsive design that works on desktop, tablet, and mobile devices
- Smooth animations and hover effects
- Beautiful gradient backgrounds and card-based layout

### 📊 Data Visualization
- **Summary Cards**: Display key metrics (Jumlah KK, Beban Tugas SHM, Total Kasus)
- **Status Summary**: Visual representation of Bina and Serah statuses
- **Problem Analysis Chart**: Interactive bar chart showing problem categories
- **Dynamic Content**: All data updates automatically when switching locations

### 🗺️ Location Management
- **Sidebar Navigation**: Easy switching between 7 different project locations
- **Active State Indicators**: Clear visual feedback for selected location
- **Province Grouping**: Organized by provinces (Papua Selatan, Papua, Maluku Utara)

### 📋 Data Categories
The dashboard tracks comprehensive information for each location:
- **Basic Info**: Province, District/Location, Pattern, Patent Year, Handover Year
- **Quantitative Data**: Number of households, SHM workload, total cases
- **Status Tracking**: HPL status, Bina status, Serah status
- **Problem Analysis**: 6 categories of problems (Community, Company, Forest Area, MHA, Institution, Others)
- **Action Items**: Problem descriptions, follow-up actions, recommendations

## Usage

### Getting Started
1. Open `index.html` in any modern web browser
2. The dashboard will load with the default location (Kab. Pulau Morotai - UPT. Daruba SP.3)
3. Use the sidebar to switch between different project locations

### Navigation
- **Sidebar Locations**: Click any location in the left sidebar to switch views
- **Navigation Menu**: Dashboard, Analytics, Reports, Settings (currently visual only)
- **User Profile**: Click the user icon in the top-right corner

### Keyboard Shortcuts
- `Ctrl/Cmd + 1-7`: Switch to location 1-7
- `Ctrl/Cmd + S`: Export current location data as JSON

### Data Export
- Use `Ctrl/Cmd + S` to export the current location's data
- Data is exported as a JSON file with the location name as filename

## Data Structure

Each location contains the following information:

```javascript
{
  id: 1,
  provinsi: "Province Name",
  kabupaten: "District/Location Name",
  pola: "Pattern Type",
  tahunPatan: "Patent Year",
  tahunSerah: "Handover Year",
  jmlKK: 199,                    // Number of households
  bebanTugasSHM: 398,           // SHM workload (fields)
  hpl: "HPL Reference",
  statusBinaBlmHPL: false,      // Bina status - No HPL
  statusBinaSdhHPL: true,       // Bina status - Has HPL
  statusBinaTdkHPL: false,      // Bina status - No HPL needed
  statusSerahSdhHPL: false,     // Serah status - Has HPL
  statusSerahSKSerah: "SK Reference", // Serah SK reference
  permasalahanOKUMasy: false,   // Community problems
  permasalahanPerusahaan: false, // Company problems
  permasalahanKwsHutan: true,   // Forest area problems
  permasalahanMHA: false,       // MHA problems
  permasalahanInstansi: false,  // Institution problems
  permasalahanLainLain: false,  // Other problems
  totalKasus: 1,                // Total problem cases
  deskripsiPermasalahan: "...", // Problem description
  tindakLanjut: "...",          // Follow-up actions
  rekomendasi: "..."            // Recommendations
}
```

## Included Locations

1. **Papua Selatan**: Kab. Merauke - Muting SP XII
2. **Papua**: Kab. Keerom - UPT. Senggi 1
3. **Papua**: Kab. Keerom - UPT. Senggi 2
4. **Maluku Utara**: Kab. Pulau Morotai - UPT. Daruba SP.3 (Default)
5. **Maluku Utara**: Kab. Halmahera Tengah - UPT. Sagea Waleh SP.1
6. **Maluku Utara**: Kab. Halmahera Tengah - UPT. Kubekulo SP.3
7. **Maluku Utara**: Kab. Halmahera Tengah - UPT. Kubekulo SP.4

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Dynamic functionality and data management
- **Font Awesome**: Icons for enhanced UI
- **Google Fonts**: Typography (Segoe UI fallback)

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Features
- Optimized animations using CSS transforms
- Efficient DOM manipulation
- Responsive images and icons
- Minimal external dependencies

## Customization

### Adding New Locations
1. Add a new object to the `dashboardData` array in `script.js`
2. Follow the existing data structure
3. The location will automatically appear in the sidebar

### Styling Changes
- Modify `styles.css` to change colors, fonts, or layout
- The color scheme uses CSS custom properties for easy theming
- Responsive breakpoints are clearly defined

### Functionality Extensions
- Add new chart types in the `updateAnalysisChart()` function
- Extend the export functionality for different formats
- Implement search functionality using the `searchLocations()` function

## File Structure

```
trans-data-dashboard/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality and data
└── README.md           # This documentation
```

## License

This project is open source and available under the MIT License.

## Support

For questions or issues, please refer to the code comments or create an issue in the project repository.
