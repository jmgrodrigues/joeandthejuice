import { Employee } from '../../employee/entities/employee.entity';
export declare class Store {
    id: string;
    name: string;
    address: string;
    city: string;
    country: string;
    phone?: string;
    email?: string;
    manager: string;
    employeeCount: number;
    monthlyRevenue: number;
    performanceScore: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    employees?: Employee[];
}
