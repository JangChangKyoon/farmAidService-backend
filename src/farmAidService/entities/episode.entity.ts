import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Episode {
  @Field((type) => Number)
  podId: number;
  @Field((type) => Number)
  epId: number;
  @Field((type) => String)
  title: string;
}
