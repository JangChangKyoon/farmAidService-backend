import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreatePodcastDto {
  @IsString()
  readonly title: string;
  @IsString()
  readonly category: string;
  @IsNumber()
  readonly rating: number;
  @IsOptional()
  readonly epsodes: Episode[];
}
