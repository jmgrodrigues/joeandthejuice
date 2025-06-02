import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreService } from './store.service';
import { StoreResolver } from './store.resolver';
import { Store } from './entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [StoreResolver, StoreService],
  exports: [StoreService],
})
export class StoreModule {} 