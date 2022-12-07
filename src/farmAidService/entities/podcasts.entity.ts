import { Field, ObjectType } from '@nestjs/graphql';
import { Episode } from './episode.entity';

@ObjectType() // gql output type 검사
export class Podcast {
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  title: string;

  @Field((type) => String)
  category: string;

  @Field((type) => Number)
  rating: number;

  @Field((type) => [Episode], { nullable: true })
  episodes?: Episode[];
}
