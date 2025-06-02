import { Store } from '../../store/entities/store.entity';
export declare class Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position: string;
    salary: number;
    hireDate: Date;
    hoursWorked: number;
    performanceScore: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    storeId: string;
    store: Store;
}
