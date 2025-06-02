import { AnalyticsService } from './analytics.service';
import { DashboardMetrics, StoreAnalytics, EmployeeAnalytics, StorePerformance, CountryStats } from './dto/analytics.dto';
export declare class AnalyticsResolver {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getDashboardMetrics(): Promise<DashboardMetrics>;
    getStoreAnalytics(): Promise<StoreAnalytics>;
    getEmployeeAnalytics(): Promise<EmployeeAnalytics>;
    getCountryStats(): Promise<CountryStats[]>;
    getStorePerformance(storeId: string): Promise<StorePerformance | null>;
}
