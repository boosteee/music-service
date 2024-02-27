import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';
import { ObjectId } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post()
  @UseInterceptors(FileInterceptor('track'))
  addTrack(@UploadedFile() file, @Body() dto: CreateTrackDto) {
    return this.trackService.addTrack(dto, file);
  }

  @Get('/search')
  search(@Query('query') query: string) {
    console.log(query);
    return this.trackService.search(query);
  }

  @Get(':id')
  getById(@Param('id') id: ObjectId) {
    return this.trackService.getById(id);
  }

  @Get('/artist/:artistId')
  getByArtistId(@Param('artistId') artistId: ObjectId) {
    const tracks = this.trackService.getByArtistId(artistId);
    return tracks;
  }

  @Get('/details/:trackId')
  getTrackDetailes(@Param('trackId') trackId: ObjectId) {
    const track = this.trackService.getTrackDetails(trackId);
    return track;
  }

  @Get('/album/:albumId')
  getByAlbumId(@Param('albumId') albumId: ObjectId) {
    const tracks = this.trackService.getByAlbumId(albumId);
    return tracks;
  }

  @Delete(':id')
  deleteById(@Param('id') id: ObjectId) {
    return this.trackService.deleteById(id);
  }
}
