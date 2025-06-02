import { formatCurrency, formatDate, formatPercentage, formatNumber, getPerformanceColor, showLoading } from '../utils/ui.js';

export class Analytics {
    constructor(api) {
        this.api = api;
        this.data = null;
    }
    
    async load() {
        const container = document.getElementById('analytics-content');
        showLoading(container, 'Loading analytics...');
        
        try {
            // Check if API is available
            if (!this.api) {
                throw new Error('API instance not available');
            }
            
            // Fetch data from the API
            if (this.api.getAnalytics) {
                this.data = await this.api.getAnalytics();
            } else {
                // Fallback: fetch stores and employees and create analytics
                const [stores, employees] = await Promise.all([
                    this.api.getStores ? this.api.getStores() : [],
                    this.api.getEmployees ? this.api.getEmployees() : []
                ]);
                
                this.data = this.createAnalyticsFromData(stores, employees);
            }
            
            this.render();
            console.log('📈 Analytics loaded successfully');
        } catch (error) {
            console.error('Failed to load analytics:', error);
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--gray-500);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                    <h3>Failed to load analytics</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }
    
    createAnalyticsFromData(stores, employees) {
        return {
            storeAnalytics: {
                totalStores: stores.length,
                activeStores: stores.filter(s => s.isActive).length,
                averageRevenue: stores.length > 0 ? stores.reduce((sum, s) => sum + (s.monthlyRevenue || s.revenue || 0), 0) / stores.length : 0,
                averagePerformanceScore: stores.length > 0 ? stores.reduce((sum, s) => sum + (s.performanceScore || 0), 0) / stores.length : 0,
                topPerformingStores: stores
                    .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
                    .slice(0, 5)
                    .map(store => ({
                        storeId: store.id,
                        storeName: store.name,
                        revenue: store.monthlyRevenue || store.revenue || 0,
                        performanceScore: store.performanceScore || 0,
                        employeeCount: store.employeeCount || 0
                    }))
            },
            employeeAnalytics: {
                totalEmployees: employees.length,
                activeEmployees: employees.filter(e => e.isActive).length,
                averageSalary: employees.length > 0 ? employees.reduce((sum, e) => sum + (e.salary || 0), 0) / employees.length : 0,
                averagePerformanceScore: employees.length > 0 ? employees.reduce((sum, e) => sum + (e.performanceScore || 0), 0) / employees.length : 0,
                topPerformingEmployees: employees
                    .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
                    .slice(0, 5)
                    .map(emp => ({
                        employeeId: emp.id,
                        employeeName: emp.name,
                        position: emp.position,
                        performanceScore: emp.performanceScore || 0,
                        hoursWorked: emp.hoursWorked || 0,
                        storeName: emp.store || 'Unknown'
                    }))
            },
            countryStats: this.calculateCountryStats(stores, employees)
        };
    }
    
    calculateCountryStats(stores, employees) {
        const countryMap = new Map();
        
        stores.forEach(store => {
            const country = store.country || 'Unknown';
            if (!countryMap.has(country)) {
                countryMap.set(country, {
                    country,
                    storeCount: 0,
                    totalRevenue: 0,
                    averagePerformance: 0,
                    performanceSum: 0
                });
            }
            
            const stats = countryMap.get(country);
            stats.storeCount++;
            stats.totalRevenue += store.monthlyRevenue || store.revenue || 0;
            stats.performanceSum += store.performanceScore || 0;
        });
        
        return Array.from(countryMap.values()).map(stats => ({
            ...stats,
            averagePerformance: stats.storeCount > 0 ? stats.performanceSum / stats.storeCount : 0
        }));
    }
    
    render() {
        const container = document.getElementById('analytics-content');
        if (!container || !this.data) return;
        
        container.innerHTML = `
            ${this.renderOverviewSection()}
            ${this.renderPerformanceAnalysis()}
            ${this.renderCountryBreakdown()}
            ${this.renderEmployeeInsights()}
            ${this.renderTrendAnalysis()}
        `;
    }
    
    renderOverviewSection() {
        const { storeAnalytics, employeeAnalytics } = this.data;
        
        return `
            <div class="analytics-section">
                <h2 class="section-title">📊 Performance Overview</h2>
                <div class="analytics-grid">
                    <div class="analytics-card">
                        <div class="analytics-header">
                            <h3>Store Performance</h3>
                            <span class="trend-indicator positive">+12%</span>
                        </div>
                        <div class="analytics-metric">
                            <span class="metric-value">${formatPercentage(storeAnalytics.averagePerformanceScore)}</span>
                            <span class="metric-label">Average Score</span>
                        </div>
                        <div class="analytics-details">
                            <div class="detail-item">
                                <span>Top Performer:</span>
                                <strong>${storeAnalytics.topPerformingStores[0]?.storeName || 'N/A'}</strong>
                            </div>
                            <div class="detail-item">
                                <span>Lowest Performer:</span>
                                <strong>${storeAnalytics.topPerformingStores[storeAnalytics.topPerformingStores.length - 1]?.storeName || 'N/A'}</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <div class="analytics-header">
                            <h3>Revenue Analysis</h3>
                            <span class="trend-indicator positive">+8%</span>
                        </div>
                        <div class="analytics-metric">
                            <span class="metric-value">${formatCurrency(storeAnalytics.averageRevenue)}</span>
                            <span class="metric-label">Avg Monthly Revenue</span>
                        </div>
                        <div class="analytics-details">
                            <div class="detail-item">
                                <span>Total Monthly:</span>
                                <strong>${formatCurrency(storeAnalytics.averageRevenue * storeAnalytics.totalStores)}</strong>
                            </div>
                            <div class="detail-item">
                                <span>Revenue per Employee:</span>
                                <strong>${formatCurrency((storeAnalytics.averageRevenue * storeAnalytics.totalStores) / employeeAnalytics.totalEmployees)}</strong>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <div class="analytics-header">
                            <h3>Workforce Metrics</h3>
                            <span class="trend-indicator positive">+5%</span>
                        </div>
                        <div class="analytics-metric">
                            <span class="metric-value">${employeeAnalytics.totalEmployees}</span>
                            <span class="metric-label">Total Employees</span>
                        </div>
                        <div class="analytics-details">
                            <div class="detail-item">
                                <span>Avg Performance:</span>
                                <strong>${formatPercentage(employeeAnalytics.averagePerformanceScore)}</strong>
                            </div>
                            <div class="detail-item">
                                <span>Avg Salary:</span>
                                <strong>${formatCurrency(employeeAnalytics.averageSalary)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderPerformanceAnalysis() {
        const { storeAnalytics } = this.data;
        const stores = storeAnalytics.topPerformingStores;
        
        return `
            <div class="analytics-section">
                <h2 class="section-title">🎯 Store Performance Analysis</h2>
                <div class="performance-chart">
                    <div class="chart-header">
                        <h3>Performance vs Revenue Correlation</h3>
                        <div class="chart-legend">
                            <span class="legend-item">
                                <span class="legend-color" style="background-color: var(--primary-color);"></span>
                                Performance Score
                            </span>
                            <span class="legend-item">
                                <span class="legend-color" style="background-color: var(--accent-color);"></span>
                                Revenue (scaled)
                            </span>
                        </div>
                    </div>
                    <div class="chart-content">
                        ${stores.map((store, index) => {
                            const maxRevenue = Math.max(...stores.map(s => s.revenue));
                            const revenueScale = (store.revenue / maxRevenue) * 100;
                            
                            return `
                                <div class="chart-bar-group">
                                    <div class="chart-label">${store.storeName.split(' ')[0]}</div>
                                    <div class="chart-bars">
                                        <div class="chart-bar performance-bar">
                                            <div class="bar-fill" style="width: ${store.performanceScore}%; background-color: var(--primary-color);"></div>
                                            <span class="bar-value">${Math.round(store.performanceScore)}%</span>
                                        </div>
                                        <div class="chart-bar revenue-bar">
                                            <div class="bar-fill" style="width: ${revenueScale}%; background-color: var(--accent-color);"></div>
                                            <span class="bar-value">${formatCurrency(store.revenue)}</span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderCountryBreakdown() {
        const { countryStats } = this.data;
        const totalRevenue = countryStats.reduce((sum, country) => sum + country.totalRevenue, 0);
        
        return `
            <div class="analytics-section">
                <h2 class="section-title">🌍 Global Performance Breakdown</h2>
                <div class="country-analytics">
                    <div class="country-overview">
                        <div class="overview-item">
                            <span class="overview-label">Countries:</span>
                            <span class="overview-value">${countryStats.length}</span>
                        </div>
                        <div class="overview-item">
                            <span class="overview-label">Total Revenue:</span>
                            <span class="overview-value">${formatCurrency(totalRevenue)}</span>
                        </div>
                        <div class="overview-item">
                            <span class="overview-label">Avg Performance:</span>
                            <span class="overview-value">${formatPercentage(countryStats.reduce((sum, c) => sum + c.averagePerformance, 0) / countryStats.length)}</span>
                        </div>
                    </div>
                    
                    <div class="country-grid">
                        ${countryStats.map(country => {
                            const revenueShare = (country.totalRevenue / totalRevenue) * 100;
                            
                            return `
                                <div class="country-card">
                                    <div class="country-header">
                                        <h4>${this.getCountryFlag(country.country)} ${country.country}</h4>
                                        <span class="country-performance" style="color: ${getPerformanceColor(country.averagePerformance)};">
                                            ${formatPercentage(country.averagePerformance)}
                                        </span>
                                    </div>
                                    <div class="country-metrics">
                                        <div class="country-metric">
                                            <span class="metric-label">Stores</span>
                                            <span class="metric-value">${country.storeCount}</span>
                                        </div>
                                        <div class="country-metric">
                                            <span class="metric-label">Revenue</span>
                                            <span class="metric-value">${formatCurrency(country.totalRevenue)}</span>
                                        </div>
                                        <div class="country-metric">
                                            <span class="metric-label">Market Share</span>
                                            <span class="metric-value">${Math.round(revenueShare)}%</span>
                                        </div>
                                    </div>
                                    <div class="revenue-share-bar">
                                        <div class="share-fill" style="width: ${revenueShare}%; background-color: ${getPerformanceColor(country.averagePerformance)};"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderEmployeeInsights() {
        const { employeeAnalytics } = this.data;
        const topEmployees = employeeAnalytics.topPerformingEmployees;
        
        return `
            <div class="analytics-section">
                <h2 class="section-title">👥 Employee Performance Insights</h2>
                <div class="employee-insights">
                    <div class="insights-summary">
                        <div class="summary-card">
                            <h4>Top Performers</h4>
                            <p>Employees scoring 90%+ performance</p>
                            <span class="summary-value">${topEmployees.filter(emp => emp.performanceScore >= 90).length}</span>
                        </div>
                        <div class="summary-card">
                            <h4>Average Hours</h4>
                            <p>Monthly working hours average</p>
                            <span class="summary-value">${Math.round(topEmployees.reduce((sum, emp) => sum + emp.hoursWorked, 0) / topEmployees.length)}h</span>
                        </div>
                        <div class="summary-card">
                            <h4>Performance Range</h4>
                            <p>Score distribution spread</p>
                            <span class="summary-value">${Math.round(Math.max(...topEmployees.map(e => e.performanceScore)) - Math.min(...topEmployees.map(e => e.performanceScore)))}%</span>
                        </div>
                    </div>
                    
                    <div class="top-performers-list">
                        <h4>🏆 Top Performing Employees</h4>
                        ${topEmployees.map((employee, index) => `
                            <div class="performer-item">
                                <div class="performer-rank">#${index + 1}</div>
                                <div class="performer-info">
                                    <div class="performer-name">${employee.employeeName}</div>
                                    <div class="performer-details">
                                        ${employee.position} at ${employee.storeName}
                                    </div>
                                </div>
                                <div class="performer-metrics">
                                    <div class="performer-score" style="color: ${getPerformanceColor(employee.performanceScore)};">
                                        ${formatPercentage(employee.performanceScore)}
                                    </div>
                                    <div class="performer-hours">${employee.hoursWorked}h</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTrendAnalysis() {
        return `
            <div class="analytics-section">
                <h2 class="section-title">📈 Trend Analysis</h2>
                <div class="trend-analysis">
                    <div class="trend-cards">
                        <div class="trend-card positive">
                            <div class="trend-header">
                                <span class="trend-icon">📈</span>
                                <h4>Revenue Growth</h4>
                            </div>
                            <div class="trend-value">+12%</div>
                            <div class="trend-description">Month-over-month increase</div>
                        </div>
                        
                        <div class="trend-card positive">
                            <div class="trend-header">
                                <span class="trend-icon">👥</span>
                                <h4>Staff Performance</h4>
                            </div>
                            <div class="trend-value">+5%</div>
                            <div class="trend-description">Average score improvement</div>
                        </div>
                        
                        <div class="trend-card neutral">
                            <div class="trend-header">
                                <span class="trend-icon">🏪</span>
                                <h4>Store Efficiency</h4>
                            </div>
                            <div class="trend-value">+2%</div>
                            <div class="trend-description">Revenue per square meter</div>
                        </div>
                        
                        <div class="trend-card negative">
                            <div class="trend-header">
                                <span class="trend-icon">⏱️</span>
                                <h4>Service Time</h4>
                            </div>
                            <div class="trend-value">-8%</div>
                            <div class="trend-description">Faster order processing</div>
                        </div>
                    </div>
                    
                    <div class="insights-box">
                        <h4>💡 Key Insights</h4>
                        <ul class="insights-list">
                            <li>Denmark stores show consistently higher performance scores</li>
                            <li>Employee performance correlates strongly with store revenue</li>
                            <li>Stores with managers scoring 95%+ have 20% higher team performance</li>
                            <li>Morning shifts (6-12) show better productivity than afternoon shifts</li>
                            <li>Urban stores outperform suburban locations by 15% on average</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    getCountryFlag(country) {
        const flags = {
            'Denmark': '🇩🇰',
            'United Kingdom': '🇬🇧',
            'United States': '🇺🇸',
            'Sweden': '🇸🇪',
            'Germany': '🇩🇪',
            'Norway': '🇳🇴',
            'Netherlands': '🇳🇱'
        };
        return flags[country] || '🏴';
    }
} 