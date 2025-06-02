/**
 * Joe & The Juice Store Management Component
 * 
 * This component provides a complete interface for managing stores with:
 * - Real-time data from the backend database
 * - Full CRUD operations (Create, Read, Update, Delete)
 * - Comprehensive error handling and user feedback
 * - Beautiful UI with Joe & The Juice pink branding
 * - Mobile-responsive design
 */

import { fetchStores, createStore, updateStore, deleteStore, getErrorMessage } from '../services/api.js';
import { showToast } from '../utils/ui.js';

/**
 * Global state for store management
 */
let stores = [];              // Array of all stores from database
let filteredStores = [];      // Filtered stores for search/display
let currentEditStore = null;  // Store currently being edited
let isLoading = false;        // Loading state indicator

/**
 * Initialize the Store Management component
 * This function sets up the UI and loads initial data from the backend
 */
export function initStoreManagement() {
    console.log('🏪 Initializing Store Management component...');
    
    // Set up event listeners for user interactions
    setupEventListeners();
    
    // Load stores from the backend database
    loadStoresFromBackend();
    
    console.log('✅ Store Management component initialized');
}

/**
 * Set up all event listeners for store management functionality
 * This includes search, create, edit, delete, and modal interactions
 */
function setupEventListeners() {
    console.log('🔧 Setting up Store Management event listeners...');
    
    // Search functionality - filter stores as user types
    const searchInput = document.getElementById('store-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            console.log('🔍 Searching stores with term:', searchTerm);
            filterStores(searchTerm);
        });
    }
    
    // Create new store button
    const createBtn = document.getElementById('create-store-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            console.log('➕ Opening create store modal...');
            openCreateStoreModal();
        });
    }
    
    // Modal close buttons and overlay clicks
    setupModalEventListeners();
    
    console.log('✅ Event listeners set up successfully');
}

/**
 * Set up modal-specific event listeners
 * Handles form submission, cancellation, and overlay clicks
 */
function setupModalEventListeners() {
    // Store form submission
    const storeForm = document.getElementById('store-form');
    if (storeForm) {
        storeForm.addEventListener('submit', handleStoreFormSubmit);
    }
    
    // Modal overlay clicks to close modals
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            console.log('🔒 Closing modal via overlay click');
            hideModal();
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            console.log('🔒 Closing modal via Escape key');
            hideModal();
        }
    });
}

/**
 * Load all stores from the backend database
 * Shows loading state and handles errors gracefully
 */
async function loadStoresFromBackend() {
    console.log('📡 Loading stores from backend database...');
    
    try {
        // Show loading state
        setLoadingState(true);
        showToast('Loading stores...', 'info');
        
        // Fetch stores from the API
        stores = await fetchStores();
        filteredStores = [...stores];
        
        console.log('✅ Successfully loaded', stores.length, 'stores from backend');
        showToast(`Loaded ${stores.length} stores successfully!`, 'success');
        
        // Update the UI with loaded stores
        renderStores();
        
    } catch (error) {
        console.error('❌ Failed to load stores:', error);
        const errorMessage = getErrorMessage(error);
        showToast(errorMessage, 'error');
        
        // Show empty state with error message
        renderStoreError(errorMessage);
        
    } finally {
        // Hide loading state
        setLoadingState(false);
    }
}

/**
 * Filter stores based on search term
 * Searches across store name, location, address, and manager
 * @param {string} searchTerm - The term to search for
 */
function filterStores(searchTerm) {
    if (!searchTerm) {
        // Show all stores if no search term
        filteredStores = [...stores];
    } else {
        // Filter stores based on multiple fields
        filteredStores = stores.filter(store => {
            const searchableText = [
                store.name,
                store.location,
                store.address,
                store.manager,
                store.country
            ].join(' ').toLowerCase();
            
            return searchableText.includes(searchTerm);
        });
    }
    
    console.log(`🔍 Filtered to ${filteredStores.length} stores out of ${stores.length} total`);
    renderStores();
}

/**
 * Render all stores in the UI
 * Creates store cards with full information and action buttons
 */
function renderStores() {
    const container = document.getElementById('stores-container');
    if (!container) {
        console.error('❌ Stores container not found in DOM');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    if (filteredStores.length === 0) {
        // Show empty state
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏪</div>
                <h3>No stores found</h3>
                <p>Try adjusting your search terms or create a new store.</p>
                <button class="btn btn-primary" onclick="openCreateStoreModal()">
                    ➕ Create First Store
                </button>
            </div>
        `;
        return;
    }
    
    // Create store cards
    filteredStores.forEach(store => {
        const storeCard = createStoreCard(store);
        container.appendChild(storeCard);
    });
    
    console.log('✅ Rendered', filteredStores.length, 'store cards');
}

/**
 * Create a single store card element
 * @param {Object} store - Store data from the database
 * @returns {HTMLElement} - The store card element
 */
function createStoreCard(store) {
    const card = document.createElement('div');
    card.className = 'store-card';
    card.setAttribute('data-store-id', store.id);
    
    // Format the creation date
    const createdDate = new Date(store.createdAt).toLocaleDateString();
    
    // Determine performance level for styling
    const performanceLevel = getPerformanceLevel(store.performanceScore);
    
    card.innerHTML = `
        <div class="card-header">
            <div>
                <h3 class="card-title">${escapeHtml(store.name)}</h3>
                <p class="card-subtitle">${escapeHtml(store.location)}</p>
            </div>
            <div class="store-actions">
                <button class="btn-icon edit-btn" onclick="openEditStoreModal(${store.id})" title="Edit Store">
                    ✏️
                </button>
                <button class="btn-icon delete-btn" onclick="confirmDeleteStore(${store.id})" title="Delete Store">
                    🗑️
                </button>
            </div>
        </div>
        
        <div class="store-details">
            <div class="detail-row">
                <span class="detail-label">📍 Address:</span>
                <span class="detail-value">${escapeHtml(store.address)}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">👨‍💼 Manager:</span>
                <span class="detail-value">${escapeHtml(store.manager)}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">🕐 Hours:</span>
                <span class="detail-value">${escapeHtml(store.openingHours)}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">🌍 Country:</span>
                <span class="detail-value">${escapeHtml(store.country)}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">👥 Employees:</span>
                <span class="detail-value">${store.employeeCount}</span>
            </div>
        </div>
        
        <div class="store-metrics">
            <div class="metric-item">
                <span class="metric-label">💰 Revenue</span>
                <span class="metric-value">$${formatCurrency(store.revenue)}</span>
            </div>
            
            <div class="metric-item">
                <span class="metric-label">📊 Performance</span>
                <span class="metric-value ${performanceLevel}">${store.performanceScore}%</span>
            </div>
        </div>
        
        <div class="performance-score">
            <div class="score-bar">
                <div class="score-fill" style="width: ${store.performanceScore}%"></div>
            </div>
            <span class="score-value">${store.performanceScore}%</span>
        </div>
        
        <div class="card-footer">
            <span class="created-date">Created: ${createdDate}</span>
        </div>
    `;
    
    return card;
}

/**
 * Open the create store modal with an empty form
 */
function openCreateStoreModal() {
    console.log('➕ Opening create store modal...');
    
    currentEditStore = null;
    
    // Set modal title and form fields
    document.getElementById('modal-title').textContent = 'Create New Store';
    document.getElementById('form-submit-btn').textContent = 'Create Store';
    
    // Clear all form fields
    resetStoreForm();
    
    // Show the modal
    showModal('store-modal');
}

/**
 * Open the edit store modal with pre-filled data
 * @param {number} storeId - ID of the store to edit
 */
function openEditStoreModal(storeId) {
    console.log('✏️ Opening edit modal for store ID:', storeId);
    
    // Find the store to edit
    const store = stores.find(s => s.id === storeId);
    if (!store) {
        console.error('❌ Store not found with ID:', storeId);
        showToast('Store not found!', 'error');
        return;
    }
    
    currentEditStore = store;
    
    // Set modal title and form fields
    document.getElementById('modal-title').textContent = 'Edit Store';
    document.getElementById('form-submit-btn').textContent = 'Update Store';
    
    // Fill form with store data
    fillStoreForm(store);
    
    // Show the modal
    showModal('store-modal');
}

/**
 * Fill the store form with existing store data
 * @param {Object} store - Store data to fill into the form
 */
function fillStoreForm(store) {
    console.log('📝 Filling form with store data:', store.name);
    
    document.getElementById('store-name').value = store.name || '';
    document.getElementById('store-location').value = store.location || '';
    document.getElementById('store-address').value = store.address || '';
    document.getElementById('store-manager').value = store.manager || '';
    document.getElementById('store-hours').value = store.openingHours || '';
    document.getElementById('store-country').value = store.country || '';
    document.getElementById('store-revenue').value = store.revenue || '';
    document.getElementById('store-performance').value = store.performanceScore || '';
    document.getElementById('store-employees').value = store.employeeCount || '';
}

/**
 * Reset the store form to empty values
 */
function resetStoreForm() {
    console.log('🔄 Resetting store form...');
    
    document.getElementById('store-name').value = '';
    document.getElementById('store-location').value = '';
    document.getElementById('store-address').value = '';
    document.getElementById('store-manager').value = '';
    document.getElementById('store-hours').value = '08:00-20:00';
    document.getElementById('store-country').value = 'Denmark';
    document.getElementById('store-revenue').value = '';
    document.getElementById('store-performance').value = '85';
    document.getElementById('store-employees').value = '0';
}

/**
 * Handle store form submission (both create and update)
 * @param {Event} e - Form submission event
 */
async function handleStoreFormSubmit(e) {
    e.preventDefault();
    console.log('📝 Handling store form submission...');
    
    try {
        // Show loading state on submit button
        const submitBtn = document.getElementById('form-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;
        
        // Collect form data
        const formData = collectStoreFormData();
        
        // Validate form data
        validateStoreFormData(formData);
        
        let result;
        
        if (currentEditStore) {
            // Update existing store
            console.log('🔄 Updating store ID:', currentEditStore.id);
            result = await updateStore(currentEditStore.id, formData);
            showToast('Store updated successfully!', 'success');
        } else {
            // Create new store
            console.log('➕ Creating new store...');
            result = await createStore(formData);
            showToast('Store created successfully!', 'success');
        }
        
        console.log('✅ Store operation successful:', result);
        
        // Refresh the stores list
        await loadStoresFromBackend();
        
        // Close the modal
        hideModal();
        
    } catch (error) {
        console.error('❌ Store form submission failed:', error);
        const errorMessage = getErrorMessage(error);
        showToast(errorMessage, 'error');
        
    } finally {
        // Reset submit button
        const submitBtn = document.getElementById('form-submit-btn');
        submitBtn.textContent = currentEditStore ? 'Update Store' : 'Create Store';
        submitBtn.disabled = false;
    }
}

/**
 * Collect data from the store form
 * @returns {Object} - Form data object
 */
function collectStoreFormData() {
    return {
        name: document.getElementById('store-name').value.trim(),
        location: document.getElementById('store-location').value.trim(),
        address: document.getElementById('store-address').value.trim(),
        manager: document.getElementById('store-manager').value.trim(),
        openingHours: document.getElementById('store-hours').value.trim(),
        country: document.getElementById('store-country').value.trim(),
        revenue: parseFloat(document.getElementById('store-revenue').value) || 0,
        performanceScore: parseFloat(document.getElementById('store-performance').value) || 85,
        employeeCount: parseInt(document.getElementById('store-employees').value) || 0
    };
}

/**
 * Validate store form data
 * @param {Object} formData - Form data to validate
 * @throws {Error} - Throws error if validation fails
 */
function validateStoreFormData(formData) {
    console.log('✅ Validating store form data...');
    
    // Required fields validation
    if (!formData.name) throw new Error('Store name is required');
    if (!formData.location) throw new Error('Location is required');
    if (!formData.address) throw new Error('Address is required');
    if (!formData.manager) throw new Error('Manager name is required');
    
    // Business rules validation
    if (formData.name.length < 2) throw new Error('Store name must be at least 2 characters');
    if (formData.revenue < 0) throw new Error('Revenue cannot be negative');
    if (formData.performanceScore < 0 || formData.performanceScore > 100) {
        throw new Error('Performance score must be between 0 and 100');
    }
    if (formData.employeeCount < 0) throw new Error('Employee count cannot be negative');
    
    console.log('✅ Form validation passed');
}

/**
 * Confirm and delete a store
 * @param {number} storeId - ID of the store to delete
 */
function confirmDeleteStore(storeId) {
    console.log('🗑️ Confirming deletion of store ID:', storeId);
    
    const store = stores.find(s => s.id === storeId);
    if (!store) {
        showToast('Store not found!', 'error');
        return;
    }
    
    // Show confirmation dialog
    const confirmed = confirm(`Are you sure you want to delete "${store.name}"?\n\nThis action cannot be undone.`);
    
    if (confirmed) {
        deleteStoreById(storeId);
    } else {
        console.log('❌ Store deletion cancelled by user');
    }
}

/**
 * Delete a store by ID
 * @param {number} storeId - ID of the store to delete
 */
async function deleteStoreById(storeId) {
    console.log('🗑️ Deleting store ID:', storeId);
    
    try {
        showToast('Deleting store...', 'info');
        
        // Delete store via API
        await deleteStore(storeId);
        
        console.log('✅ Store deleted successfully');
        showToast('Store deleted successfully!', 'success');
        
        // Refresh the stores list
        await loadStoresFromBackend();
        
    } catch (error) {
        console.error('❌ Failed to delete store:', error);
        const errorMessage = getErrorMessage(error);
        showToast(errorMessage, 'error');
    }
}

/**
 * Set loading state for the component
 * @param {boolean} loading - Whether component is loading
 */
function setLoadingState(loading) {
    isLoading = loading;
    
    const container = document.getElementById('stores-container');
    const searchInput = document.getElementById('store-search');
    const createBtn = document.getElementById('create-store-btn');
    
    if (loading) {
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading stores from database...</p>
                </div>
            `;
        }
        
        // Disable interactive elements
        if (searchInput) searchInput.disabled = true;
        if (createBtn) createBtn.disabled = true;
        
    } else {
        // Re-enable interactive elements
        if (searchInput) searchInput.disabled = false;
        if (createBtn) createBtn.disabled = false;
    }
}

/**
 * Render error state when stores fail to load
 * @param {string} errorMessage - Error message to display
 */
function renderStoreError(errorMessage) {
    const container = document.getElementById('stores-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Failed to Load Stores</h3>
            <p>${escapeHtml(errorMessage)}</p>
            <button class="btn btn-primary" onclick="loadStoresFromBackend()">
                🔄 Try Again
            </button>
        </div>
    `;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get performance level class based on score
 * @param {number} score - Performance score
 * @returns {string} - CSS class name
 */
function getPerformanceLevel(score) {
    if (score >= 90) return 'performance-excellent';
    if (score >= 80) return 'performance-good';
    if (score >= 70) return 'performance-average';
    return 'performance-poor';
}

/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================================================
// GLOBAL FUNCTIONS (called from HTML onclick events)
// =============================================================================

/**
 * Show a modal by ID
 * @param {string} modalId - ID of the modal to show
 */
window.showModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        console.log('📱 Modal opened:', modalId);
    }
};

/**
 * Hide the currently open modal
 */
window.hideModal = function() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.classList.add('hidden');
    });
    document.body.style.overflow = '';
    console.log('📱 Modal closed');
};

/**
 * Global functions to be called from HTML
 */
window.openCreateStoreModal = openCreateStoreModal;
window.openEditStoreModal = openEditStoreModal;
window.confirmDeleteStore = confirmDeleteStore;
window.loadStoresFromBackend = loadStoresFromBackend;

console.log('🏪 Store Management module loaded successfully');
