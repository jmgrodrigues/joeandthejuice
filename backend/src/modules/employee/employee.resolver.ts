import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Resolver(() => Employee)
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  @Mutation(() => Employee)
  async createEmployee(@Args('createEmployeeDto') createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    return await this.employeeService.create(createEmployeeDto);
  }

  @Query(() => [Employee], { name: 'employees' })
  async findAll(): Promise<Employee[]> {
    return await this.employeeService.findAll();
  }

  @Query(() => Employee, { name: 'employee' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Employee> {
    return await this.employeeService.findOne(id);
  }

  @Query(() => [Employee], { name: 'employeesByStore' })
  async findByStore(@Args('storeId', { type: () => ID }) storeId: string): Promise<Employee[]> {
    return await this.employeeService.findByStore(storeId);
  }

  @Query(() => [Employee], { name: 'employeesByPosition' })
  async findByPosition(@Args('position') position: string): Promise<Employee[]> {
    return await this.employeeService.findByPosition(position);
  }

  @Mutation(() => Employee)
  async updateEmployee(@Args('updateEmployeeDto') updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    return await this.employeeService.update(updateEmployeeDto.id, updateEmployeeDto);
  }

  @Mutation(() => Boolean)
  async removeEmployee(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return await this.employeeService.remove(id);
  }

  @Mutation(() => Employee)
  async updateEmployeeHours(
    @Args('id', { type: () => ID }) id: string,
    @Args('hours', { type: () => Int }) hours: number,
  ): Promise<Employee> {
    return await this.employeeService.updateHoursWorked(id, hours);
  }
} 