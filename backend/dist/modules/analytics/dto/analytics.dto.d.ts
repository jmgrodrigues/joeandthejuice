export declare class StoreAnalytics {
    totalStores: number;
    activeStores: number;
    averageRevenue: number;
    averagePerformanceScore: number;
    topPerformingStores: StorePerformance[];
}
export declare class EmployeeAnalytics {
    totalEmployees: number;
    activeEmployees: number;
    averageSalary: number;
    averagePerformanceScore: number;
    topPerformingEmployees: EmployeePerformance[];
}
export declare class StorePerformance {
    storeId: string;
    storeName: string;
    revenue: number;
    performanceScore: number;
    employeeCount: number;
}
export declare class EmployeePerformance {
    employeeId: string;
    employeeName: string;
    position: string;
    performanceScore: number;
    hoursWorked: number;
    storeName: string;
}
export declare class DashboardMetrics {
    storeAnalytics: StoreAnalytics;
    employeeAnalytics: EmployeeAnalytics;
    countryStats: CountryStats[];
}
export declare class CountryStats {
    country: string;
    storeCount: number;
    totalRevenue: number;
    averagePerformance: number;
}
