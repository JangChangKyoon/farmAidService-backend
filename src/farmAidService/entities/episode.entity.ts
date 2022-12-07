import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType() // gql output type 검사
export class Episode {
  @Field((type) => Number)
  podId: number;

  @Field((type) => Number)
  epId: number;

  @Field((type) => String)
  title: string;
}
