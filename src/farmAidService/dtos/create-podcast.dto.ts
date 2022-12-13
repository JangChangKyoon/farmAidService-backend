import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Episode } from '../entities/episode.entity';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcasts.entity';

@InputType() // gql input type 검사
export class CreatePodcastInputDto {
  @Field((type) => String)
  @IsString()
  readonly title: string;

  @Field((type) => String)
  @IsString()
  readonly category: string;

  @Field((type) => Number)
  @IsNumber()
  readonly rating: number;

  // @IsOptional()
  // @Field((type) => [Episode], { nullable: true })
  // readonly episodes?: Episode[];
}

@ObjectType() // // gql output type 검사
export class CreatePodCastOutputDto extends CoreOutput {
  @Field((type) => Podcast, { nullable: true })
  readonly podcast?: Podcast;
}
