import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreatePodcastInput,
  CreatePodCastOutput,
} from './dtos/create-podcast.dto';

import { Podcast } from './entities/podcasts.entity';
import { PodcastsService } from './podcasts.service';

@Resolver((of) => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastsService) {}
  // private : 클래스 외부에서 값을 변경하려고 접근하는 것을 차단.
  // readonly :클래스의 맴버변수 값이 최초 선언된 이후에 수정되는 것을 막아준다.

  @Mutation((returns) => CreatePodCastOutput)
  @Role(['Owner'])
  async createPodcast(
    @AuthUser() authUser: User,
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodCastOutput> {
    return this.podcastService.createPodcast(authUser, createPodcastInput);
  }

  // @Query((returns) => [Podcast])
  // getAllPodcast(): Promise<Podcast[]> {
  //   const allPodcast = this.podcastService.getAllPod();
  //   return allPodcast;
  // }

  // @Query((returns) => Podcast)
  // getOnePod(@Args('id') id: number): Promise<Podcast> {
  //   return this.podcastService.findById(id);
  // }

  // @Mutation((returns) => CreatePodCastOutputDto)
  // async createPod(@Args('input') createPod: CreatePodcastInputDto) {
  //   console.log(createPod.category);
  //   console.log(createPod.rating);
  //   try {
  //     const { ok, error, podcast } = await this.podcastService.createOnePod(
  //       createPod,
  //     );
  //     return {
  //       ok,
  //       error,
  //       podcast,
  //     };
  //   } catch (error) {
  //     return {
  //       ok: false,
  //       error,
  //     };
  //   }
  // }

  // @Mutation((returns) => CoreOutput)
  // updatePod(
  //   @Args('id') id: number,
  //   @Args('input') updatePod: UpdatePodcastDto,
  // ): Promise<CoreOutput> {
  //   return this.podcastService.updateOnePod(id, updatePod);
  // }

  // @Mutation((returns) => CoreOutput)
  // deletePod(@Args('id') id: number) {
  //   this.podcastService.deleteOnePod(id);
  // }

  // @Mutation((returns) => CreateEpisodeOutputDto)
  // async createEp(
  //   @Args('id') id: number,
  //   @Args('input') createEp: CreateEpisodeInputDto,
  // ): Promise<CreateEpisodeOutputDto> {
  //   const { ok, episode } = await this.podcastService.createOneEp(id, createEp);
  //   return { ok, episode };
  // }

  // @Query((returns) => Boolean)
  // getOneEp() {
  //   return true;
  // }

  // @Query((returns) => Boolean)
  // getAllEp() {
  //   return true;
  // }

  // @Mutation((returns) => Boolean)
  // editEp() {
  //   return true;
  // }

  // @Mutation((returns) => Boolean)
  // deleteEp() {
  //   return true;
  // }
}
