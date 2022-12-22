import { PartialType } from '@nestjs/mapped-types';
// import { CreatePodcastInputDto } from './create-podcast.dto';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcasts.entity';

@InputType()
export class UpdatePodcastDto {
  // @Field((types) => Number, { nullable: true })
  // id?: number;
  // @Field((type?) => String, { nullable: true })
  // readonly title: string;
  // @Field((type) => String, { nullable: true })
  // readonly category?: string;
  // @Field((type) => Number, { nullable: true })
  // readonly rating?: number;
}
