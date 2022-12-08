import { Injectable, NotFoundException } from '@nestjs/common';
import { Podcast } from './entities/podcasts.entity';
import { CreateEpisodeInputDto } from './dtos/create-episode.dto';
import { CreatePodcastInputDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { SearchOnePodOutputDto } from './dtos/podcast.dto';

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

  getOnePod(id: number): SearchOnePodOutputDto {
    const podcast = this.podcasts.find((podcast) => podcast.id === +id);
    if (!podcast) {
      return {
        ok: false,
        error: `${id} not exist`,
      };
    }
    return {
      ok: true,
      podcast,
    };
  }

  deleteOnePod(id: number) {
    this.getOnePod(id);
    this.podcasts = this.podcasts.filter((podcast) => podcast.id !== +id);
    // After filer, need to save in memory
  }

  updateOnePod(id: number, upData: UpdatePodcastDto) {
    const podcast = this.getOnePod(id).podcast; // check exist
    this.deleteOnePod(id); // filter but update
    this.podcasts.push({
      ...podcast,
      ...upData,
    });
    // ...podcast : {id, eposode}
    // ...updateData : {title, category, rating}
  }

  async getAllEp(): Promise<Episode[]> {
    let eps = [];
    await this.podcasts.forEach((pod) =>
      pod.episodes.forEach((ep) => eps.push(ep)),
    );
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
  async createOneEp(
    id: number,
    epDto: CreateEpisodeInputDto,
  ): Promise<{ ok: boolean; error?: string }> {
    try {
      const podcast = await this.getOnePod(id).podcast;
      await podcast.episodes.push({
        epId: podcast.episodes.length + 1,
        ...epDto,
        podId: podcast.id,
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'error' };
    }
  }

  deleteOneEp(id: number, epId: number) {
    const podcast = this.getOnePod(id).podcast;
    this.getOneEp(id, epId);
    podcast.episodes = podcast.episodes.filter((ep) => ep.epId !== epId);
  }

  updateOneEp(id: number, epId: number, upEp: UpdateEpisodeDto) {
    const podcast = this.getOnePod(id).podcast;
    const ep = this.getOneEp(id, epId);
    this.deleteOneEp(id, epId);
    podcast.episodes.push({
      ...ep,
      ...upEp,
    });
  }
}
