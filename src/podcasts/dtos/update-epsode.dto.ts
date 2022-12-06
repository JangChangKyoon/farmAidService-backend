import { CreateEpisodeDto } from './create-epsode.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateEpisodeDto extends PartialType(CreateEpisodeDto) {}
