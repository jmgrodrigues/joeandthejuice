import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Resolver(() => Store)
export class StoreResolver {
  constructor(private readonly storeService: StoreService) {}

  @Mutation(() => Store)
  async createStore(@Args('createStoreDto') createStoreDto: CreateStoreDto): Promise<Store> {
    return await this.storeService.create(createStoreDto);
  }

  @Query(() => [Store], { name: 'stores' })
  async findAll(): Promise<Store[]> {
    return await this.storeService.findAll();
  }

  @Query(() => Store, { name: 'store' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Store> {
    return await this.storeService.findOne(id);
  }

  @Query(() => [Store], { name: 'storesByCity' })
  async findByCity(@Args('city') city: string): Promise<Store[]> {
    return await this.storeService.findByCity(city);
  }

  @Query(() => [Store], { name: 'storesByCountry' })
  async findByCountry(@Args('country') country: string): Promise<Store[]> {
    return await this.storeService.findByCountry(country);
  }

  @Mutation(() => Store)
  async updateStore(@Args('updateStoreDto') updateStoreDto: UpdateStoreDto): Promise<Store> {
    return await this.storeService.update(updateStoreDto.id, updateStoreDto);
  }

  @Mutation(() => Boolean)
  async removeStore(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return await this.storeService.remove(id);
  }
} 