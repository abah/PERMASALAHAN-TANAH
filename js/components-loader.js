// Components Loader - Universal component loading system
// This file loads shared components (sidebar, header) into pages

(function() {
    'use strict';
    
    console.log('🔧 Components Loader initializing...');
    
    // Function to load HTML component
    async function loadComponent(elementId, componentPath) {
        try {
            console.log(`📥 Loading component: ${componentPath} into #${elementId}`);
            
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            const element = document.getElementById(elementId);
            
            if (!element) {
                console.warn(`⚠️ Element #${elementId} not found, creating container`);
                return false;
            }
            
            element.innerHTML = html;
            console.log(`✅ Component loaded: ${componentPath}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Failed to load component ${componentPath}:`, error);
            return false;
        }
    }
    
    // Function to initialize all components
    async function initializeComponents() {
        console.log('🚀 Initializing shared components...');
        
        const components = [
            { id: 'shared-sidebar', path: 'components/sidebar.html' },
            { id: 'shared-header', path: 'components/header.html' }
        ];
        
        const loadPromises = components.map(component => 
            loadComponent(component.id, component.path)
        );
        
        const results = await Promise.all(loadPromises);
        const loadedCount = results.filter(result => result).length;
        
        console.log(`✅ Components loaded: ${loadedCount}/${components.length}`);
        
        // Dispatch custom event when components are loaded
        const event = new CustomEvent('componentsLoaded', {
            detail: { loadedCount, total: components.length }
        });
        document.dispatchEvent(event);
    }
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
        initializeComponents();
    }
    
    // Export functions to global scope
    window.ComponentsLoader = {
        loadComponent,
        initializeComponents
    };
    
})();
