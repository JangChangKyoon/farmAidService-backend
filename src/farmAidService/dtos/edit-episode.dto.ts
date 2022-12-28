import { InputType, PartialType, ObjectType, PickType } from '@nestjs/graphql';
import { Episode } from '../entities/episode.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class EditEpisodeInput extends PickType(PartialType(Episode), [
  'id',
  'epTitle',
  'description',
]) {}

@ObjectType()
export class EditEpisodeOutput extends CoreOutput {}
