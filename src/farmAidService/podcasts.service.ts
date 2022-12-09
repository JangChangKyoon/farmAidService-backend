import { Injectable, NotFoundException } from '@nestjs/common';
import { Podcast } from './entities/podcasts.entity';
import { CreateEpisodeInputDto } from './dtos/create-episode.dto';
import { CreatePodcastInputDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { GetAllOutputDto, GetOnePodOutputDto } from './dtos/podcast.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';

@Injectable()
export class PodcastsService {
  private podcasts: Podcast[] = [
    // {
    //   id: 1,
    //   title: 'podcast title Test1',
    //   category: 'category Test1',
    //   rating: 1,
    //   episodes: [
    //     {
    //       podId: 1,
    //       epId: 1,
    //       title: 'episode test1',
    //     },
    //     {
    //       podId: 1,
    //       epId: 2,
    //       title: 'episode test2',
    //     },
    //   ],
    // },
    // {
    //   id: 2,
    //   title: 'podcast title Test2',
    //   category: 'category Test2',
    //   rating: 2,
    //   episodes: [
    //     {
    //       podId: 1,
    //       epId: 1,
    //       title: 'episode test1',
    //     },
    //     {
    //       podId: 1,
    //       epId: 2,
    //       title: 'episode test2',
    //     },
    //   ],
    // },
  ];

  getAllPod(): Podcast[] {
    return this.podcasts;
  }

  async getOnePod(
    id: number,
  ): Promise<{ ok: boolean; error?: string; podcast?: Podcast }> {
    const podcast = await this.podcasts.find((podcast) => podcast.id === +id);
    console.log(podcast); // console.log : printed { id: 1, title: 'dsdd', category: 'dddd', rating: 1 }
    if (!podcast) {
      return {
        ok: false,
        error: `${id} not exist`,
      };
    }
    console.log('debug1'); // console.log : printed 'debug1'
    return {
      ok: true,
      podcast,
      error: 'no error',
    };
  }

  checkOnePod(id: number): Podcast {
    const podcast = this.podcasts.find((podcast) => podcast.id === +id);
    console.log(podcast); // { id: 1, title: 'dsdd', category: 'dddd', rating: 1 }
    if (!podcast) {
      throw new NotFoundException('NotFoundException : podcast');
    }
    console.log('debug1');
    return;
    podcast;
  }

  deleteOnePod(id: number) {
    this.checkOnePod(id);
    this.podcasts = this.podcasts.filter((podcast) => podcast.id !== +id);
    // After filer, need to save in memory
  }

  async updateOnePod(id: number, upData: UpdatePodcastDto) {
    const podcast = await this.checkOnePod(id); // check exist
    await this.deleteOnePod(id); // filter but update
    await this.podcasts.push({
      ...podcast,
      ...upData,
    });
    // ...podcast : {id, eposode}
    // ...updateData : {title, category, rating}
  }

  getAllEp(): CoreOutput {
    try {
      let eps = [];
      this.podcasts.forEach((pod) =>
        pod.episodes.forEach((ep) => eps.push(ep)),
      );
      if (eps === undefined) {
        throw new NotFoundException('nothing');
      }
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: `${e}`,
      };
    }
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
    console.log('debug1');
    try {
      const podcast = await this.checkOnePod(id);
      console.log('debug2');
      console.log(podcast);
      await podcast.episodes.push({
        epId: podcast.episodes.length + 1,
        ...epDto,
        podId: podcast.id,
      });
      console.log(podcast); // 콘솔에 출력되지 않음
      console.log('debug3'); // 콘솔에 출력되지 않음
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  deleteOneEp(id: number, epId: number) {
    const podcast = this.checkOnePod(id);
    this.getOneEp(id, epId);
    podcast.episodes = podcast.episodes.filter((ep) => ep.epId !== epId);
  }

  updateOneEp(id: number, epId: number, upEp: UpdateEpisodeDto) {
    const podcast = this.checkOnePod(id);
    const ep = this.getOneEp(id, epId);
    this.deleteOneEp(id, epId);
    podcast.episodes.push({
      ...ep,
      ...upEp,
    });
  }
}
