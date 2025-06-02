import { formatCurrency, formatDate, getPerformanceColor, showLoading, showToast, createForm, setupSearch } from '../utils/ui.js';

export class EmployeeManager {
    constructor(api) {
        this.api = api;
        this.employees = [];
        this.filteredEmployees = [];
        this.updateSearch = null;
        this.currentFilter = 'all';
    }
    
    async load() {
        const container = document.getElementById('employees-grid');
        showLoading(container, 'Loading employees...');
        
        try {
            this.employees = await this.api.getEmployees();
            this.filteredEmployees = [...this.employees];
            this.render();
            this.setupEventListeners();
            console.log('👥 Employees loaded successfully');
        } catch (error) {
            console.error('Failed to load employees:', error);
            // Use demo data as fallback
            this.loadDemoData();
            this.render();
            this.setupEventListeners();
            showToast('Using demo employee data', 'warning');
        }
    }
    
    loadDemoData() {
        this.employees = [
            {
                id: '1',
                name: 'Emma Nielsen',
                position: 'Store Manager',
                store: 'Copenhagen Central',
                storeId: '1',
                email: 'emma.nielsen@joe.dk',
                phone: '+45 23 45 67 89',
                hireDate: '2022-01-15',
                salary: 45000,
                performanceScore: 92,
                isActive: true,
                hoursWorked: 160,
                certifications: ['Barista Level 3', 'Manager Training']
            },
            {
                id: '2',
                name: 'Lucas Andersen',
                position: 'Senior Barista',
                store: 'Copenhagen Central',
                storeId: '1',
                email: 'lucas.andersen@joe.dk',
                phone: '+45 34 56 78 90',
                hireDate: '2022-03-10',
                salary: 32000,
                performanceScore: 88,
                isActive: true,
                hoursWorked: 155,
                certifications: ['Barista Level 2', 'Customer Service Excellence']
            },
            {
                id: '3',
                name: 'Sofia Larsen',
                position: 'Barista',
                store: 'Aarhus Store',
                storeId: '2',
                email: 'sofia.larsen@joe.dk',
                phone: '+45 45 67 89 01',
                hireDate: '2023-06-01',
                salary: 28000,
                performanceScore: 85,
                isActive: true,
                hoursWorked: 140,
                certifications: ['Barista Level 1']
            },
            {
                id: '4',
                name: 'Magnus Østergaard',
                position: 'Store Manager',
                store: 'Aarhus Store',
                storeId: '2',
                email: 'magnus.ostergaard@joe.dk',
                phone: '+45 56 78 90 12',
                hireDate: '2021-09-20',
                salary: 44000,
                performanceScore: 94,
                isActive: true,
                hoursWorked: 165,
                certifications: ['Manager Training', 'Food Safety', 'Leadership Excellence']
            },
            {
                id: '5',
                name: 'Isabella Thomsen',
                position: 'Assistant Manager',
                store: 'Bergen Store',
                storeId: '3',
                email: 'isabella.thomsen@joe.no',
                phone: '+47 12 34 56 78',
                hireDate: '2022-11-12',
                salary: 38000,
                performanceScore: 89,
                isActive: true,
                hoursWorked: 158,
                certifications: ['Barista Level 3', 'Supervisor Training']
            }
        ];
        this.filteredEmployees = [...this.employees];
    }
    
    render() {
        const container = document.getElementById('employees-grid');
        if (!container) return;
        
        if (this.filteredEmployees.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gray-500);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">👥</div>
                    <h3 style="margin-bottom: 0.5rem;">No Employees Found</h3>
                    <p>Start by adding your first team member.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredEmployees.map(employee => this.renderEmployeeCard(employee)).join('');
    }
    
    renderEmployeeCard(employee) {
        const performanceColor = this.getPerformanceColor(employee.performanceScore);
        const statusClass = employee.isActive ? 'status-active' : 'status-inactive';
        
        return `
            <div class="employee-card" data-employee-id="${employee.id}">
                <div class="card-header">
                    <div>
                        <div class="card-title">${employee.name}</div>
                        <div class="card-subtitle">${employee.position}</div>
                    </div>
                    <span class="status-badge ${statusClass}">
                        ${employee.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.25rem;">Store</div>
                    <div style="font-weight: 500;">${employee.store}</div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.25rem;">Email</div>
                        <div style="font-size: 0.875rem;">${employee.email}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.25rem;">Phone</div>
                        <div style="font-size: 0.875rem;">${employee.phone}</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.25rem;">Hire Date</div>
                        <div style="font-weight: 500;">${formatDate(employee.hireDate)}</div>
                    </div>
                    <div>
                        <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.25rem;">Salary</div>
                        <div style="font-weight: 600; color: var(--primary-color);">${formatCurrency(employee.salary)}</div>
                    </div>
                </div>
                
                <div class="performance-score">
                    <span style="font-size: 0.875rem; color: var(--gray-500);">Performance</span>
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${employee.performanceScore}%; background-color: ${performanceColor};"></div>
                    </div>
                    <span class="score-value">${Math.round(employee.performanceScore)}%</span>
                </div>
                
                ${employee.certifications && employee.certifications.length > 0 ? `
                    <div style="margin-top: 1rem;">
                        <div style="font-size: 0.875rem; color: var(--gray-500); margin-bottom: 0.5rem;">Certifications</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem;">
                            ${employee.certifications.map(cert => `
                                <span style="background: var(--primary-light); color: var(--primary-color); padding: 0.125rem 0.5rem; border-radius: 0.75rem; font-size: 0.75rem;">
                                    ${cert}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn btn-secondary" style="flex: 1; font-size: 0.875rem;" onclick="window.employeeManager.editEmployee('${employee.id}')">
                        Edit
                    </button>
                    <button class="btn btn-secondary" style="font-size: 0.875rem; color: var(--error-color);" onclick="window.employeeManager.deleteEmployee('${employee.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        // Setup search
        const searchInput = document.getElementById('employee-search');
        this.updateSearch = setupSearch(
            searchInput,
            this.employees,
            (filteredEmployees) => {
                this.filteredEmployees = filteredEmployees;
                this.applyFilters();
                this.render();
            },
            ['name', 'position', 'store', 'email']
        );
        
        // Add employee button
        const addButton = document.getElementById('add-employee-btn');
        addButton?.addEventListener('click', () => this.showAddEmployeeForm());
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.applyFilters();
                this.render();
            });
        });
        
        // Make this instance globally available for onclick handlers
        window.employeeManager = this;
    }
    
    applyFilters() {
        switch (this.currentFilter) {
            case 'active':
                this.filteredEmployees = this.filteredEmployees.filter(emp => emp.isActive);
                break;
            case 'inactive':
                this.filteredEmployees = this.filteredEmployees.filter(emp => !emp.isActive);
                break;
            case 'managers':
                this.filteredEmployees = this.filteredEmployees.filter(emp => 
                    emp.position.toLowerCase().includes('manager'));
                break;
            case 'baristas':
                this.filteredEmployees = this.filteredEmployees.filter(emp => 
                    emp.position.toLowerCase().includes('barista'));
                break;
            case 'high-performers':
                this.filteredEmployees = this.filteredEmployees.filter(emp => 
                    emp.performanceScore >= 90);
                break;
            default: // 'all'
                // No additional filtering needed
                break;
        }
    }
    
    async showAddEmployeeForm() {
        try {
            // Fetch stores for the dropdown
            const stores = await this.api.getStores();
            const storeOptions = stores.map(store => ({
                value: store.id,
                label: `${store.name} - ${store.city}, ${store.country}`
            }));
            
            const fields = [
                { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g., Emma Nielsen' },
                { name: 'position', label: 'Position', required: true, placeholder: 'e.g., Store Manager' },
                { 
                    name: 'storeId', 
                    label: 'Store', 
                    type: 'searchable-select', 
                    required: true, 
                    options: storeOptions 
                },
                { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'e.g., emma@joe.dk' },
                { name: 'phone', label: 'Phone', placeholder: 'e.g., +45 23 45 67 89' },
                { name: 'hireDate', label: 'Hire Date', type: 'date', required: true },
                { name: 'salary', label: 'Monthly Salary', type: 'number', placeholder: '35000' },
                { name: 'performanceScore', label: 'Performance Score', type: 'number', placeholder: '85', min: 0, max: 100 }
            ];
            
            createForm(fields, async (data) => {
                try {
                    // Find the selected store for display
                    const selectedStore = stores.find(store => store.id === data.storeId);
                    
                    // For demo purposes, create a local employee object
                    const newEmployee = {
                        id: Date.now().toString(),
                        ...data,
                        store: selectedStore ? selectedStore.name : 'Unknown Store',
                        isActive: true,
                        hoursWorked: 0,
                        certifications: []
                    };
                    
                    try {
                        // Try to save to backend first
                        const savedEmployee = await this.api.createEmployee(newEmployee);
                        this.employees.push(savedEmployee);
                    } catch (apiError) {
                        // If backend fails, use local data
                        console.warn('Backend unavailable, using local data:', apiError);
                        this.employees.push(newEmployee);
                    }
                    
                    this.filteredEmployees = [...this.employees];
                    this.applyFilters();
                    this.render();
                    showToast('Employee added successfully!', 'success');
                    
                    // Close modal
                    document.getElementById('modal-overlay').classList.add('hidden');
                } catch (error) {
                    console.error('Failed to create employee:', error);
                    showToast('Failed to create employee', 'error');
                }
            }, 'Add Employee');
        } catch (error) {
            console.error('Failed to load stores for dropdown:', error);
            showToast('Failed to load stores. Please try again.', 'error');
        }
    }
    
    async editEmployee(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        if (!employee) return;
        
        try {
            // Fetch stores for the dropdown
            const stores = await this.api.getStores();
            const storeOptions = stores.map(store => ({
                value: store.id,
                label: `${store.name} - ${store.city}, ${store.country}`
            }));
            
            const fields = [
                { name: 'name', label: 'Full Name', required: true, value: employee.name },
                { name: 'position', label: 'Position', required: true, value: employee.position },
                { 
                    name: 'storeId', 
                    label: 'Store', 
                    type: 'searchable-select', 
                    required: true, 
                    options: storeOptions,
                    value: employee.storeId
                },
                { name: 'email', label: 'Email', type: 'email', required: true, value: employee.email },
                { name: 'phone', label: 'Phone', value: employee.phone || '' },
                { name: 'hireDate', label: 'Hire Date', type: 'date', required: true, value: employee.hireDate },
                { name: 'salary', label: 'Monthly Salary', type: 'number', value: employee.salary },
                { name: 'performanceScore', label: 'Performance Score', type: 'number', value: employee.performanceScore }
            ];
            
            createForm(fields, async (data) => {
                try {
                    // Find the selected store for display
                    const selectedStore = stores.find(store => store.id === data.storeId);
                    
                    const updatedEmployee = { 
                        id: employeeId, 
                        ...data, 
                        store: selectedStore ? selectedStore.name : employee.store,
                        isActive: employee.isActive 
                    };
                    
                    try {
                        // Try to update in backend first
                        await this.api.updateEmployee(updatedEmployee);
                    } catch (apiError) {
                        console.warn('Backend unavailable for update:', apiError);
                    }
                    
                    const index = this.employees.findIndex(e => e.id === employeeId);
                    if (index !== -1) {
                        this.employees[index] = { ...this.employees[index], ...updatedEmployee };
                        this.filteredEmployees = [...this.employees];
                        this.applyFilters();
                        this.render();
                        showToast('Employee updated successfully!', 'success');
                    }
                    
                    // Close modal
                    document.getElementById('modal-overlay').classList.add('hidden');
                } catch (error) {
                    console.error('Failed to update employee:', error);
                    showToast('Failed to update employee', 'error');
                }
            }, 'Update Employee');
        } catch (error) {
            console.error('Failed to load stores for dropdown:', error);
            showToast('Failed to load stores. Please try again.', 'error');
        }
    }
    
    async deleteEmployee(employeeId) {
        const employee = this.employees.find(e => e.id === employeeId);
        if (!employee) return;
        
        if (confirm(`Are you sure you want to delete "${employee.name}"? This action cannot be undone.`)) {
            try {
                try {
                    // Try to delete from backend first
                    await this.api.deleteEmployee(employeeId);
                } catch (apiError) {
                    console.warn('Backend unavailable for delete:', apiError);
                }
                
                this.employees = this.employees.filter(e => e.id !== employeeId);
                this.filteredEmployees = [...this.employees];
                this.applyFilters();
                this.render();
                showToast('Employee deleted successfully!', 'success');
            } catch (error) {
                console.error('Failed to delete employee:', error);
                showToast('Failed to delete employee', 'error');
            }
        }
    }
    
    getPerformanceColor(score) {
        if (score >= 90) return '#10B981'; // Green
        if (score >= 80) return '#F59E0B'; // Yellow
        if (score >= 70) return '#EF4444'; // Red
        return '#6B7280'; // Gray
    }
} 