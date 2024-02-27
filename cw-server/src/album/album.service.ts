import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album } from './schemas/album.schema';
import { Model, ObjectId } from 'mongoose';
import { Genre } from './schemas/genre.schema';
import { CreateGenreDto } from './dto/create-genre.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Artist } from 'src/artist/schemas/artist.schema';
import { Track } from 'src/track/schemas/track.schema';
import { TrackService } from 'src/track/track.service';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>,
    @InjectModel(Genre.name) private genreModel: Model<Genre>,
    @InjectModel(Artist.name) private artistModel: Model<Artist>,
    @InjectModel(Track.name) private trackModel: Model<Track>,
    private readonly trackService: TrackService,
    private readonly fileService: FileService,
  ) {}
  async getAll(): Promise<Album[]> {
    const albums = await this.albumModel
      .find()
      .populate('artist')
      .populate('genre');
    return albums;
  }

  async getById(albumId: ObjectId): Promise<Album> {
    return (
      await this.albumModel
        .findById(albumId)
        .populate('artist')
        .populate('genre')
    ).populate('tracks');
  }

  async addGenre(genreName: string): Promise<Genre> {
    const genre = await this.genreModel.create({ name: genreName });
    return genre;
  }

  async getGenres(): Promise<Genre[]> {
    const genres = await this.genreModel.find().populate('albums');
    return genres;
  }

  async search(albumName?: string, genreId?: string): Promise<Album[]> {
    const query: any = {};

    if (albumName) {
      query.name = { $regex: new RegExp(albumName, 'i') };
    }

    if (genreId) {
      query.genre = genreId;
    }

    const albums = await this.albumModel
      .find(query)
      .populate('genre')
      .populate('artist')
      .exec();
    return albums;
  }

  async addAlbum(dto: CreateAlbumDto, picture: any): Promise<Album> {
    const imagePath = this.fileService.createFile(FileType.IMAGE, picture);
    const artist = await this.artistModel.findById(dto.artistId);
    const genre = await this.genreModel.findById(dto.genreId);
    const album = await this.albumModel.create({
      ...dto,
      artist: dto.artistId,
      genre: dto.genreId,
      picture: imagePath,
    });
    artist.albums.push(album.id);
    genre.albums.push(album.id);
    await Promise.all([album.save(), artist.save(), genre.save()]);
    return album;
  }

  async getByArtistId(artistId: ObjectId): Promise<Album[]> {
    const albums = await this.albumModel.find({ artist: artistId }).exec();
    return albums;
  }

  async getByGenreId(genreId: ObjectId): Promise<Album[]> {
    const albums = await this.albumModel.find({ genre: genreId }).exec();
    return albums;
  }

  async deleteAlbumById(albumId: ObjectId): Promise<void> {
    const tracks = await this.trackModel.find({ album: albumId });
    const artist = await this.artistModel.findOne({ albums: albumId });
    const genre = await this.genreModel.findOne({ albums: albumId });
    for (const track of tracks) {
      await this.trackService.deleteById(track.id);
    }
    artist.albums = artist.albums.filter(
      (artistId) => artistId.toString() !== albumId.toString(),
    );
    await artist.save();
    genre.albums = genre.albums.filter(
      (genreId) => genreId.toString() !== albumId.toString(),
    );
    await genre.save();
    await this.albumModel.findByIdAndDelete(albumId);
  }
}
