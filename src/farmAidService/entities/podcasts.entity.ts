import { Field, ObjectType } from '@nestjs/graphql';
import { Episode } from './episode.entity';

@ObjectType()
export class Podcast {
  @Field((type) => Number)
  id: number;
  @Field((type) => String)
  title: string;
  @Field((type) => Number)
  category: string;
  @Field((type) => Number)
  rating: number;
  @Field((type) => [Episode], { nullable: true })
  episodes?: Episode[];
}