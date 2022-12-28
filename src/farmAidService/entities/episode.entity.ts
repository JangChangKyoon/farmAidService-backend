import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Podcast } from './podcasts.entity';

@InputType('EpisodeInputType', { isAbstract: true }) // Object보다 위에 있어야 한다.
@ObjectType() // gql output type 검사
@Entity()
export class Episode extends CoreEntity {
  @Field((type) => String, { nullable: true })
  @Column()
  epTitle?: string;

  @Field((type) => String)
  @Column()
  description: string;

  @Field((type) => [Podcast], { nullable: true })
  @ManyToOne((type) => Podcast, (podcast) => podcast.episodes, {
    onDelete: 'CASCADE',
  })
  podcast?: Podcast;
}
