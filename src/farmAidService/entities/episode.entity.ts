import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType() // gql output type 검사
export class Episode {
  @Field((type) => Number, { nullable: true })
  podId?: number;

  @Field((type) => Number, { nullable: true })
  epId?: number;

  @Field((type) => String, { nullable: true })
  title?: string;
}
