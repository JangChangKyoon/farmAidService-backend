import { PodcastsService } from './podcasts.service';
import { Module } from '@nestjs/common';
import { PodcastController } from './podcatsts.controller';

@Module({
  controllers: [PodcastController],
  providers: [PodcastsService],
})
export class PodcastsModule {}
