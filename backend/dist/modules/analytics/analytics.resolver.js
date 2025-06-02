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
exports.AnalyticsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const analytics_service_1 = require("./analytics.service");
const analytics_dto_1 = require("./dto/analytics.dto");
let AnalyticsResolver = class AnalyticsResolver {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboardMetrics() {
        return await this.analyticsService.getDashboardMetrics();
    }
    async getStoreAnalytics() {
        return await this.analyticsService.getStoreAnalytics();
    }
    async getEmployeeAnalytics() {
        return await this.analyticsService.getEmployeeAnalytics();
    }
    async getCountryStats() {
        return await this.analyticsService.getCountryStats();
    }
    async getStorePerformance(storeId) {
        return await this.analyticsService.getStorePerformanceById(storeId);
    }
};
exports.AnalyticsResolver = AnalyticsResolver;
__decorate([
    (0, graphql_1.Query)(() => analytics_dto_1.DashboardMetrics, { name: 'dashboardMetrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "getDashboardMetrics", null);
__decorate([
    (0, graphql_1.Query)(() => analytics_dto_1.StoreAnalytics, { name: 'storeAnalytics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "getStoreAnalytics", null);
__decorate([
    (0, graphql_1.Query)(() => analytics_dto_1.EmployeeAnalytics, { name: 'employeeAnalytics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "getEmployeeAnalytics", null);
__decorate([
    (0, graphql_1.Query)(() => [analytics_dto_1.CountryStats], { name: 'countryStats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "getCountryStats", null);
__decorate([
    (0, graphql_1.Query)(() => analytics_dto_1.StorePerformance, { name: 'storePerformance', nullable: true }),
    __param(0, (0, graphql_1.Args)('storeId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsResolver.prototype, "getStorePerformance", null);
exports.AnalyticsResolver = AnalyticsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsResolver);
//# sourceMappingURL=analytics.resolver.js.map