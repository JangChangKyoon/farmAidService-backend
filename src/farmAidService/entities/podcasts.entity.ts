import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Episode } from './episode.entity';

@InputType('PodcastInputType', { isAbstract: true }) // Object보다 위에 있어야 한다.
@ObjectType() // gql output type 검사
@Entity()
export class Podcast extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  title: string;

  @Field((type) => String)
  @Column()
  category: string;

  @Field((type) => Number)
  @Column()
  rating: number;

  @Field((type) => [Episode], { nullable: 'itemsAndList' })
  @OneToMany((type) => Episode, (episode) => episode.podcast, {
    nullable: true,
  })
  episodes?: Episode[];

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.podcasts)
  host?: User;

  @RelationId((podcast: Podcast) => podcast.host)
  hostId: number;
}
