import {
  Get,
  Post,
  Controller,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { ObjectId } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Post('/genre/:genreName')
  addGenre(@Param('genreName') genreName: string) {
    return this.albumService.addGenre(genreName);
  }

  @Get('/genre')
  getGenres() {
    return this.albumService.getGenres();
  }

  @Post()
  @UseInterceptors(FileInterceptor('picture'))
  addAlbum(@UploadedFile() file, @Body() dto: CreateAlbumDto) {
    return this.albumService.addAlbum(dto, file);
  }

  @Get('/get/:albumId')
  getAlbumById(@Param('albumId') albumId: ObjectId) {
    return this.albumService.getById(albumId);
  }

  @Get('/artist/:artistId')
  getAlbumsByArtistId(@Param('artistId') artistId: ObjectId) {
    const albums = this.albumService.getByArtistId(artistId);
    return albums;
  }

  @Get('/search')
  search(
    @Query('query') query: string,
    @Query('genreQuery') genreQuery: string,
  ) {
    console.log(query);
    return this.albumService.search(query, genreQuery);
  }

  @Get('/genre/:genreId')
  getAlbumsByGenreId(@Param('genreId') genreId: ObjectId) {
    const albums = this.albumService.getByGenreId(genreId);
    return albums;
  }

  @Delete(':albumId')
  deleteAlbumById(@Param('albumId') albumId: ObjectId) {
    return this.albumService.deleteAlbumById(albumId);
  }

  @Get()
  getAll() {
    return this.albumService.getAll();
  }
}
