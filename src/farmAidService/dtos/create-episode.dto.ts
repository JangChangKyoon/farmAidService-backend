import {
  InputType,
  Field,
  ObjectType,
  PickType,
  Int,
  PartialType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';

@InputType() // gql input type 검사
export class CreateEpisodeInput extends PickType(Episode, [
  'epTitle',
  'description',
]) {
  @Field((type) => Int)
  podcastId: number;
}

@ObjectType()
export class CreateEpisodeOutput extends CoreOutput {}
