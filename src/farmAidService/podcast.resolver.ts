import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import {
  CreateEpisodeInputDto,
  CreateEpisodeOutputDto,
} from './dtos/create-episode.dto';
import {
  CreatePodcastInputDto,
  CreatePodCastOutputDto,
} from './dtos/create-podcast.dto';
import {
  SearchOnePodInputDto,
  SearchOnePodOutputDto,
} from './dtos/podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcasts.entity';
import { PodcastsService } from './podcasts.service';

@Resolver((of) => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastsService) {}
  // private : 클래스 외부에서 값을 변경하려고 접근하는 것을 차단.
  // readonly :클래스의 맴버변수 값이 최초 선언된 이후에 수정되는 것을 막아준다.

  @Query((returns) => [Podcast])
  getAllPodcast(): Podcast[] {
    const allPodcast = this.podcastService.getAllPod();
    return allPodcast;
  }

  //실패...
  @Query((returns) => SearchOnePodOutputDto)
  async getOnePodcast(@Args('input') id: SearchOnePodInputDto) {
    console.log(id.id);
    // async getOnePodcast(@Args('id', { type: () => Number }) id: number) {
    await this.podcastService.getOnePod(id.id);
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

  //실패
  @Mutation((returns) => CreateEpisodeOutputDto)
  async createEp(@Args('input') epDto: CreateEpisodeInputDto) {
    console.log(epDto.title);
    try {
      const { ok, error } = await this.podcastService.createOneEp(1, epDto);
      return { ok, error };
    } catch (error) {
      return { ok: false, error };
    }
  }

  //실패
  @Query((returns) => [Episode])
  getAllEp(): Episode[] {
    return this.getAllEp();
  }
}
