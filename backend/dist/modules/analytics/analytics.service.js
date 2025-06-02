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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("../store/entities/store.entity");
const employee_entity_1 = require("../employee/entities/employee.entity");
let AnalyticsService = class AnalyticsService {
    constructor(storeRepository, employeeRepository) {
        this.storeRepository = storeRepository;
        this.employeeRepository = employeeRepository;
    }
    async getDashboardMetrics() {
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
    async getStoreAnalytics() {
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
    async getEmployeeAnalytics() {
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
    async getCountryStats() {
        const stores = await this.storeRepository.find();
        const countryMap = new Map();
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
    async getStorePerformanceById(storeId) {
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
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __param(1, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map