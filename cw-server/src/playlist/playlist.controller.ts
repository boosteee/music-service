import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { ObjectId } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/playlists')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}
  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  getPlaylist(@UploadedFile() file, @Body() dto: CreatePlaylistDto) {
    return this.playlistService.addPlaylist(dto, file);
  }

  @Get()
  getAll() {
    return this.playlistService.getAll();
  }

  @Patch('/details')
  @UseInterceptors(FileInterceptor('picture'))
  async updatePlaylistDetails(
    @UploadedFile() file,
    @Body('playlistId') playlistId: ObjectId,
    @Body('name') name: string,
  ) {
    const updatedPlaylist = await this.playlistService.updatePlaylistDetails(
      playlistId,
      name,
      file,
    );

    return updatedPlaylist;
  }

  @Get('/details/:playlistId')
  getPlaylistDetails(@Param('playlistId') playistId: ObjectId) {
    return this.playlistService.getPlaylistDetails(playistId);
  }
  @Get('/user/:userId')
  getPlaylistsByUser(@Param('userId') userId: ObjectId) {
    return this.playlistService.getPlaylistsByUserId(userId);
  }

  @Get('/email/:email')
  getPlaylistByUserEmail(@Param('email') email: string) {
    return this.playlistService.getPlaylistByUserEmail(email);
  }

  @Delete(':id')
  deleteById(@Param('id') id: ObjectId) {
    return this.playlistService.deleteById(id);
  }

  @Patch(':playlistId/track/:trackId')
  addTrackToPlaylist(
    @Param('trackId') trackId: ObjectId,
    @Param('playlistId') playlistId: ObjectId,
  ) {
    const playlist = this.playlistService.addTrackToPlaylist(
      trackId,
      playlistId,
    );
    return playlist;
  }

  @Delete(':playlistId/track/:trackId')
  deleteTrackFromPlaylist(
    @Param('trackId') trackId: ObjectId,
    @Param('playlistId') playlistId: ObjectId,
  ) {
    const playlist = this.playlistService.deleteTrackFromPlaylist(
      trackId,
      playlistId,
    );
    return playlist;
  }
}
