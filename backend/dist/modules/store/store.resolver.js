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
exports.StoreResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const store_service_1 = require("./store.service");
const store_entity_1 = require("./entities/store.entity");
const create_store_dto_1 = require("./dto/create-store.dto");
const update_store_dto_1 = require("./dto/update-store.dto");
let StoreResolver = class StoreResolver {
    constructor(storeService) {
        this.storeService = storeService;
    }
    async createStore(createStoreDto) {
        return await this.storeService.create(createStoreDto);
    }
    async findAll() {
        return await this.storeService.findAll();
    }
    async findOne(id) {
        return await this.storeService.findOne(id);
    }
    async findByCity(city) {
        return await this.storeService.findByCity(city);
    }
    async findByCountry(country) {
        return await this.storeService.findByCountry(country);
    }
    async updateStore(updateStoreDto) {
        return await this.storeService.update(updateStoreDto.id, updateStoreDto);
    }
    async removeStore(id) {
        return await this.storeService.remove(id);
    }
};
exports.StoreResolver = StoreResolver;
__decorate([
    (0, graphql_1.Mutation)(() => store_entity_1.Store),
    __param(0, (0, graphql_1.Args)('createStoreDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_store_dto_1.CreateStoreDto]),
    __metadata("design:returntype", Promise)
], StoreResolver.prototype, "createStore", null);
__decorate([
    (0, graphql_1.Query)(() => [store_entity_1.Store], { name: 'stores' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StoreResolver.prototype, "findAll", null);
__decorate([
    (0, graphql_1.Query)(() => store_entity_1.Store, { name: 'store' }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreResolver.prototype, "findOne", null);
__decorate([
    (0, graphql_1.Query)(() => [store_entity_1.Store], { name: 'storesByCity' }),
    __param(0, (0, graphql_1.Args)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreResolver.prototype, "findByCity", null);
__decorate([
    (0, graphql_1.Query)(() => [store_entity_1.Store], { name: 'storesByCountry' }),
    __param(0, (0, graphql_1.Args)('country')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreResolver.prototype, "findByCountry", null);
__decorate([
    (0, graphql_1.Mutation)(() => store_entity_1.Store),
    __param(0, (0, graphql_1.Args)('updateStoreDto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_store_dto_1.UpdateStoreDto]),
    __metadata("design:returntype", Promise)
], StoreResolver.prototype, "updateStore", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoreResolver.prototype, "removeStore", null);
exports.StoreResolver = StoreResolver = __decorate([
    (0, graphql_1.Resolver)(() => store_entity_1.Store),
    __metadata("design:paramtypes", [store_service_1.StoreService])
], StoreResolver);
//# sourceMappingURL=store.resolver.js.map