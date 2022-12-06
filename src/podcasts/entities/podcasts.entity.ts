import { Optional } from '@nestjs/common';

export class Podcast {
  id: number;
  title: string;
  category: string;
  rating: number;
  @Optional()
  episodes?: Episode[];
}
