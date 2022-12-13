import { Injectable, NotFoundException } from '@nestjs/common';
import { Podcast } from './entities/podcasts.entity';
import {
  CreateEpisodeInputDto,
  CreateEpisodeOutputDto,
} from './dtos/create-episode.dto';
import { CreatePodcastInputDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { GetAllOutputDto, GetOnePodOutputDto } from './dtos/podcast.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';

@Injectable()
export class PodcastsService {
  constructor(
    @InjectRepository(Podcast)
    private readonly podcasts: Repository<Podcast>,
    @InjectRepository(Episode)
    private readonly episodes: Repository<Episode>,
  ) {}

  getAllPod(): Promise<Podcast[]> {
    return this.podcasts.find({
      select: {
        title: true,
        category: true,
        rating: true,
        id: true,
      },

      relations: {
        episodes: true,
      },
    });
  }

  findById(podId: number): Promise<Podcast> {
    return this.podcasts.findOne({ where: { id: podId } });
  }

  async deleteOnePod(podId: number): Promise<{ ok: boolean; error?: string }> {
    try {
      const podcast = await this.podcasts.findOne({ where: { id: podId } });
      if (podcast) {
        this.podcasts.delete(podId);
      }
      return { ok: true };
    } catch (e) {
      return {
        ok: false,
        error: 'cant delete',
      };
    }
  }

  async updateOnePod(
    id: number,
    upData: UpdatePodcastDto,
  ): Promise<CoreOutput> {
    await this.podcasts.update(id, { ...upData });
    return { ok: true };
  }

  async createOnePod({
    title,
    rating,
    category,
  }: CreatePodcastInputDto): Promise<{
    ok: boolean;
    error?: string;
    podcast?: Podcast;
  }> {
    try {
      // const exist = this.podcasts.findOne({ where: { title } });
      // if (exist) {
      //   return { ok: false, error: 'already exist' };
      // }
      const podcast = await this.podcasts.save(
        this.podcasts.create({ title, rating, category }),
      );
      return { ok: true, podcast };
    } catch (e) {
      return { ok: false, error: `${e}` };
    }
  }

  //실패
  async createOneEp(
    podId: number,
    createEp: CreateEpisodeInputDto,
  ): Promise<CreateEpisodeOutputDto> {
    const podcast = await this.podcasts.findOne({ where: { id: podId } });
    const episode = new Episode();
    // console.log(podcast);
    // episode.podcast = podcast;
    episode.podcast = podcast;
    episode.title = createEp.title;
    console.log(episode);
    this.episodes.save(episode);
    return { ok: true, episode };
  }

  getOneEp(podId: number, epId: number) {
    return true;
  }

  getAllEp() {
    return true;
  }

  updateEp(podId: number, epId: number, updateEp: UpdateEpisodeDto) {
    return true;
  }

  deleteEp(podId: number, epId: number) {
    return true;
  }

  //--------------------------------------------------------------------------
}
