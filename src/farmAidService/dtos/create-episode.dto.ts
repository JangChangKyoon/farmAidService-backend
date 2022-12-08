import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType() // gql input type 검사
export class CreateEpisodeInputDto {
  @Field((type) => String) // gql input type 검사
  @IsString() // api 유효성 검사
  readonly title: string;
}

@ObjectType()
export class CreateEpisodeOutputDto extends CoreOutput {}
