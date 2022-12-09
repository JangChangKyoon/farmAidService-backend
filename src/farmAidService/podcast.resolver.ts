import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  CreateEpisodeInputDto,
  CreateEpisodeOutputDto,
} from './dtos/create-episode.dto';
import {
  CreatePodcastInputDto,
  CreatePodCastOutputDto,
} from './dtos/create-podcast.dto';
import {
  GetAllOutputDto,
  GetOneInputDto,
  GetOnePodOutputDto,
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
  @Query((returns) => GetOnePodOutputDto)
  async getOnePodcast(@Args('id') id: number) {
    console.log(id);
    // async getOnePodcast(@Args('id', { type: () => Number }) id: number) {
    await this.podcastService.getOnePod(id);
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
  async createEp(
    @Args('id') id: number,
    @Args('input') epDto: CreateEpisodeInputDto,
  ) {
    console.log(epDto);
    console.log(epDto.title);
    console.log(id);
    try {
      const { ok, error } = await this.podcastService.createOneEp(id, epDto);
      return { ok, error };
      console.log(error);
    } catch (error) {
      return { ok: false, error };
    }
  }

  //실패 Maximum call stack size exceeded : 해결 => 서비스에서 로직을 안 찾아오고, resolve의 getAllEp을 가져옸었음
  //부분 성공 : serviced의 Promise를 넣으면 오류가 나와서 일단 뺌
  @Query((returns) => CoreOutput)
  getAllEp(): CoreOutput {
    try {
      const { ok, error } = this.podcastService.getAllEp();
      return { ok, error };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
