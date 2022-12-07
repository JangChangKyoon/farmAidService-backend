import { CreateEpisodeDto } from './create-episode.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateEpisodeDto extends PartialType(CreateEpisodeDto) {}
