import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { AnalyticsService } from './analytics.service';
import {
  DashboardMetrics,
  StoreAnalytics,
  EmployeeAnalytics,
  StorePerformance,
  CountryStats,
} from './dto/analytics.dto';

@Resolver()
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => DashboardMetrics, { name: 'dashboardMetrics' })
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return await this.analyticsService.getDashboardMetrics();
  }

  @Query(() => StoreAnalytics, { name: 'storeAnalytics' })
  async getStoreAnalytics(): Promise<StoreAnalytics> {
    return await this.analyticsService.getStoreAnalytics();
  }

  @Query(() => EmployeeAnalytics, { name: 'employeeAnalytics' })
  async getEmployeeAnalytics(): Promise<EmployeeAnalytics> {
    return await this.analyticsService.getEmployeeAnalytics();
  }

  @Query(() => [CountryStats], { name: 'countryStats' })
  async getCountryStats(): Promise<CountryStats[]> {
    return await this.analyticsService.getCountryStats();
  }

  @Query(() => StorePerformance, { name: 'storePerformance', nullable: true })
  async getStorePerformance(@Args('storeId', { type: () => ID }) storeId: string): Promise<StorePerformance | null> {
    return await this.analyticsService.getStorePerformanceById(storeId);
  }
} 