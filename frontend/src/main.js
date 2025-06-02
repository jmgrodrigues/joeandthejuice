// Joe & The Juice Store Management Application
// Complete integration with NestJS GraphQL backend

import { testConnection } from './services/api.js';
import { Dashboard } from './components/dashboard.js';
import { StoreManager } from './components/stores.js';
import { EmployeeManager } from './components/employees.js';
import { Analytics } from './components/analytics.js';
import { showToast, showModal, hideModal } from './utils/ui.js';

// Global API instance - will be created after testing connection
let apiInstance = null;

/**
 * Main Application Class
 * Handles navigation, component initialization, and backend integration
 */
class App {
    constructor() {
        this.currentPage = 'dashboard';
        this.components = {};
        this.isLoading = true;
        
        this.init();
    }
    
    /**
     * Initialize the application
     * Sets up components, tests API connection, and shows initial page
     */
    async init() {
        try {
            console.log('🚀 Initializing Joe & The Juice Management App...');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Test backend connection and create API instance
            await this.testBackendConnection();
            
            // Initialize components
            this.initializeComponents();
            
            // Hide loading screen and show app
            setTimeout(() => {
                this.hideLoadingScreen();
                this.loadInitialData();
            }, 1500);
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.showConnectionError();
        }
    }
    
    /**
     * Test connection to the backend server and create API instance
     */
    async testBackendConnection() {
        try {
            console.log('🔍 Testing backend connection...');
            const { connected, api } = await testConnection();
            
            if (connected) {
                console.log('✅ Backend connection successful');
                apiInstance = api;
                showToast('Connected to Joe & The Juice backend! 🍊', 'success');
            } else {
                throw new Error('Backend connection failed');
            }
        } catch (error) {
            console.warn('⚠️ Backend connection failed:', error.message);
            // Create a mock API instance for demo mode
            apiInstance = await this.createMockAPI();
            showToast('Backend not available - using demo data', 'warning');
        }
    }

    /**
     * Create a mock API instance with demo functionality
     */
    async createMockAPI() {
        const { createMockAPI } = await import('./services/api.js');
        return createMockAPI();
    }
    
    /**
     * Initialize all application components
     */
    initializeComponents() {
        console.log('🔧 Initializing application components...');
        
        this.components = {
            dashboard: new Dashboard(apiInstance),
            stores: new StoreManager(apiInstance),
            employees: new EmployeeManager(apiInstance),
            analytics: new Analytics(apiInstance)
        };
        
        console.log('✅ Components initialized successfully');
    }
    
    /**
     * Set up all event listeners for navigation and UI interactions
     */
    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const nav = document.getElementById('nav');
        
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('open');
                console.log('📱 Mobile menu toggled');
            });
        }
        
        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                if (page) {
                    this.navigateTo(page);
                    nav?.classList.remove('open'); // Close mobile menu
                }
            });
        });
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'dashboard';
            this.navigateTo(page, false);
        });
        
        // Handle escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideModal();
            }
        });
        
        console.log('✅ Event listeners set up successfully');
    }
    
    /**
     * Navigate to a specific page
     * @param {string} page - Page to navigate to
     * @param {boolean} pushState - Whether to update browser history
     */
    navigateTo(page, pushState = true) {
        if (this.currentPage === page) return;
        
        console.log(`📄 Navigating from ${this.currentPage} to ${page}`);
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
        
        // Hide current page
        const currentPageElement = document.getElementById(`${this.currentPage}-page`);
        currentPageElement?.classList.remove('active');
        
        // Show new page
        const newPageElement = document.getElementById(`${page}-page`);
        newPageElement?.classList.add('active');
        
        // Update browser history
        if (pushState) {
            history.pushState({ page }, '', `#${page}`);
        }
        
        // Update current page
        this.currentPage = page;
        
        // Load page data
        this.loadPageData(page);
    }
    
    /**
     * Load data for a specific page
     * @param {string} page - Page to load data for
     */
    async loadPageData(page) {
        try {
            console.log(`📊 Loading data for ${page} page...`);
            
            switch (page) {
                case 'dashboard':
                    if (this.components.dashboard && typeof this.components.dashboard.load === 'function') {
                        await this.components.dashboard.load();
                    }
                    break;
                    
                case 'stores':
                    if (this.components.stores && typeof this.components.stores.load === 'function') {
                        console.log('🏪 Loading Store Management...');
                        await this.components.stores.load();
                    }
                    break;
                    
                case 'employees':
                    if (this.components.employees && typeof this.components.employees.load === 'function') {
                        console.log('👥 Loading Employee Management...');
                        await this.components.employees.load();
                    }
                    break;
                    
                case 'analytics':
                    if (this.components.analytics && typeof this.components.analytics.load === 'function') {
                        await this.components.analytics.load();
                    }
                    break;
                    
                default:
                    console.warn(`⚠️ Unknown page: ${page}`);
            }
            
        } catch (error) {
            console.error(`❌ Failed to load ${page} data:`, error);
            showToast(`Failed to load ${page} data`, 'error');
        }
    }
    
    /**
     * Load initial application data
     */
    async loadInitialData() {
        console.log('📈 Loading initial application data...');
        
        // Load dashboard by default
        await this.loadPageData('dashboard');
        
        // Set initial page from URL hash
        const hash = window.location.hash.slice(1);
        const validPages = ['dashboard', 'stores', 'employees', 'analytics'];
        
        if (hash && validPages.includes(hash)) {
            this.navigateTo(hash, false);
        } else {
            // Default to dashboard
            this.navigateTo('dashboard', false);
        }
        
        console.log('✅ Initial data loaded successfully');
    }
    
    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) loadingScreen.classList.remove('hidden');
        if (app) app.classList.add('hidden');
        
        console.log('🔄 Loading screen shown');
    }
    
    /**
     * Hide loading screen and show main app
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) loadingScreen.classList.add('hidden');
        if (app) app.classList.remove('hidden');
        
        // Show welcome message
        showToast('Welcome to Joe & The Juice Store Manager! 🍊', 'success');
        
        console.log('✅ App fully loaded and ready');
    }
    
    /**
     * Show connection error modal
     */
    showConnectionError() {
        this.hideLoadingScreen();
        
        showModal(`
            <div style="padding: 2rem; text-align: center;">
                <h2 style="color: var(--error-color); margin-bottom: 1rem;">🔌 Connection Error</h2>
                <p style="margin-bottom: 1.5rem; line-height: 1.6;">
                    Unable to connect to the Joe & The Juice backend server.<br>
                    Please ensure the NestJS server is running on <strong>http://localhost:3000</strong>
                </p>
                
                <div style="background: var(--gray-100); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                    <h4 style="margin-bottom: 0.5rem;">To start the backend:</h4>
                    <code style="display: block; background: var(--gray-800); color: var(--white); padding: 0.5rem; border-radius: 0.25rem;">
                        cd backend && npm run start:dev
                    </code>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="window.location.reload()">
                        🔄 Try Again
                    </button>
                    <button class="btn btn-secondary" onclick="hideModal()">
                        Continue with Demo
                    </button>
                </div>
            </div>
        `);
        
        console.log('⚠️ Connection error modal displayed');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM loaded, starting Joe & The Juice app...');
    window.app = new App();
});

// Handle service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('✅ SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('❌ SW registration failed: ', registrationError);
            });
    });
}

// Export for debugging
window.JoeApp = App;

console.log('🍊 Joe & The Juice Management App loaded successfully!'); 