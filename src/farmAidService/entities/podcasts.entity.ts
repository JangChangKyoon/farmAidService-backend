import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Episode } from './episode.entity';

@InputType('PodcastInputType', { isAbstract: true })
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
  @ManyToOne((type) => Episode, (episode) => episode.podcasts, {
    nullable: true,
  })
  episodes?: Episode[];

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.podcasts, {
    onDelete: 'CASCADE',
  })
  host: User;
}
