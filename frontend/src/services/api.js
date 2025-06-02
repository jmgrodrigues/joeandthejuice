/**
 * Joe & The Juice Store Management API Service
 * 
 * This service handles all communication with the NestJS GraphQL backend.
 * It provides clean, well-documented functions for all CRUD operations
 * with proper error handling and logging.
 */

// Backend configuration - using the real NestJS GraphQL server
const API_CONFIG = {
    baseUrl: 'http://localhost:3000',    // NestJS backend server
    graphqlEndpoint: '/graphql',          // GraphQL endpoint
    timeout: 10000,                       // 10 second timeout
    retryAttempts: 3,                     // Retry failed requests 3 times
    retryDelay: 1000                      // Wait 1 second between retries
};

/**
 * Utility function to make GraphQL requests to the backend
 * @param {string} query - The GraphQL query or mutation
 * @param {Object} variables - Variables for the GraphQL operation
 * @returns {Promise} - Promise resolving to the response data
 */
async function graphqlRequest(query, variables = {}) {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.graphqlEndpoint}`;
    
    console.log('🔍 Making GraphQL request:', {
        url,
        query: query.trim(),
        variables
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables
            }),
            // Add timeout handling
            signal: AbortSignal.timeout(API_CONFIG.timeout)
        });

        console.log('📡 Response status:', response.status);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ GraphQL response:', result);

        // Check for GraphQL errors
        if (result.errors) {
            console.error('❌ GraphQL errors:', result.errors);
            throw new Error(`GraphQL Error: ${result.errors.map(e => e.message).join(', ')}`);
        }

        return result.data;
    } catch (error) {
        console.error('💥 API Request failed:', error);
        
        // Check if it's a network error (backend not running)
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('❌ Cannot connect to backend server. Please ensure the NestJS server is running on http://localhost:3000');
        }
        
        // Check if it's a timeout error
        if (error.name === 'TimeoutError') {
            throw new Error('⏰ Request timeout. The server is taking too long to respond.');
        }
        
        throw error;
    }
}

/**
 * Retry wrapper for API calls
 * @param {Function} apiCall - The API function to retry
 * @param {number} attempts - Number of retry attempts remaining
 * @returns {Promise} - Promise resolving to the API response
 */
async function withRetry(apiCall, attempts = API_CONFIG.retryAttempts) {
    try {
        return await apiCall();
    } catch (error) {
        if (attempts > 1 && !error.message.includes('Cannot connect to backend')) {
            console.log(`🔄 Retrying API call. ${attempts - 1} attempts remaining...`);
            await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
            return withRetry(apiCall, attempts - 1);
        }
        throw error;
    }
}

// =============================================================================
// STORE MANAGEMENT API (Updated to match actual schema)
// =============================================================================

/**
 * Fetch all stores from the backend database
 * @returns {Promise<Array>} - Promise resolving to array of stores
 */
export async function fetchStores() {
    const query = `
        query GetAllStores {
            stores {
                id
                name
                city
                address
                manager
                monthlyRevenue
                performanceScore
                employeeCount
                country
                email
                phone
                isActive
                createdAt
                updatedAt
            }
        }
    `;

    return withRetry(async () => {
        const data = await graphqlRequest(query);
        console.log('🏪 Fetched stores from backend:', data.stores?.length || 0, 'stores');
        
        // Map the backend fields to match frontend expectations
        const mappedStores = (data.stores || []).map(store => ({
            ...store,
            location: store.city, // Map city to location for frontend compatibility
            revenue: store.monthlyRevenue, // Map monthlyRevenue to revenue
            openingHours: '08:00-20:00' // Default value since not in schema
        }));
        
        return mappedStores;
    });
}

/**
 * Create a new store in the backend database
 * @param {Object} storeData - Store information to create
 * @returns {Promise<Object>} - Promise resolving to the created store
 */
export async function createStore(storeData) {
    console.log('📝 Creating new store with data:', storeData);
    
    // Validate required fields
    const requiredFields = ['name', 'city', 'address', 'manager'];
    const missingFields = requiredFields.filter(field => !storeData[field] && !storeData.location);
    
    if (missingFields.length > 0 && !storeData.location) {
        throw new Error(`❌ Missing required fields: ${missingFields.join(', ')}`);
    }

    const mutation = `
        mutation CreateStore($input: CreateStoreDto!) {
            createStore(createStoreDto: $input) {
                id
                name
                city
                address
                manager
                monthlyRevenue
                performanceScore
                employeeCount
                country
                email
                phone
                isActive
                createdAt
                updatedAt
            }
        }
    `;

    return withRetry(async () => {
        const variables = {
            input: {
                name: storeData.name.trim(),
                city: storeData.city || storeData.location, // Accept both city and location
                address: storeData.address.trim(),
                manager: storeData.manager.trim(),
                monthlyRevenue: parseFloat(storeData.monthlyRevenue || storeData.revenue) || 0,
                performanceScore: parseFloat(storeData.performanceScore) || 85,
                country: storeData.country || 'Denmark',
                email: storeData.email || '',
                phone: storeData.phone || ''
            }
        };

        const data = await graphqlRequest(mutation, variables);
        console.log('✅ Store created successfully:', data.createStore);
        
        // Map the response to match frontend expectations
        const mappedStore = {
            ...data.createStore,
            location: data.createStore.city,
            revenue: data.createStore.monthlyRevenue,
            openingHours: '08:00-20:00'
        };
        
        return mappedStore;
    });
}

/**
 * Update an existing store in the backend database
 * @param {string} id - Store ID to update
 * @param {Object} storeData - Updated store information
 * @returns {Promise<Object>} - Promise resolving to the updated store
 */
export async function updateStore(id, storeData) {
    console.log('📝 Updating store:', id, 'with data:', storeData);

    const mutation = `
        mutation UpdateStore($input: UpdateStoreDto!) {
            updateStore(updateStoreDto: $input) {
                id
                name
                city
                address
                manager
                monthlyRevenue
                performanceScore
                employeeCount
                country
                email
                phone
                isActive
                createdAt
                updatedAt
            }
        }
    `;

    return withRetry(async () => {
        const variables = {
            input: {
                id: id,
                name: storeData.name?.trim(),
                city: storeData.city || storeData.location,
                address: storeData.address?.trim(),
                manager: storeData.manager?.trim(),
                monthlyRevenue: storeData.monthlyRevenue ? parseFloat(storeData.monthlyRevenue) : (storeData.revenue ? parseFloat(storeData.revenue) : undefined),
                performanceScore: storeData.performanceScore ? parseFloat(storeData.performanceScore) : undefined,
                country: storeData.country,
                email: storeData.email,
                phone: storeData.phone
            }
        };

        // Remove undefined values
        Object.keys(variables.input).forEach(key => {
            if (variables.input[key] === undefined) {
                delete variables.input[key];
            }
        });

        const data = await graphqlRequest(mutation, variables);
        console.log('✅ Store updated successfully:', data.updateStore);
        
        // Map the response to match frontend expectations
        const mappedStore = {
            ...data.updateStore,
            location: data.updateStore.city,
            revenue: data.updateStore.monthlyRevenue,
            openingHours: '08:00-20:00'
        };
        
        return mappedStore;
    });
}

/**
 * Delete a store from the backend database
 * @param {string} id - Store ID to delete
 * @returns {Promise<boolean>} - Promise resolving to deletion success
 */
export async function deleteStore(id) {
    console.log('🗑️ Deleting store:', id);

    const mutation = `
        mutation RemoveStore($id: ID!) {
            removeStore(id: $id)
        }
    `;

    return withRetry(async () => {
        const variables = { id };
        const data = await graphqlRequest(mutation, variables);
        console.log('✅ Store deleted successfully:', data.removeStore);
        return data.removeStore;
    });
}

// =============================================================================
// EMPLOYEE MANAGEMENT API (Updated to match actual schema)
// =============================================================================

/**
 * Fetch all employees from the backend database
 * @returns {Promise<Array>} - Promise resolving to array of employees
 */
export async function fetchEmployees() {
    const query = `
        query GetAllEmployees {
            employees {
                id
                firstName
                lastName
                email
                phone
                position
                salary
                performanceScore
                hireDate
                hoursWorked
                isActive
                storeId
                store {
                    id
                    name
                    city
                    country
                }
                createdAt
                updatedAt
            }
        }
    `;

    return withRetry(async () => {
        const data = await graphqlRequest(query);
        console.log('👥 Fetched employees from backend:', data.employees?.length || 0, 'employees');
        
        // Map the backend fields to match frontend expectations
        const mappedEmployees = (data.employees || []).map(employee => ({
            ...employee,
            name: `${employee.firstName} ${employee.lastName}`, // Combine first and last name
        }));
        
        return mappedEmployees;
    });
}

/**
 * Create a new employee in the backend database
 * @param {Object} employeeData - Employee information to create
 * @returns {Promise<Object>} - Promise resolving to the created employee
 */
export async function createEmployee(employeeData) {
    console.log('📝 Creating new employee with data:', employeeData);
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'position', 'salary', 'storeId'];
    const missingFields = requiredFields.filter(field => !employeeData[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`❌ Missing required fields: ${missingFields.join(', ')}`);
    }

    const mutation = `
        mutation CreateEmployee($input: CreateEmployeeDto!) {
            createEmployee(createEmployeeDto: $input) {
                id
                firstName
                lastName
                email
                phone
                position
                salary
                performanceScore
                hireDate
                hoursWorked
                isActive
                storeId
                store {
                    id
                    name
                    city
                    country
                }
                createdAt
                updatedAt
            }
        }
    `;

    return withRetry(async () => {
        const variables = {
            input: {
                firstName: employeeData.firstName.trim(),
                lastName: employeeData.lastName.trim(),
                email: employeeData.email.trim(),
                phone: employeeData.phone || '',
                position: employeeData.position.trim(),
                salary: parseFloat(employeeData.salary),
                performanceScore: parseFloat(employeeData.performanceScore) || 75,
                hireDate: employeeData.hireDate || new Date().toISOString(),
                storeId: employeeData.storeId
            }
        };

        const data = await graphqlRequest(mutation, variables);
        console.log('✅ Employee created successfully:', data.createEmployee);
        
        // Map the response to match frontend expectations
        const mappedEmployee = {
            ...data.createEmployee,
            name: `${data.createEmployee.firstName} ${data.createEmployee.lastName}`
        };
        
        return mappedEmployee;
    });
}

/**
 * Update an existing employee in the backend database
 * @param {string} id - Employee ID to update
 * @param {Object} employeeData - Updated employee information
 * @returns {Promise<Object>} - Promise resolving to the updated employee
 */
export async function updateEmployee(id, employeeData) {
    console.log('📝 Updating employee:', id, 'with data:', employeeData);

    const mutation = `
        mutation UpdateEmployee($input: UpdateEmployeeDto!) {
            updateEmployee(updateEmployeeDto: $input) {
                id
                firstName
                lastName
                email
                phone
                position
                salary
                performanceScore
                hireDate
                hoursWorked
                isActive
                storeId
                store {
                    id
                    name
                    city
                    country
                }
                createdAt
                updatedAt
            }
        }
    `;

    return withRetry(async () => {
        const variables = {
            input: {
                id: id,
                firstName: employeeData.firstName?.trim(),
                lastName: employeeData.lastName?.trim(),
                email: employeeData.email?.trim(),
                phone: employeeData.phone,
                position: employeeData.position?.trim(),
                salary: employeeData.salary ? parseFloat(employeeData.salary) : undefined,
                performanceScore: employeeData.performanceScore ? parseFloat(employeeData.performanceScore) : undefined,
                hireDate: employeeData.hireDate,
                storeId: employeeData.storeId
            }
        };

        // Remove undefined values
        Object.keys(variables.input).forEach(key => {
            if (variables.input[key] === undefined) {
                delete variables.input[key];
            }
        });

        const data = await graphqlRequest(mutation, variables);
        console.log('✅ Employee updated successfully:', data.updateEmployee);
        
        // Map the response to match frontend expectations
        const mappedEmployee = {
            ...data.updateEmployee,
            name: `${data.updateEmployee.firstName} ${data.updateEmployee.lastName}`
        };
        
        return mappedEmployee;
    });
}

/**
 * Delete an employee from the backend database
 * @param {string} id - Employee ID to delete
 * @returns {Promise<boolean>} - Promise resolving to deletion success
 */
export async function deleteEmployee(id) {
    console.log('🗑️ Deleting employee:', id);

    const mutation = `
        mutation RemoveEmployee($id: ID!) {
            removeEmployee(id: $id)
        }
    `;

    return withRetry(async () => {
        const variables = { id };
        const data = await graphqlRequest(mutation, variables);
        console.log('✅ Employee deleted successfully:', data.removeEmployee);
        return data.removeEmployee;
    });
}

// =============================================================================
// ANALYTICS API (Updated to match actual schema)
// =============================================================================

/**
 * Fetch analytics data from the backend
 * @returns {Promise<Object>} - Promise resolving to analytics data
 */
export async function fetchAnalytics() {
    const query = `
        query GetDashboardMetrics {
            dashboardMetrics {
                storeAnalytics {
                    totalStores
                    activeStores
                    averageRevenue
                    averagePerformanceScore
                    topPerformingStores {
                        storeId
                        storeName
                        revenue
                        performanceScore
                        employeeCount
                    }
                }
                employeeAnalytics {
                    totalEmployees
                    activeEmployees
                    averageSalary
                    averagePerformanceScore
                    topPerformingEmployees {
                        employeeId
                        employeeName
                        position
                        performanceScore
                        hoursWorked
                        storeName
                    }
                }
                countryStats {
                    country
                    storeCount
                    totalRevenue
                    averagePerformance
                }
            }
        }
    `;

    return withRetry(async () => {
        const data = await graphqlRequest(query);
        console.log('📊 Fetched analytics from backend:', data.dashboardMetrics);
        return data.dashboardMetrics || {};
    });
}

// =============================================================================
// CONNECTION TESTING
// =============================================================================

/**
 * Test connection to the backend GraphQL API and return API instance
 * @returns {Promise<Object>} - Promise resolving to connection status and API instance
 */
export async function testConnection() {
    try {
        console.log('🔍 Testing GraphQL connection...');
        
        // Simple query to test the connection
        const query = `
            query TestConnection {
                stores {
                    id
                }
            }
        `;
        
        await graphqlRequest(query);
        console.log('✅ GraphQL connection test successful');
        
        // Return real API instance
        return {
            connected: true,
            api: createRealAPI()
        };
    } catch (error) {
        console.error('❌ GraphQL connection test failed:', error);
        return {
            connected: false,
            api: null
        };
    }
}

/**
 * Create real API instance that uses GraphQL backend
 */
function createRealAPI() {
    return {
        // Store operations
        getStores: fetchStores,
        createStore: createStore,
        updateStore: (storeData) => updateStore(storeData.id, storeData),
        deleteStore: deleteStore,
        
        // Employee operations
        getEmployees: fetchEmployees,
        createEmployee: createEmployee,
        updateEmployee: (employeeData) => updateEmployee(employeeData.id, employeeData),
        deleteEmployee: deleteEmployee,
        
        // Analytics operations
        getAnalytics: fetchAnalytics
    };
}

/**
 * Create mock API instance for demo mode
 */
export function createMockAPI() {
    // Demo data
    let stores = [
        {
            id: '1',
            name: 'Copenhagen Central',
            city: 'Copenhagen',
            country: 'Denmark',
            address: 'Strøget 15, Copenhagen',
            manager: 'Emma Nielsen',
            monthlyRevenue: 125000,
            performanceScore: 92,
            employeeCount: 8,
            email: 'copenhagen@joe.dk',
            phone: '+45 33 12 34 56',
            isActive: true
        },
        {
            id: '2',
            name: 'Aarhus Store',
            city: 'Aarhus',
            country: 'Denmark',
            address: 'Bruuns Galleri, Aarhus',
            manager: 'Magnus Østergaard',
            monthlyRevenue: 95000,
            performanceScore: 87,
            employeeCount: 6,
            email: 'aarhus@joe.dk',
            phone: '+45 86 12 34 56',
            isActive: true
        },
        {
            id: '3',
            name: 'Bergen Store',
            city: 'Bergen',
            country: 'Norway',
            address: 'Strandgaten 23, Bergen',
            manager: 'Isabella Thomsen',
            monthlyRevenue: 88000,
            performanceScore: 89,
            employeeCount: 5,
            email: 'bergen@joe.no',
            phone: '+47 55 12 34 56',
            isActive: true
        }
    ];

    let employees = [
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
            hoursWorked: 160
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
            hoursWorked: 155
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
            hoursWorked: 140
        }
    ];

    return {
        // Store operations
        getStores: async () => {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
            return [...stores];
        },
        
        createStore: async (storeData) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const newStore = {
                id: Date.now().toString(),
                ...storeData,
                employeeCount: 0,
                isActive: true,
                monthlyRevenue: storeData.monthlyRevenue || 0,
                performanceScore: storeData.performanceScore || 85
            };
            stores.push(newStore);
            return newStore;
        },
        
        updateStore: async (storeData) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = stores.findIndex(s => s.id === storeData.id);
            if (index !== -1) {
                stores[index] = { ...stores[index], ...storeData };
                return stores[index];
            }
            throw new Error('Store not found');
        },
        
        deleteStore: async (storeId) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = stores.findIndex(s => s.id === storeId);
            if (index !== -1) {
                stores.splice(index, 1);
                return true;
            }
            return false;
        },

        // Employee operations
        getEmployees: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return [...employees];
        },
        
        createEmployee: async (employeeData) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const newEmployee = {
                id: Date.now().toString(),
                ...employeeData,
                isActive: true,
                hoursWorked: 0
            };
            employees.push(newEmployee);
            return newEmployee;
        },
        
        updateEmployee: async (employeeData) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = employees.findIndex(e => e.id === employeeData.id);
            if (index !== -1) {
                employees[index] = { ...employees[index], ...employeeData };
                return employees[index];
            }
            throw new Error('Employee not found');
        },
        
        deleteEmployee: async (employeeId) => {
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = employees.findIndex(e => e.id === employeeId);
            if (index !== -1) {
                employees.splice(index, 1);
                return true;
            }
            return false;
        },

        // Analytics operations
        getAnalytics: async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                storeAnalytics: {
                    totalStores: stores.length,
                    activeStores: stores.filter(s => s.isActive).length,
                    averageRevenue: stores.reduce((sum, s) => sum + s.monthlyRevenue, 0) / stores.length,
                    averagePerformanceScore: stores.reduce((sum, s) => sum + s.performanceScore, 0) / stores.length
                },
                employeeAnalytics: {
                    totalEmployees: employees.length,
                    activeEmployees: employees.filter(e => e.isActive).length,
                    averageSalary: employees.reduce((sum, e) => sum + e.salary, 0) / employees.length,
                    averagePerformanceScore: employees.reduce((sum, e) => sum + e.performanceScore, 0) / employees.length
                }
            };
        }
    };
}

// =============================================================================
// ERROR HANDLING UTILITIES
// =============================================================================

/**
 * Extract user-friendly error message from various error types
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(error) {
    if (error.message.includes('Cannot connect to backend')) {
        return 'Backend server is not running. Please start the NestJS server.';
    }
    
    if (error.message.includes('timeout')) {
        return 'Request timed out. Please try again.';
    }
    
    if (error.message.includes('400')) {
        return 'Invalid request. Please check your input data.';
    }
    
    if (error.message.includes('500')) {
        return 'Server error. Please try again later.';
    }
    
    return error.message || 'An unexpected error occurred.';
}

console.log('🔗 Joe & The Juice API Service loaded with real GraphQL integration!'); 