import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import {
  CreatePodcastInputDto,
  CreatePodCastOutputDto,
} from './dtos/create-podcast.dto';
import { Podcast } from './entities/podcasts.entity';
import { PodcastsService } from './podcasts.service';

@Resolver()
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastsService) {}
  // private : 클래스 외부에서 값을 변경하려고 접근하는 것을 차단.
  // readonly :클래스의 맴버변수 값이 최초 선언된 이후에 수정되는 것을 막아준다.

  @Query((returns) => [Podcast])
  getAllPodcast(): Podcast[] {
    const allPodcast = this.podcastService.getAllPod();
    return allPodcast;
  }

  @Mutation((returns) => CreatePodCastOutputDto)
  async createPod(@Args('input') createPod: CreatePodcastInputDto) {
    console.log(createPod.category);
    console.log(createPod.rating);
    try {
      const { ok, error } = await this.podcastService.createOnePod(createPod);
      return {
        ok,
        error,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
