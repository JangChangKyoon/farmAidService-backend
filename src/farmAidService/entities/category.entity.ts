import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Podcast } from './podcasts.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true }) // Unduplicable, nullable
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  coverImg: string;

  @Field((type) => String)
  @Column({ unique: true })
  slug: string;

  @Field((type) => [Podcast], { nullable: true })
  @OneToMany((type) => Podcast, (podcast) => podcast.category)
  podcasts: Podcast[];
}
