import { Injectable, NotFoundException } from '@nestjs/common';
import { Podcast } from './entities/podcasts.entity';
import {
  CreateEpisodeInputDto,
  CreateEpisodeOutputDto,
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
    private readonly podcasts: Repository<Podcast>, // @InjectRepository(Episode) // private readonly episodes: Repository<Episode>,
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
}
// getAllPod(): Promise<Podcast[]> {
//   return this.podcasts.find({
//     select: {
//       title: true,
//       category: true,
//       rating: true,
//       id: true,
//     },

//     relations: {
//       episodes: true,
//     },
//   });
// }

// findById(podId: number): Promise<Podcast> {
//   return this.podcasts.findOne({ where: { id: podId } });
// }

// async deleteOnePod(podId: number): Promise<{ ok: boolean; error?: string }> {
//   try {
//     const podcast = await this.podcasts.findOne({ where: { id: podId } });
//     if (podcast) {
//       this.podcasts.delete(podId);
//     }
//     return { ok: true };
//   } catch (e) {
//     return {
//       ok: false,
//       error: 'cant delete',
//     };
//   }
// }

// async updateOnePod(
//   id: number,
//   upData: UpdatePodcastDto,
// ): Promise<CoreOutput> {
//   await this.podcasts.update(id, { ...upData });
//   return { ok: true };
// }

// async createOnePod({
//   title,
//   rating,
//   category,
// }: CreatePodcastInputDto): Promise<{
//   ok: boolean;
//   error?: string;
//   podcast?: Podcast;
// }> {
//   try {
//     // const exist = this.podcasts.findOne({ where: { title } });
//     // if (exist) {
//     //   return { ok: false, error: 'already exist' };
//     // }
//     const podcast = await this.podcasts.save(
//       this.podcasts.create({ title, rating, category }),
//     );
//     return { ok: true, podcast };
//   } catch (e) {
//     return { ok: false, error: `${e}` };
//   }
// }

// //실패
// async createOneEp(
//   podId: number,
//   createEp: CreateEpisodeInputDto,
// ): Promise<CreateEpisodeOutputDto> {
//   const podcast = await this.podcasts.findOne({ where: { id: podId } });
//   const episode = new Episode();
//   // console.log(podcast);
//   // episode.podcast = podcast;
//   episode.podcast = podcast;
//   episode.title = createEp.title;
//   console.log(episode);
//   this.episodes.save(episode);
//   return { ok: true, episode };
// }

// getOneEp(podId: number, epId: number) {
//   return true;
// }

// getAllEp() {
//   return true;
// }

// updateEp(podId: number, epId: number, updateEp: UpdateEpisodeDto) {
//   return true;
// }

// deleteEp(podId: number, epId: number) {
//   return true;
// }

//--------------------------------------------------------------------------
