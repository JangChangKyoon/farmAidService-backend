import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Podcast } from './podcasts.entity';

@ObjectType() // gql output type 검사
@InputType('EpisodeInputType', { isAbstract: true })
@Entity()
export class Episode extends CoreEntity {
  @Field((type) => String, { nullable: true })
  @Column()
  title?: string;

  @Field((type) => [Podcast], { nullable: true })
  @OneToMany((type) => Podcast, (podcast) => podcast.episodes)
  podcasts?: Podcast[];
}
