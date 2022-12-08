import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Podcast } from '../entities/podcasts.entity';

@InputType()
export class SearchOnePodInputDto {
  @Field((types) => Number)
  id: number;
}

@ObjectType()
export class SearchOnePodOutputDto extends CoreOutput {
  @Field((types) => Podcast, { nullable: true })
  podcast?: Podcast;
}
