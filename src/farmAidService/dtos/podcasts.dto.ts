import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcasts.entity';
import {
  PaginationInput,
  PaginationOutput,
} from '../../common/dtos/pagination.dto';

@InputType()
export class PodcastsInput extends PaginationInput {}

@ObjectType()
export class PodcastsOutput extends PaginationOutput {
  @Field((type) => [Podcast], { nullable: true })
  results?: Podcast[];
}
