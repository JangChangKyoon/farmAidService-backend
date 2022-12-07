import { Injectable, NotFoundException } from '@nestjs/common';
import { Podcast } from './entities/podcasts.entity';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastInputDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';

@Injectable()
export class PodcastsService {
  private podcasts: Podcast[] = [
    {
      id: 1,
      title: 'podcast title Test1',
      category: 'category Test1',
      rating: 1,
      episodes: [
        {
          podId: 1,
          epId: 1,
          title: 'episode test1',
        },
        {
          podId: 1,
          epId: 2,
          title: 'episode test2',
        },
      ],
    },
    {
      id: 2,
      title: 'podcast title Test2',
      category: 'category Test2',
      rating: 2,
      episodes: [
        {
          podId: 1,
          epId: 1,
          title: 'episode test1',
        },
        {
          podId: 1,
          epId: 2,
          title: 'episode test2',
        },
      ],
    },
  ];

  getAllPod(): Podcast[] {
    return this.podcasts;
  }

  getOnePod(id: number): Podcast {
    const podcast = this.podcasts.find((podcast) => podcast.id === +id);
    if (!podcast) {
      throw new NotFoundException(`Not found ${id}`);
    }
    return podcast;
  }

  deleteOnePod(id: number) {
    this.getOnePod(id);
    this.podcasts = this.podcasts.filter((podcast) => podcast.id !== +id);
    // After filer, need to save in memory
  }

  async createOnePod(
    podData: CreatePodcastInputDto,
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      await this.podcasts.push({
        id: this.podcasts.length + 1,
        ...podData,
      });
      console.log('[---------service_createAcount start--------]');
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'error' };
    }
  }

  updateOnePod(id: number, upData: UpdatePodcastDto) {
    const podcast = this.getOnePod(id); // check exist
    this.deleteOnePod(id); // filter but update
    this.podcasts.push({
      ...podcast,
      ...upData,
    });
    // ...podcast : {id, eposode}
    // ...updateData : {title, category, rating}
  }

  getAllEp(): Episode[] {
    let eps = [];
    this.podcasts.forEach((pod) => pod.episodes.forEach((ep) => eps.push(ep)));
    if (eps === undefined) {
      throw new NotFoundException('nothing');
    }
    console.log(eps);
    return eps;
  }

  getOneEp(id: number, epId: number): Episode {
    const ep = this.podcasts
      .find((podcast) => podcast.id === id)
      .episodes.find((ep) => ep.epId === epId);
    if (!ep) {
      throw new NotFoundException(`Not found ${epId}`);
    }
    return ep;
  }

  createOneEp(id: number, epDto: CreateEpisodeDto) {
    const podcast = this.getOnePod(id);
    podcast.episodes.push({
      epId: podcast.episodes.length + 1,
      ...epDto,
      podId: podcast.id,
    });
  }

  deleteOneEp(id: number, epId: number) {
    const podcast = this.getOnePod(id);
    this.getOneEp(id, epId);
    podcast.episodes = podcast.episodes.filter((ep) => ep.epId !== epId);
  }

  updateOneEp(id: number, epId: number, upEp: UpdateEpisodeDto) {
    const podcast = this.getOnePod(id);
    const ep = this.getOneEp(id, epId);
    this.deleteOneEp(id, epId);
    podcast.episodes.push({
      ...ep,
      ...upEp,
    });
  }
}
