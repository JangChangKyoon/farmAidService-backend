import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';
import { Podcast } from '../entities/podcasts.entity';

@InputType()
export class GetOneInputDto {
  @Field((types) => Number)
  id: number;
}

@ObjectType()
export class GetOnePodOutputDto {
  @Field((types) => Podcast, { nullable: true })
  podcast?: Podcast;

  @Field((type) => String, { nullable: true })
  error?: string;

  @Field((type) => Boolean)
  ok: boolean;
}

@ObjectType()
export class GetAllOutputDto extends CoreOutput {}

@ObjectType()
export class GetOneEpOutputDto extends CoreOutput {
  @Field((types) => Episode, { nullable: true })
  eposode?: Episode;
}
