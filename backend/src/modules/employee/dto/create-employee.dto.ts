import { InputType, Field, ID, Float } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsNumber, IsUUID, IsDateString, Length, Min, Max } from 'class-validator';

@InputType()
export class CreateEmployeeDto {
  @Field()
  @IsString()
  @Length(1, 100)
  firstName: string;

  @Field()
  @IsString()
  @Length(1, 100)
  lastName: string;

  @Field()
  @IsEmail()
  @Length(1, 150)
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string;

  @Field()
  @IsString()
  @Length(1, 50)
  position: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  salary: number;

  @Field()
  @IsDateString()
  hireDate: string;

  @Field(() => ID)
  @IsUUID()
  storeId: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  performanceScore?: number;
} 