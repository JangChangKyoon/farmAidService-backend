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
import { CreateEpisodeDto } from './dtos/create-epsode.dto';
import { CreatePodcastDto } from './dtos/create-podcast.dto';
import { UpdateEpisodeDto } from './dtos/update-epsode.dto';
import { UpdatePodcastDto } from './dtos/update-podcast.dto';
import { PodcastsService } from './podcasts.service';

@Controller('podcasts')
export class PodcastController {
  constructor(private readonly podcastsService: PodcastsService) {}

  @Get()
  getAll(): Podcast[] {
    return this.podcastsService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.podcastsService.getOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.podcastsService.deleteOne(id);
  }

  @Post()
  create(@Body() podData: CreatePodcastDto) {
    return this.podcastsService.create(podData);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() upData: UpdatePodcastDto) {
    return this.podcastsService.update(id, upData);
  }

  @Post(':id/episodes')
  createEp(@Param('id') id: number, @Body() epData: CreateEpisodeDto) {
    return this.podcastsService.createEp(id, epData);
  }
  @Get(':id/episodes/:epId')
  getEpOne(@Param('id') id: number, @Param('epId') epId: number) {
    return this.podcastsService.getEpOne(id, epId);
  }

  @Get('episodes/all')
  getEpAll() {
    return this.podcastsService.getEpAll();
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
