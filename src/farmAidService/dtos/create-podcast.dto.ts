import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Episode } from '../entities/episode.entity';
import {
  InputType,
  Field,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcasts.entity';

@InputType() // gql input type 검사
export class CreatePodcastInput extends PickType(Podcast, ['title', 'rating']) {
  @Field((type) => String)
  categoryName: string;
}

@ObjectType() // // gql output type 검사
export class CreatePodCastOutput extends CoreOutput {}
