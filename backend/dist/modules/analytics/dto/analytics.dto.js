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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryStats = exports.DashboardMetrics = exports.EmployeePerformance = exports.StorePerformance = exports.EmployeeAnalytics = exports.StoreAnalytics = void 0;
const graphql_1 = require("@nestjs/graphql");
let StoreAnalytics = class StoreAnalytics {
};
exports.StoreAnalytics = StoreAnalytics;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], StoreAnalytics.prototype, "totalStores", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], StoreAnalytics.prototype, "activeStores", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], StoreAnalytics.prototype, "averageRevenue", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], StoreAnalytics.prototype, "averagePerformanceScore", void 0);
__decorate([
    (0, graphql_1.Field)(() => [StorePerformance]),
    __metadata("design:type", Array)
], StoreAnalytics.prototype, "topPerformingStores", void 0);
exports.StoreAnalytics = StoreAnalytics = __decorate([
    (0, graphql_1.ObjectType)()
], StoreAnalytics);
let EmployeeAnalytics = class EmployeeAnalytics {
};
exports.EmployeeAnalytics = EmployeeAnalytics;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EmployeeAnalytics.prototype, "totalEmployees", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EmployeeAnalytics.prototype, "activeEmployees", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], EmployeeAnalytics.prototype, "averageSalary", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], EmployeeAnalytics.prototype, "averagePerformanceScore", void 0);
__decorate([
    (0, graphql_1.Field)(() => [EmployeePerformance]),
    __metadata("design:type", Array)
], EmployeeAnalytics.prototype, "topPerformingEmployees", void 0);
exports.EmployeeAnalytics = EmployeeAnalytics = __decorate([
    (0, graphql_1.ObjectType)()
], EmployeeAnalytics);
let StorePerformance = class StorePerformance {
};
exports.StorePerformance = StorePerformance;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StorePerformance.prototype, "storeId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StorePerformance.prototype, "storeName", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], StorePerformance.prototype, "revenue", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], StorePerformance.prototype, "performanceScore", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], StorePerformance.prototype, "employeeCount", void 0);
exports.StorePerformance = StorePerformance = __decorate([
    (0, graphql_1.ObjectType)()
], StorePerformance);
let EmployeePerformance = class EmployeePerformance {
};
exports.EmployeePerformance = EmployeePerformance;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], EmployeePerformance.prototype, "employeeId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], EmployeePerformance.prototype, "employeeName", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], EmployeePerformance.prototype, "position", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], EmployeePerformance.prototype, "performanceScore", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], EmployeePerformance.prototype, "hoursWorked", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], EmployeePerformance.prototype, "storeName", void 0);
exports.EmployeePerformance = EmployeePerformance = __decorate([
    (0, graphql_1.ObjectType)()
], EmployeePerformance);
let DashboardMetrics = class DashboardMetrics {
};
exports.DashboardMetrics = DashboardMetrics;
__decorate([
    (0, graphql_1.Field)(() => StoreAnalytics),
    __metadata("design:type", StoreAnalytics)
], DashboardMetrics.prototype, "storeAnalytics", void 0);
__decorate([
    (0, graphql_1.Field)(() => EmployeeAnalytics),
    __metadata("design:type", EmployeeAnalytics)
], DashboardMetrics.prototype, "employeeAnalytics", void 0);
__decorate([
    (0, graphql_1.Field)(() => [CountryStats]),
    __metadata("design:type", Array)
], DashboardMetrics.prototype, "countryStats", void 0);
exports.DashboardMetrics = DashboardMetrics = __decorate([
    (0, graphql_1.ObjectType)()
], DashboardMetrics);
let CountryStats = class CountryStats {
};
exports.CountryStats = CountryStats;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CountryStats.prototype, "country", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], CountryStats.prototype, "storeCount", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], CountryStats.prototype, "totalRevenue", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], CountryStats.prototype, "averagePerformance", void 0);
exports.CountryStats = CountryStats = __decorate([
    (0, graphql_1.ObjectType)()
], CountryStats);
//# sourceMappingURL=analytics.dto.js.map