import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Episode } from './episode.entity';

@ObjectType() // gql output type 검사
@Entity()
export class Podcast extends BaseEntity {
  @Field((type) => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field((type) => String)
  @Column()
  title: string;

  @Field((type) => String)
  @Column()
  category: string;

  @Field((type) => Number)
  @Column()
  rating: number;

  @Field((type) => [Episode], { nullable: 'itemsAndList' })
  @OneToMany(() => Episode, (ep) => ep.podcast)
  episodes?: Episode[];
}
