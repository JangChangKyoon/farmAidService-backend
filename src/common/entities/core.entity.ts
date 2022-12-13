import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => String)
  id: number;

  @CreateDateColumn()
  @Field((type) => String)
  createAt: Date;

  @UpdateDateColumn()
  @Field((type) => String)
  updateAt: Date;
}
