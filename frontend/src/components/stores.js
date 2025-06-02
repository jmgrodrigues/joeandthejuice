import { formatCurrency, formatDate, getPerformanceColor, showLoading, showToast, createForm, setupSearch } from '../utils/ui.js';

export class StoreManager {
    constructor(api) {
        this.api = api;
        this.stores = [];
        this.updateSearch = null;
    }
    
    async load() {
        const container = document.getElementById('stores-grid');
        showLoading(container, 'Loading stores...');
        
        try {
            this.stores = await this.api.getStores();
            this.render();
            this.setupEventListeners();
            console.log('🏪 Stores loaded successfully');
        } catch (error) {
            console.error('Failed to load stores:', error);
            showToast('Failed to load stores', 'error');
        }
    }
    
    render() {
        const container = document.getElementById('stores-grid');
        if (!container) return;
        
        if (this.stores.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gray-500);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🏪</div>
                    <h3 style="margin-bottom: 0.5rem;">No Stores Found</h3>
                    <p>Start by adding your first store location.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.stores.map(store => this.renderStoreCard(store)).join('');
    }
    
    renderStoreCard(store) {
        return `
            <div class="store-card" data-store-id="${store.id}">
                <div class="card-header">
                    <div>
                        <div class="card-title">${store.name}</div>
                        <div class="card-subtitle">${store.city}, ${store.country}</div>
                    </div>
                    <span class="status-badge ${store.isActive ? 'status-active' : 'status-inactive'}">
                        ${store.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.25rem;">Address</div>
                    <div style="font-weight: 500;">${store.address}</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.25rem;">Manager</div>
                        <div style="font-weight: 500;">${store.manager}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.25rem;">Employees</div>
                        <div style="font-weight: 500;">${store.employeeCount}</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.25rem;">Monthly Revenue</div>
                        <div style="font-weight: 600; color: var(--primary-color);">${formatCurrency(store.monthlyRevenue)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.25rem;">Contact</div>
                        <div style="font-size: 0.875rem;">${store.phone || store.email || 'N/A'}</div>
                    </div>
                </div>
                
                <div class="performance-score">
                    <span style="font-size: 0.875rem; color: var(--gray-500);">Performance</span>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${store.performanceScore}%;"></div>
                    </div>
                    <span class="score-value">${Math.round(store.performanceScore)}%</span>
                </div>
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn btn-secondary" style="flex: 1; font-size: 0.875rem;" onclick="window.storeManager.editStore('${store.id}')">
                        Edit
                    </button>
                    <button class="btn btn-secondary" style="font-size: 0.875rem; color: var(--error-color);" onclick="window.storeManager.deleteStore('${store.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Setup search
        const searchInput = document.getElementById('store-search');
        this.updateSearch = setupSearch(
            searchInput,
            this.stores,
            (filteredStores) => {
                this.stores = filteredStores;
                this.render();
            },
            ['name', 'city', 'country', 'manager']
        );
        
        // Add store button
        const addButton = document.getElementById('add-store-btn');
        addButton?.addEventListener('click', () => this.showAddStoreForm());
        
        // Make this instance globally available for onclick handlers
        window.storeManager = this;
    }
    
    showAddStoreForm() {
        const fields = [
            { name: 'name', label: 'Store Name', required: true, placeholder: 'e.g., Copenhagen Central' },
            { name: 'address', label: 'Address', required: true, placeholder: 'e.g., Strøget 15' },
            { name: 'city', label: 'City', required: true, placeholder: 'e.g., Copenhagen' },
            { name: 'country', label: 'Country', required: true, placeholder: 'e.g., Denmark' },
            { name: 'phone', label: 'Phone', placeholder: 'e.g., +45 33 12 34 56' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'e.g., store@joe.dk' },
            { name: 'manager', label: 'Manager', required: true, placeholder: 'e.g., Emma Nielsen' },
            { name: 'monthlyRevenue', label: 'Monthly Revenue', type: 'number', placeholder: '50000' },
            { name: 'performanceScore', label: 'Performance Score', type: 'number', placeholder: '85', min: 0, max: 100 }
        ];
        
        createForm(fields, async (data) => {
            try {
                const newStore = await this.api.createStore(data);
                this.stores.push(newStore);
                this.updateSearch(this.stores);
                showToast('Store created successfully!', 'success');
                
                // Close modal (handled by createForm)
                document.getElementById('modal-overlay').classList.add('hidden');
            } catch (error) {
                console.error('Failed to create store:', error);
                showToast('Failed to create store', 'error');
            }
        }, 'Create Store');
    }
    
    editStore(storeId) {
        const store = this.stores.find(s => s.id === storeId);
        if (!store) return;
        
        const fields = [
            { name: 'name', label: 'Store Name', required: true, value: store.name },
            { name: 'address', label: 'Address', required: true, value: store.address },
            { name: 'city', label: 'City', required: true, value: store.city },
            { name: 'country', label: 'Country', required: true, value: store.country },
            { name: 'phone', label: 'Phone', value: store.phone || '' },
            { name: 'email', label: 'Email', type: 'email', value: store.email || '' },
            { name: 'manager', label: 'Manager', required: true, value: store.manager },
            { name: 'monthlyRevenue', label: 'Monthly Revenue', type: 'number', value: store.monthlyRevenue },
            { name: 'performanceScore', label: 'Performance Score', type: 'number', value: store.performanceScore }
        ];
        
        createForm(fields, async (data) => {
            try {
                const updatedStore = await this.api.updateStore({ id: storeId, ...data });
                const index = this.stores.findIndex(s => s.id === storeId);
                if (index !== -1) {
                    this.stores[index] = updatedStore;
                    this.updateSearch(this.stores);
                    showToast('Store updated successfully!', 'success');
                }
                
                // Close modal
                document.getElementById('modal-overlay').classList.add('hidden');
            } catch (error) {
                console.error('Failed to update store:', error);
                showToast('Failed to update store', 'error');
            }
        }, 'Update Store');
    }
    
    async deleteStore(storeId) {
        const store = this.stores.find(s => s.id === storeId);
        if (!store) return;
        
        if (confirm(`Are you sure you want to delete "${store.name}"? This action cannot be undone.`)) {
            try {
                await this.api.deleteStore(storeId);
                this.stores = this.stores.filter(s => s.id !== storeId);
                this.updateSearch(this.stores);
                showToast('Store deleted successfully!', 'success');
            } catch (error) {
                console.error('Failed to delete store:', error);
                showToast('Failed to delete store', 'error');
            }
        }
    }
} 