import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

@InputType()
export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @Field(() => ID)
  @IsUUID()
  id: string;
} 