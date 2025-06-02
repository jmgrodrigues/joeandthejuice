import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
export declare class EmployeeResolver {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee>;
    findAll(): Promise<Employee[]>;
    findOne(id: string): Promise<Employee>;
    findByStore(storeId: string): Promise<Employee[]>;
    findByPosition(position: string): Promise<Employee[]>;
    updateEmployee(updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    removeEmployee(id: string): Promise<boolean>;
    updateEmployeeHours(id: string, hours: number): Promise<Employee>;
}
