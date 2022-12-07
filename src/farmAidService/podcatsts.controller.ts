import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Podcast } from './entities/podcasts.entity';
import { CreateEpisodeDto } from './dtos/create-episode.dto';
import { CreatePodcastInputDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-episode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { PodcastsService } from './podcasts.service';

@Controller('podcasts')
export class PodcastController {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Get()
  getAll(): Podcast[] {
    return this.podcastsService.getAllPod();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.podcastsService.getOnePod(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.podcastsService.deleteOne(id);
  }

  @Post()
  create(@Body() podData: CreatePodcastInputDto) {
    return this.podcastsService.createPod(podData);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() upData: UpdatePodcastDto) {
    return this.podcastsService.updatePod(id, upData);
  }

  @Post(':id/episodes')
  createEp(@Param('id') id: number, @Body() epData: CreateEpisodeDto) {
    return this.podcastsService.createEp(id, epData);
  }
  @Get(':id/episodes/:epId')
  getEpOne(@Param('id') id: number, @Param('epId') epId: number) {
    return this.podcastsService.getOneEp(id, epId);
  }

  @Get('episodes/all')
  getEpAll() {
    return this.podcastsService.getAllEp();
  }

  @Delete(':id/episodes/:epId')
  deleteEp(@Param('id') id: number, @Param('epId') epId: number) {
    return this.podcastsService.deleteEp(id, epId);
  }
  @Patch(':id/episodes/:epId')
  updateEp(
    @Param('id') id: number,
    @Param('epId') epId: number,
    @Body() upEp: UpdateEpisodeDto,
  ) {
    return this.podcastsService.updateEp(id, epId, upEp);
  }
}
