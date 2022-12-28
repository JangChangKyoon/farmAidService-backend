import { PodcastsService } from './podcasts.service';
import { Module } from '@nestjs/common';
import { PodcastController } from './podcatsts.controller';
import { EpisodeResolver, PodcastResolver } from './podcast.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Podcast } from './entities/podcasts.entity';
import { Episode } from './entities/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Podcast, Episode])],
  controllers: [PodcastController],
  providers: [PodcastsService, PodcastResolver, EpisodeResolver],
})
export class PodcastsModule {}
