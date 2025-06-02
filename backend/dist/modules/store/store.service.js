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
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const store_entity_1 = require("./entities/store.entity");
let StoreService = class StoreService {
    constructor(storeRepository) {
        this.storeRepository = storeRepository;
    }
    async create(createStoreDto) {
        const store = this.storeRepository.create(createStoreDto);
        return await this.storeRepository.save(store);
    }
    async findAll() {
        return await this.storeRepository.find({
            relations: ['employees'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const store = await this.storeRepository.findOne({
            where: { id },
            relations: ['employees'],
        });
        if (!store) {
            throw new common_1.NotFoundException(`Store with ID ${id} not found`);
        }
        return store;
    }
    async update(id, updateStoreDto) {
        const store = await this.findOne(id);
        Object.assign(store, updateStoreDto);
        return await this.storeRepository.save(store);
    }
    async remove(id) {
        const store = await this.findOne(id);
        await this.storeRepository.remove(store);
        return true;
    }
    async findByCity(city) {
        return await this.storeRepository.find({
            where: { city },
            relations: ['employees'],
        });
    }
    async findByCountry(country) {
        return await this.storeRepository.find({
            where: { country },
            relations: ['employees'],
        });
    }
    async updateEmployeeCount(storeId) {
        var _a;
        const store = await this.findOne(storeId);
        const employeeCount = ((_a = store.employees) === null || _a === void 0 ? void 0 : _a.length) || 0;
        await this.storeRepository.update(storeId, { employeeCount });
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(store_entity_1.Store)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], StoreService);
//# sourceMappingURL=store.service.js.map