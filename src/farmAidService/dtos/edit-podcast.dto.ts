// import { CreatePodcastInputDto } from './create-podcast.dto';
import { InputType, Field, ObjectType, PartialType } from '@nestjs/graphql';
import { Podcast } from '../entities/podcasts.entity';
import { CreatePodcastInput } from './create-podcast.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class EditPodcastInput extends PartialType(CreatePodcastInput) {
  @Field((type) => Number)
  podcastId: number;
}

@ObjectType()
export class EditPodcastOutput extends CoreOutput {}
