import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const store = this.storeRepository.create(createStoreDto);
    return await this.storeRepository.save(store);
  }

  async findAll(): Promise<Store[]> {
    return await this.storeRepository.find({
      relations: ['employees'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
      relations: ['employees'],
    });

    if (!store) {
      throw new NotFoundException(`Store with ID ${id} not found`);
    }

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);
    
    Object.assign(store, updateStoreDto);
    return await this.storeRepository.save(store);
  }

  async remove(id: string): Promise<boolean> {
    const store = await this.findOne(id);
    await this.storeRepository.remove(store);
    return true;
  }

  async findByCity(city: string): Promise<Store[]> {
    return await this.storeRepository.find({
      where: { city },
      relations: ['employees'],
    });
  }

  async findByCountry(country: string): Promise<Store[]> {
    return await this.storeRepository.find({
      where: { country },
      relations: ['employees'],
    });
  }

  async updateEmployeeCount(storeId: string): Promise<void> {
    const store = await this.findOne(storeId);
    const employeeCount = store.employees?.length || 0;
    
    await this.storeRepository.update(storeId, { employeeCount });
  }
} 