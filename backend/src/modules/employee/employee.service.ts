import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      hireDate: new Date(createEmployeeDto.hireDate),
    });
    return await this.employeeRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeRepository.find({
      relations: ['store'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['store'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async findByStore(storeId: string): Promise<Employee[]> {
    return await this.employeeRepository.find({
      where: { storeId },
      relations: ['store'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPosition(position: string): Promise<Employee[]> {
    return await this.employeeRepository.find({
      where: { position },
      relations: ['store'],
    });
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    
    const updateData: any = { ...updateEmployeeDto };
    if (updateEmployeeDto.hireDate) {
      updateData.hireDate = new Date(updateEmployeeDto.hireDate);
    }
    
    Object.assign(employee, updateData);
    return await this.employeeRepository.save(employee);
  }

  async remove(id: string): Promise<boolean> {
    const employee = await this.findOne(id);
    await this.employeeRepository.remove(employee);
    return true;
  }

  async updateHoursWorked(id: string, hours: number): Promise<Employee> {
    const employee = await this.findOne(id);
    employee.hoursWorked += hours;
    return await this.employeeRepository.save(employee);
  }
} 