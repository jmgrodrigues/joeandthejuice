import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Employee } from '../../employee/entities/employee.entity';

@Entity('stores')
@ObjectType()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ length: 100 })
  @Field()
  name: string;

  @Column({ length: 255 })
  @Field()
  address: string;

  @Column({ length: 100 })
  @Field()
  city: string;

  @Column({ length: 50 })
  @Field()
  country: string;

  @Column({ length: 20, nullable: true })
  @Field({ nullable: true })
  phone?: string;

  @Column({ length: 100, nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Column({ length: 100 })
  @Field()
  manager: string;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  employeeCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @Field(() => Float)
  monthlyRevenue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  @Field(() => Float)
  performanceScore: number;

  @Column({ default: true })
  @Field()
  isActive: boolean;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Employee, employee => employee.store)
  @Field(() => [Employee], { nullable: true })
  employees?: Employee[];
} 