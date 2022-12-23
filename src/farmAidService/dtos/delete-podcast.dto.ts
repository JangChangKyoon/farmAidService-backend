import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class DeletePodcastInput {
  @Field((type) => Number)
  podcastId: number;
}

@ObjectType()
export class DeletePodcastOutput extends CoreOutput {}
