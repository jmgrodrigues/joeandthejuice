import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Store } from '../../store/entities/store.entity';

@Entity('employees')
@ObjectType()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ length: 100 })
  @Field()
  firstName: string;

  @Column({ length: 100 })
  @Field()
  lastName: string;

  @Column({ length: 150, unique: true })
  @Field()
  email: string;

  @Column({ length: 20, nullable: true })
  @Field({ nullable: true })
  phone?: string;

  @Column({ length: 50 })
  @Field()
  position: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @Field(() => Float)
  salary: number;

  @Column({ type: 'date' })
  @Field()
  hireDate: Date;

  @Column({ type: 'int', default: 0 })
  @Field(() => Int)
  hoursWorked: number;

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
  @Column('uuid')
  @Field(() => ID)
  storeId: string;

  @ManyToOne(() => Store, store => store.employees)
  @JoinColumn({ name: 'storeId' })
  @Field(() => Store)
  store: Store;
} 