import { Query, Resolver } from '@nestjs/graphql';
import { Podcast } from './entities/podcasts.entity';

@Resolver()
export class PodcastResolver {
  @Query((returns) => Podcast)
  myPodcast(): Boolean {
    return true;
  }
}
