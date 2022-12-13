import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Episode } from '../entities/episode.entity';
import { Podcast } from '../entities/podcasts.entity';

@InputType() // gql input type 검사
export class CreateEpisodeInputDto {
  @Field((type) => String) // gql input type 검사
  @IsString() // api 유효성 검사
  readonly title: string;

  // @Field((type) => Number) // gql input type 검사
  // readonly podId: number;

  // @Field((type) => Number) // gql input type 검사
  // readonly podId: number;
}

@ObjectType()
export class CreateEpisodeOutputDto extends CoreOutput {
  @Field((type) => Episode, { nullable: true })
  readonly episode?: Episode;
}
