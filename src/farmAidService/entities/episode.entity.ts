import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Podcast } from './podcasts.entity';

@ObjectType() // gql output type 검사
@Entity()
export class Episode extends BaseEntity {
  @Field((type) => Number, { nullable: true })
  @PrimaryGeneratedColumn()
  epId?: number;

  @Field((type) => String, { nullable: true })
  @Column()
  title?: string;

  @Field((type) => Podcast, { nullable: true })
  @ManyToOne((type) => Podcast, (pod) => pod.episodes)
  @JoinColumn()
  podcast?: Podcast;
}
