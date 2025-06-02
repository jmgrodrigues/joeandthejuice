import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsNumber, Length, Min, Max } from 'class-validator';

@InputType()
export class CreateStoreDto {
  @Field()
  @IsString()
  @Length(1, 100)
  name: string;

  @Field()
  @IsString()
  @Length(1, 255)
  address: string;

  @Field()
  @IsString()
  @Length(1, 100)
  city: string;

  @Field()
  @IsString()
  @Length(1, 50)
  country: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  @Length(1, 100)
  email?: string;

  @Field()
  @IsString()
  @Length(1, 100)
  manager: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyRevenue?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  performanceScore?: number;
} 