import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
export declare class StoreService {
    private readonly storeRepository;
    constructor(storeRepository: Repository<Store>);
    create(createStoreDto: CreateStoreDto): Promise<Store>;
    findAll(): Promise<Store[]>;
    findOne(id: string): Promise<Store>;
    update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store>;
    remove(id: string): Promise<boolean>;
    findByCity(city: string): Promise<Store[]>;
    findByCountry(country: string): Promise<Store[]>;
    updateEmployeeCount(storeId: string): Promise<void>;
}
