import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Episode } from '../entities/episode.entity';

export class CreatePodcastDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly category: string;
  @IsNumber()
  readonly rating: number;
  @IsOptional()
  readonly episodes: Episode[];
}
