import { Injectable, NotFoundException } from '@nestjs/common';
import { Podcast } from './entities/podcasts.entity';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
// import { CreatePodcastInputDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { EditPodcastInput, EditPodcastOutput } from './dtos/edit-podcast.dto';
import { Episode } from './entities/episode.entity';
import { GetAllOutputDto, GetOnePodOutputDto } from './dtos/podcast.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import {
  CreatePodcastInput,
  CreatePodCastOutput,
} from './dtos/create-podcast.dto';
import {
  DeletePodcastInput,
  DeletePodcastOutput,
} from './dtos/delete-podcast.dto';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
  ) {}

  async createPodcast(
    host: User,
    { title, category, rating }: CreatePodcastInput,
  ): Promise<CreatePodCastOutput> {
    try {
      const newPodcast = this.podcasts.create({ title, category, rating });
      newPodcast.host = host;
      await this.podcasts.save(newPodcast);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not create podcast',
      };
    }
  }

  async editPodcast(
    host: User,
    { title, category, rating, podcastId }: EditPodcastInput,
  ): Promise<EditPodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne({
        where: { id: podcastId },
      });
      if (!podcast) {
        return {
          ok: false,
          error: 'Podcast not found',
        };
      }
      if (host.id !== podcast.hostId) {
        return {
          ok: false,
          error: "You can't edit a podcast that you don't host",
        };
      }
      if (title) {
        podcast.title = title;
      }
      if (rating) {
        podcast.rating = rating;
      }
      if (category) {
        // console.log(category);
        podcast.category = category;
      }

      await this.podcasts.save(podcast);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not edit Podcast',
      };
    }
  }

  async deletePodcastInput(
    host: User,
    { podcastId }: DeletePodcastInput,
  ): Promise<DeletePodcastOutput> {
    try {
      const podcast = await this.podcasts.findOne({ where: { id: podcastId } });

      if (!podcast) {
        return {
          ok: false,
          error: 'Podcast not found',
        };
      }
      console.log('podcast');
      console.log(podcast);
      console.log('host');
      console.log(host);
      console.log('podcastId');
      console.log(podcastId);
      if (host.id !== podcast.hostId) {
        return {
          ok: false,
          error: "You can't delete a podcast that you don't host",
        };
      }
      await this.podcasts.delete(podcastId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not delete podcast',
      };
    }
  }

  async createEpisode(
    host: User,
    createEpisodeInput: CreateEpisodeInput,
  ): Promise<CreateEpisodeOutput> {
    try {
      const podcast = await this.podcasts.findOne({
        where: { id: createEpisodeInput.podcastId },
      });

      if (!podcast) {
        return { ok: false, error: 'Podcast not found' };
      }

      if (host.id !== podcast.hostId) {
        return {
          ok: false,
          error: "You can't do that",
        };
      }

      await this.episodes.save(
        this.episodes.create({ ...createEpisodeInput, podcast }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not create episode',
      };
    }
  }
}
