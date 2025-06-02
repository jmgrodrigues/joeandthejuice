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
exports.EmployeeResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const employee_service_1 = require("./employee.service");
const employee_entity_1 = require("./entities/employee.entity");
const create_employee_dto_1 = require("./dto/create-employee.dto");
const update_employee_dto_1 = require("./dto/update-employee.dto");
let EmployeeResolver = class EmployeeResolver {
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    async createEmployee(createEmployeeDto) {
        return await this.employeeService.create(createEmployeeDto);
    }
    async findAll() {
        return await this.employeeService.findAll();
    }
    async findOne(id) {
        return await this.employeeService.findOne(id);
    }
    async findByStore(storeId) {
        return await this.employeeService.findByStore(storeId);
    }
    async findByPosition(position) {
        return await this.employeeService.findByPosition(position);
    }
    async updateEmployee(updateEmployeeDto) {
        return await this.employeeService.update(updateEmployeeDto.id, updateEmployeeDto);
    }
    async removeEmployee(id) {
        return await this.employeeService.remove(id);
    }
    async updateEmployeeHours(id, hours) {
        return await this.employeeService.updateHoursWorked(id, hours);
    }
};
exports.EmployeeResolver = EmployeeResolver;
__decorate([
    (0, graphql_1.Mutation)(() => employee_entity_1.Employee),
    __param(0, (0, graphql_1.Args)('createEmployeeDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeResolver.prototype, "createEmployee", null);
__decorate([
    (0, graphql_1.Query)(() => [employee_entity_1.Employee], { name: 'employees' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => employee_entity_1.Employee, { name: 'employee' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [employee_entity_1.Employee], { name: 'employeesByStore' }),
    __param(0, (0, graphql_1.Args)('storeId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeResolver.prototype, "findByStore", null);
__decorate([
    (0, graphql_1.Query)(() => [employee_entity_1.Employee], { name: 'employeesByPosition' }),
    __param(0, (0, graphql_1.Args)('position')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeResolver.prototype, "findByPosition", null);
__decorate([
    (0, graphql_1.Mutation)(() => employee_entity_1.Employee),
    __param(0, (0, graphql_1.Args)('updateEmployeeDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeResolver.prototype, "updateEmployee", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeResolver.prototype, "removeEmployee", null);
__decorate([
    (0, graphql_1.Mutation)(() => employee_entity_1.Employee),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('hours', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EmployeeResolver.prototype, "updateEmployeeHours", null);
exports.EmployeeResolver = EmployeeResolver = __decorate([
    (0, graphql_1.Resolver)(() => employee_entity_1.Employee),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeResolver);
//# sourceMappingURL=employee.resolver.js.map