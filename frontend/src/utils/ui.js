// Toast notifications
export function showToast(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
                <strong style="display: block; margin-bottom: 0.25rem;">
                    ${getToastIcon(type)} ${getToastTitle(type)}
                </strong>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; cursor: pointer; padding: 0; margin-left: 1rem; opacity: 0.7;">
                ✕
            </button>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideOut 250ms ease-in forwards';
            setTimeout(() => toast.remove(), 250);
        }
    }, duration);
}

function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function getToastTitle(type) {
    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info'
    };
    return titles[type] || titles.info;
}

// Modal functions
export function showModal(content) {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    
    if (!overlay || !modal) return;
    
    modal.innerHTML = content;
    overlay.classList.remove('hidden');
    
    // Focus trap
    const focusableElements = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

export function hideModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Make hideModal available globally
window.hideModal = hideModal;

// Form utilities
export function createForm(fields, onSubmit, submitLabel = 'Save') {
    const formHTML = `
        <div style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid var(--gray-200);">
                <h2 style="margin: 0; color: var(--gray-800);">${submitLabel}</h2>
                <button type="button" onclick="window.hideModal()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; padding: 0.5rem; border-radius: 50%; color: var(--gray-500);" aria-label="Close">
                    ✕
                </button>
            </div>
            <form id="modal-form">
                ${fields.map(field => createFormField(field)).join('')}
                <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                    <button type="button" class="btn btn-secondary" onclick="window.hideModal()">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                        ${submitLabel}
                    </button>
                </div>
            </form>
        </div>
    `;
    
    showModal(formHTML);
    
    // Initialize searchable dropdowns
    initializeSearchableDropdowns();
    
    // Add form submit handler
    const form = document.getElementById('modal-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Convert numeric fields
        fields.forEach(field => {
            if (field.type === 'number' && data[field.name]) {
                data[field.name] = parseFloat(data[field.name]);
            }
        });
        
        onSubmit(data);
    });
}

function initializeSearchableDropdowns() {
    const dropdowns = document.querySelectorAll('.searchable-select');
    
    dropdowns.forEach(dropdown => {
        const fieldName = dropdown.dataset.fieldName;
        const input = dropdown.querySelector('.searchable-select-input');
        const hiddenInput = dropdown.querySelector(`input[name="${fieldName}"]`);
        const dropdownEl = dropdown.querySelector('.searchable-select-dropdown');
        const searchInput = dropdown.querySelector('.searchable-select-search input');
        const optionsContainer = dropdown.querySelector('.searchable-select-options');
        const options = dropdown.querySelectorAll('.searchable-select-option');
        
        // Toggle dropdown on input click
        input.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other dropdowns
            document.querySelectorAll('.searchable-select-dropdown').forEach(dd => {
                if (dd !== dropdownEl) dd.style.display = 'none';
            });
            dropdownEl.style.display = dropdownEl.style.display === 'none' ? 'block' : 'none';
            if (dropdownEl.style.display === 'block') {
                searchInput.focus();
            }
        });
        
        // Filter options on search
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            options.forEach(option => {
                const label = option.dataset.label.toLowerCase();
                option.style.display = label.includes(query) ? 'block' : 'none';
            });
        });
        
        // Select option
        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                const label = option.dataset.label;
                
                input.value = label;
                hiddenInput.value = value;
                
                // Update selected state
                options.forEach(opt => opt.removeAttribute('data-selected'));
                option.setAttribute('data-selected', 'true');
                
                dropdownEl.style.display = 'none';
                searchInput.value = '';
                options.forEach(opt => opt.style.display = 'block');
            });
        });
    });
}

function createFormField(field) {
    const { type, name, label, required, placeholder, options, value } = field;
    
    let inputHTML = '';
    
    switch (type) {
        case 'select':
            inputHTML = `
                <select name="${name}" ${required ? 'required' : ''} class="search-input">
                    <option value="">Select ${label}</option>
                    ${options.map(opt => `
                        <option value="${opt.value}" ${value === opt.value ? 'selected' : ''}>
                            ${opt.label}
                        </option>
                    `).join('')}
                </select>
            `;
            break;
        case 'searchable-select':
            const fieldId = `searchable-${name}-${Date.now()}`;
            inputHTML = `
                <div class="searchable-select" data-field-name="${name}">
                    <input type="text" 
                           class="searchable-select-input search-input" 
                           placeholder="Search and select ${label.toLowerCase()}..."
                           autocomplete="off"
                           data-field-id="${fieldId}"
                           ${required ? 'required' : ''}
                           value="${value ? options.find(opt => opt.value === value)?.label || '' : ''}"
                           readonly>
                    <input type="hidden" name="${name}" value="${value || ''}" data-hidden-input="${fieldId}">
                    <div class="searchable-select-dropdown" data-dropdown="${fieldId}" style="display: none;">
                        <div class="searchable-select-search">
                            <input type="text" 
                                   class="search-input" 
                                   placeholder="Type to search..."
                                   data-search-input="${fieldId}">
                        </div>
                        <div class="searchable-select-options" data-options="${fieldId}">
                            ${options.map(opt => `
                                <div class="searchable-select-option" 
                                     data-value="${opt.value}" 
                                     data-label="${opt.label}"
                                     ${value === opt.value ? 'data-selected="true"' : ''}>
                                    ${opt.label}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'textarea':
            inputHTML = `
                <textarea name="${name}" ${required ? 'required' : ''} 
                         placeholder="${placeholder || ''}" class="search-input"
                         style="min-height: 100px; resize: vertical;">${value || ''}</textarea>
            `;
            break;
        default:
            inputHTML = `
                <input type="${type || 'text'}" name="${name}" ${required ? 'required' : ''}
                       placeholder="${placeholder || ''}" value="${value || ''}" class="search-input">
            `;
    }
    
    return `
        <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--gray-700);">
                ${label} ${required ? '<span style="color: var(--error-color);">*</span>' : ''}
            </label>
            ${inputHTML}
        </div>
    `;
}

// Formatting utilities
export function formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat('en-EU', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-EU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function formatPercentage(value) {
    return `${Math.round(value)}%`;
}

export function formatNumber(value) {
    return new Intl.NumberFormat('en-EU').format(value);
}

// Performance score color
export function getPerformanceColor(score) {
    if (score >= 90) return 'var(--accent-color)';
    if (score >= 75) return 'var(--warning-color)';
    return 'var(--error-color)';
}

// Loading states
export function showLoading(element, text = 'Loading...') {
    if (!element) return;
    
    element.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem; color: var(--gray-500);">
            <div class="loading-spinner" style="margin-bottom: 1rem;"></div>
            <span>${text}</span>
        </div>
    `;
}

export function hideLoading(element, content) {
    if (!element) return;
    element.innerHTML = content;
}

// Search functionality
export function setupSearch(inputElement, items, renderFunction, searchFields) {
    if (!inputElement) return;
    
    let allItems = [...items];
    
    inputElement.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            renderFunction(allItems);
            return;
        }
        
        const filtered = allItems.filter(item => {
            return searchFields.some(field => {
                const value = getNestedValue(item, field);
                return value && value.toString().toLowerCase().includes(query);
            });
        });
        
        renderFunction(filtered);
    });
    
    // Update items function
    return (newItems) => {
        allItems = [...newItems];
        if (!inputElement.value) {
            renderFunction(allItems);
        } else {
            inputElement.dispatchEvent(new Event('input'));
        }
    };
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Debounce utility
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Copy to clipboard
export function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard', 'success');
    }).catch(() => {
        showToast('Failed to copy to clipboard', 'error');
    });
}

// Add CSS for slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    /* Searchable Dropdown Styles */
    .searchable-select {
        position: relative;
    }
    
    .searchable-select-input {
        cursor: pointer;
        background: white;
    }
    
    .searchable-select-input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }
    
    .searchable-select-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid var(--gray-300);
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: 300px;
        overflow: hidden;
    }
    
    .searchable-select-search {
        padding: 0.75rem;
        border-bottom: 1px solid var(--gray-200);
    }
    
    .searchable-select-search input {
        width: 100%;
        border: 1px solid var(--gray-300);
        border-radius: 0.375rem;
        padding: 0.5rem;
        font-size: 0.875rem;
    }
    
    .searchable-select-options {
        max-height: 200px;
        overflow-y: auto;
    }
    
    .searchable-select-option {
        padding: 0.75rem;
        cursor: pointer;
        border-bottom: 1px solid var(--gray-100);
        transition: background-color 0.15s ease;
    }
    
    .searchable-select-option:hover {
        background-color: var(--gray-50);
    }
    
    .searchable-select-option[data-selected="true"] {
        background-color: var(--primary-light);
        color: var(--primary-color);
        font-weight: 500;
    }
    
    .searchable-select-option:last-child {
        border-bottom: none;
    }
`;
document.head.appendChild(style); 