"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./entities/employee.entity");
let EmployeeService = class EmployeeService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    async create(createEmployeeDto) {
        const employee = this.employeeRepository.create(Object.assign(Object.assign({}, createEmployeeDto), { hireDate: new Date(createEmployeeDto.hireDate) }));
        return await this.employeeRepository.save(employee);
    }
    async findAll() {
        return await this.employeeRepository.find({
            relations: ['store'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const employee = await this.employeeRepository.findOne({
            where: { id },
            relations: ['store'],
        });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }
    async findByStore(storeId) {
        return await this.employeeRepository.find({
            where: { storeId },
            relations: ['store'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByPosition(position) {
        return await this.employeeRepository.find({
            where: { position },
            relations: ['store'],
        });
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.findOne(id);
        const updateData = Object.assign({}, updateEmployeeDto);
        if (updateEmployeeDto.hireDate) {
            updateData.hireDate = new Date(updateEmployeeDto.hireDate);
        }
        Object.assign(employee, updateData);
        return await this.employeeRepository.save(employee);
    }
    async remove(id) {
        const employee = await this.findOne(id);
        await this.employeeRepository.remove(employee);
        return true;
    }
    async updateHoursWorked(id, hours) {
        const employee = await this.findOne(id);
        employee.hoursWorked += hours;
        return await this.employeeRepository.save(employee);
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map