import { CreateEpisodeDto } from './create-episode.dto';
import { PartialType } from '@nestjs/mapped-types';
import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class UpdateEpisodeDto extends PartialType(CreateEpisodeDto) {}
