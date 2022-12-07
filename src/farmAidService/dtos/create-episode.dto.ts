import { InputType, Field } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType() // gql input type 검사
export class CreateEpisodeDto {
  @Field((type) => String) // gql input type 검사
  @IsString() // api 유효성 검사
  readonly title: string;
}
