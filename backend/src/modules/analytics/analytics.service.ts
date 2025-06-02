import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../store/entities/store.entity';
import { Employee } from '../employee/entities/employee.entity';
import {
  DashboardMetrics,
  StoreAnalytics,
  EmployeeAnalytics,
  StorePerformance,
  EmployeePerformance,
  CountryStats,
} from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const [storeAnalytics, employeeAnalytics, countryStats] = await Promise.all([
      this.getStoreAnalytics(),
      this.getEmployeeAnalytics(),
      this.getCountryStats(),
    ]);

    return {
      storeAnalytics,
      employeeAnalytics,
      countryStats,
    };
  }

  async getStoreAnalytics(): Promise<StoreAnalytics> {
    const stores = await this.storeRepository.find({
      relations: ['employees'],
    });

    const activeStores = stores.filter(store => store.isActive);
    const totalRevenue = stores.reduce((sum, store) => sum + Number(store.monthlyRevenue), 0);
    const totalPerformance = stores.reduce((sum, store) => sum + Number(store.performanceScore), 0);

    const topPerformingStores = stores
      .sort((a, b) => Number(b.performanceScore) - Number(a.performanceScore))
      .slice(0, 5)
      .map(store => ({
        storeId: store.id,
        storeName: store.name,
        revenue: Number(store.monthlyRevenue),
        performanceScore: Number(store.performanceScore),
        employeeCount: store.employeeCount,
      }));

    return {
      totalStores: stores.length,
      activeStores: activeStores.length,
      averageRevenue: stores.length > 0 ? totalRevenue / stores.length : 0,
      averagePerformanceScore: stores.length > 0 ? totalPerformance / stores.length : 0,
      topPerformingStores,
    };
  }

  async getEmployeeAnalytics(): Promise<EmployeeAnalytics> {
    const employees = await this.employeeRepository.find({
      relations: ['store'],
    });

    const activeEmployees = employees.filter(employee => employee.isActive);
    const totalSalary = employees.reduce((sum, employee) => sum + Number(employee.salary), 0);
    const totalPerformance = employees.reduce((sum, employee) => sum + Number(employee.performanceScore), 0);

    const topPerformingEmployees = employees
      .sort((a, b) => Number(b.performanceScore) - Number(a.performanceScore))
      .slice(0, 5)
      .map(employee => ({
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        position: employee.position,
        performanceScore: Number(employee.performanceScore),
        hoursWorked: employee.hoursWorked,
        storeName: employee.store.name,
      }));

    return {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      averageSalary: employees.length > 0 ? totalSalary / employees.length : 0,
      averagePerformanceScore: employees.length > 0 ? totalPerformance / employees.length : 0,
      topPerformingEmployees,
    };
  }

  async getCountryStats(): Promise<CountryStats[]> {
    const stores = await this.storeRepository.find();
    
    const countryMap = new Map<string, {
      storeCount: number;
      totalRevenue: number;
      totalPerformance: number;
    }>();

    stores.forEach(store => {
      const country = store.country;
      const existing = countryMap.get(country) || {
        storeCount: 0,
        totalRevenue: 0,
        totalPerformance: 0,
      };

      countryMap.set(country, {
        storeCount: existing.storeCount + 1,
        totalRevenue: existing.totalRevenue + Number(store.monthlyRevenue),
        totalPerformance: existing.totalPerformance + Number(store.performanceScore),
      });
    });

    return Array.from(countryMap.entries()).map(([country, stats]) => ({
      country,
      storeCount: stats.storeCount,
      totalRevenue: stats.totalRevenue,
      averagePerformance: stats.storeCount > 0 ? stats.totalPerformance / stats.storeCount : 0,
    }));
  }

  async getStorePerformanceById(storeId: string): Promise<StorePerformance | null> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['employees'],
    });

    if (!store) {
      return null;
    }

    return {
      storeId: store.id,
      storeName: store.name,
      revenue: Number(store.monthlyRevenue),
      performanceScore: Number(store.performanceScore),
      employeeCount: store.employeeCount,
    };
  }
} 