import { PartialType } from '@nestjs/mapped-types';
import { CreatePodcastInputDto } from './create-podcast.dto';
import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class UpdatePodcastDto extends PartialType(CreatePodcastInputDto) {}
