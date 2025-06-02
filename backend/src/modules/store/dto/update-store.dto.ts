import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateStoreDto } from './create-store.dto';

@InputType()
export class UpdateStoreDto extends PartialType(CreateStoreDto) {
  @Field(() => ID)
  @IsUUID()
  id: string;
} 