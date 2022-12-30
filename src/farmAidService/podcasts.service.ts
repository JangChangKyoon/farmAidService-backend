import { Injectable, NotFoundException } from '@nestjs/common';
import { Podcast } from './entities/podcasts.entity';
import {
  CreateEpisodeInput,
  CreateEpisodeOutput,
} from './dtos/create-episode.dto';
// import { CreatePodcastInputDto } from './dtos/create-podcast.dto';
import { EditPodcastInput, EditPodcastOutput } from './dtos/edit-podcast.dto';
import { Episode } from './entities/episode.entity';
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
import { EditEpisodeInput, EditEpisodeOutput } from './dtos/edit-episode.dto';
import {
  DeleteEpisodeInput,
  DeleteEpisodeOutput,
} from './dtos/delete-episode.dto';
import { CategoryRepository } from './repository/category.repository';
import { Category } from './entities/category.entity';
import { PodcastsInput, PodcastsOutput } from './dtos/podcasts.dto';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
    private readonly categories: CategoryRepository,
  ) {}

  async createPodcast(
    host: User,
    { title, categoryName, rating }: CreatePodcastInput,
  ): Promise<CreatePodCastOutput> {
    try {
      const newPodcast = this.podcasts.create({ title, rating });
      newPodcast.host = host;

      const category = await this.categories.getOrCreate(categoryName);
      newPodcast.category = category;
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
    { title, categoryName, rating, podcastId }: EditPodcastInput,
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
      let category: Category = null;
      if (categoryName) {
        category = await this.categories.getOrCreate(categoryName);
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
      // console.log('podcast');
      // console.log(podcast);
      // console.log('host');
      // console.log(host);
      // console.log('podcastId');
      // console.log(podcastId);
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

  async editEpisode(
    host: User,
    editEposodeInput: EditEpisodeInput,
  ): Promise<EditEpisodeOutput> {
    try {
      const episode = await this.episodes.findOne({
        where: { id: editEposodeInput.id },
        relations: { podcast: true },
      });

      if (!episode) {
        return {
          ok: false,
          error: 'Could not found eposode',
        };
      }

      if (episode.podcast.hostId !== host.id) {
        return {
          ok: false,
          error: "You can't do that",
        };
      }

      await this.episodes.save([
        {
          id: editEposodeInput.id,
          ...editEposodeInput,
        },
      ]);

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not edit episode' };
    }
  }

  async deleteEpisode(
    host: User,
    { id }: DeleteEpisodeInput,
  ): Promise<DeleteEpisodeOutput> {
    try {
      const episode = await this.episodes.findOne({
        where: { id: id },
        relations: { podcast: true },
      });

      if (!episode) {
        return {
          ok: false,
          error: 'Episode not found',
        };
      }

      if (episode.podcast.hostId !== host.id) {
        return {
          ok: false,
          error: "You can't do that",
        };
      }

      await this.episodes.delete(id);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Could not delete episode',
      };
    }
  }

  async allPodcasts({ page }: PodcastsInput): Promise<PodcastsOutput> {
    try {
      const [podcasts, totalResults] = await this.podcasts.findAndCount({
        skip: (page - 1) * 25,
        take: 25,
      });
      return {
        ok: true,
        results: podcasts,
        totalPages: Math.ceil(totalResults / 25),
        totalResults,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load podcast',
      };
    }
  }
}
