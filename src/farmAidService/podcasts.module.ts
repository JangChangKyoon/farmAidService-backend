import { PodcastsService } from './podcasts.service';
import { Module } from '@nestjs/common';
import { PodcastController } from './podcatsts.controller';
import { PodcastResolver } from './podcast.resolver';

@Module({
  controllers: [PodcastController],
  providers: [PodcastsService, PodcastResolver],
})
export class PodcastsModule {}
