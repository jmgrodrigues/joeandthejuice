import { Repository } from 'typeorm';
import { Store } from '../store/entities/store.entity';
import { Employee } from '../employee/entities/employee.entity';
import { DashboardMetrics, StoreAnalytics, EmployeeAnalytics, StorePerformance, CountryStats } from './dto/analytics.dto';
export declare class AnalyticsService {
    private readonly storeRepository;
    private readonly employeeRepository;
    constructor(storeRepository: Repository<Store>, employeeRepository: Repository<Employee>);
    getDashboardMetrics(): Promise<DashboardMetrics>;
    getStoreAnalytics(): Promise<StoreAnalytics>;
    getEmployeeAnalytics(): Promise<EmployeeAnalytics>;
    getCountryStats(): Promise<CountryStats[]>;
    getStorePerformanceById(storeId: string): Promise<StorePerformance | null>;
}
