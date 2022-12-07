import { Injectable, NotFoundException } from '@nestjs/common';
import { timeStamp } from 'console';
import { Podcast } from './entities/podcasts.entity';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
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

  getAll(): Podcast[] {
    return this.podcasts;
  }

  getOne(id: number): Podcast {
    const podcast = this.podcasts.find((podcast) => podcast.id === +id);
    if (!podcast) {
      throw new NotFoundException(`Not found ${id}`);
    }
    return podcast;
  }

  deleteOne(id: number) {
    this.getOne(id);
    this.podcasts = this.podcasts.filter((podcast) => podcast.id !== +id);
    // After filer, need to save in memory
  }

  create(podData: CreatePodcastDto) {
    this.podcasts.push({
      id: this.podcasts.length + 1,
      ...podData,
    });
  }

  update(id: number, upData: UpdatePodcastDto) {
    const podcast = this.getOne(id); // check exist
    this.deleteOne(id); // filter but update
    this.podcasts.push({
      ...podcast,
      ...upData,
    });
    // ...podcast : {id, eposode}
    // ...updateData : {title, category, rating}
  }

  getEpAll(): Episode[] {
    let eps = [];
    this.podcasts.forEach((pod) => pod.episodes.forEach((ep) => eps.push(ep)));
    if (eps === undefined) {
      throw new NotFoundException('nothing');
    }
    console.log(eps);
    return eps;
  }

  getEpOne(id: number, epId: number): Episode {
    const ep = this.podcasts
      .find((podcast) => podcast.id === id)
      .episodes.find((ep) => ep.epId === epId);
    if (!ep) {
      throw new NotFoundException(`Not found ${epId}`);
    }
    return ep;
  }

  createEp(id: number, epDto: CreateEpisodeDto) {
    const podcast = this.getOne(id);
    podcast.episodes.push({
      epId: podcast.episodes.length + 1,
      ...epDto,
      podId: podcast.id,
    });
  }

  deleteEp(id: number, epId: number) {
    const podcast = this.getOne(id);
    this.getEpOne(id, epId);
    podcast.episodes = podcast.episodes.filter((ep) => ep.epId !== epId);
  }

  updateEp(id: number, epId: number, upEp: UpdateEpisodeDto) {
    const podcast = this.getOne(id);
    const ep = this.getEpOne(id, epId);
    this.deleteEp(id, epId);
    podcast.episodes.push({
      ...ep,
      ...upEp,
    });
  }
}
