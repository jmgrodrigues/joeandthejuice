import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class StoreAnalytics {
  @Field(() => Int)
  totalStores: number;

  @Field(() => Int)
  activeStores: number;

  @Field(() => Float)
  averageRevenue: number;

  @Field(() => Float)
  averagePerformanceScore: number;

  @Field(() => [StorePerformance])
  topPerformingStores: StorePerformance[];
}

@ObjectType()
export class EmployeeAnalytics {
  @Field(() => Int)
  totalEmployees: number;

  @Field(() => Int)
  activeEmployees: number;

  @Field(() => Float)
  averageSalary: number;

  @Field(() => Float)
  averagePerformanceScore: number;

  @Field(() => [EmployeePerformance])
  topPerformingEmployees: EmployeePerformance[];
}

@ObjectType()
export class StorePerformance {
  @Field()
  storeId: string;

  @Field()
  storeName: string;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  performanceScore: number;

  @Field(() => Int)
  employeeCount: number;
}

@ObjectType()
export class EmployeePerformance {
  @Field()
  employeeId: string;

  @Field()
  employeeName: string;

  @Field()
  position: string;

  @Field(() => Float)
  performanceScore: number;

  @Field(() => Int)
  hoursWorked: number;

  @Field()
  storeName: string;
}

@ObjectType()
export class DashboardMetrics {
  @Field(() => StoreAnalytics)
  storeAnalytics: StoreAnalytics;

  @Field(() => EmployeeAnalytics)
  employeeAnalytics: EmployeeAnalytics;

  @Field(() => [CountryStats])
  countryStats: CountryStats[];
}

@ObjectType()
export class CountryStats {
  @Field()
  country: string;

  @Field(() => Int)
  storeCount: number;

  @Field(() => Float)
  totalRevenue: number;

  @Field(() => Float)
  averagePerformance: number;
} 