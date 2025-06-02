import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
export declare class StoreResolver {
    private readonly storeService;
    constructor(storeService: StoreService);
    createStore(createStoreDto: CreateStoreDto): Promise<Store>;
    findAll(): Promise<Store[]>;
    findOne(id: string): Promise<Store>;
    findByCity(city: string): Promise<Store[]>;
    findByCountry(country: string): Promise<Store[]>;
    updateStore(updateStoreDto: UpdateStoreDto): Promise<Store>;
    removeStore(id: string): Promise<boolean>;
}
