import { Query, Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
import {
  CreatePodcastInput,
  CreatePodCastOutput,
} from './dtos/create-podcast.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dtos/delete-podcast.dto';
import { EditEpisodeInput, EditEpisodeOutput } from './dtos/edit-episode.dto';
import { EditPodcastInput, EditPodcastOutput } from './dtos/edit-podcast.dto';
import { PodcastsInput, PodcastsOutput } from './dtos/podcasts.dto';
import { Episode } from './entities/episode.entity';

import { Podcast } from './entities/podcasts.entity';
import { PodcastsService } from './podcasts.service';

@Resolver((of) => Podcast)
export class PodcastResolver {
  constructor(private readonly podcastService: PodcastsService) {}
  // private : 클래스 외부에서 값을 변경하려고 접근하는 것을 차단.
  // readonly :클래스의 맴버변수 값이 최초 선언된 이후에 수정되는 것을 막아준다.

  @Mutation((returns) => CreatePodCastOutput)
  @Role(['Host'])
  async createPodcast(
    @AuthUser() authUser: User,
    @Args('input') createPodcastInput: CreatePodcastInput,
  ): Promise<CreatePodCastOutput> {
    // console.log('hi');
    return this.podcastService.createPodcast(authUser, createPodcastInput);
  }

  @Mutation((returns) => EditPodcastOutput)
  @Role(['Host'])
  editPodcast(
    @AuthUser() host: User,
    @Args('input') editPodcastInput: EditPodcastInput,
  ): Promise<EditPodcastOutput> {
    return this.podcastService.editPodcast(host, editPodcastInput);
  }

  @Mutation((returns) => DeletePodcastOutput)
  @Role(['Host'])
  deletePodcast(
    @AuthUser() host: User,
    @Args('input') deletePodcastInput: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    return this.podcastService.deletePodcastInput(host, deletePodcastInput);
  }

  @Query((returns) => PodcastsOutput)
  podcasts(
    @Args('input') podcastInput: PodcastsInput,
  ): Promise<PodcastsOutput> {
    return this.podcastService.allPodcasts(podcastInput);
  }
}

@Resolver((of) => Episode)
export class EpisodeResolver {
  constructor(private readonly podcastService: PodcastsService) {}

  @Mutation((returns) => CreateEpisodeOutput)
  @Role(['Host'])
  async createEpisode(
    @AuthUser() host: User,
    @Args('input') createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    return this.podcastService.createEpisode(host, createEpisodeInput);
  }

  @Mutation((returns) => EditPodcastOutput)
  @Role(['Host'])
  async editEpisode(
    @AuthUser() host: User,
    @Args('input') editEposodeInput: EditEpisodeInput,
  ): Promise<EditEpisodeOutput> {
    return this.podcastService.editEpisode(host, editEposodeInput);
  }

  @Mutation((returns) => DeleteEpisodeOutput)
  @Role(['Host'])
  async deleteEpisode(
    @AuthUser() host: User,
    @Args('input') { id }: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    return this.podcastService.deleteEpisode(host, { id });
  }
}
