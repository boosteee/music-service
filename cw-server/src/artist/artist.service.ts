import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from './schemas/artist.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Album } from 'src/album/schemas/album.schema';
import { AlbumService } from 'src/album/album.service';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<Artist>,
    @InjectModel(Album.name) private albumModel: Model<Album>,
    private readonly albumService: AlbumService,
    private readonly fileService: FileService,
  ) {}
  async create(dto: CreateArtistDto, picture: any): Promise<Artist> {
    const imagePath = this.fileService.createFile(FileType.IMAGE, picture);
    const artist = await this.artistModel.create({
      ...dto,
      picture: imagePath,
    });
    return artist;
  }
  async getAll(): Promise<Artist[]> {
    const artists = await this.artistModel.find();
    return artists;
  }

  async getArtistWithAlbumsAndTracks(artistId: ObjectId): Promise<Artist> {
    return await this.artistModel
      .findById(artistId)
      .populate({ path: 'albums', populate: { path: 'tracks' } });
  }

  async search(query: string): Promise<Artist[]> {
    const artists = await this.artistModel
      .find({
        name: { $regex: new RegExp(query, 'i') },
      })
      .populate('albums');
    return artists;
  }

  async getById(id: ObjectId): Promise<Artist> {
    const artist = await this.artistModel.findById(id).populate('albums');

    return artist;
  }

  async deleteById(id: ObjectId): Promise<void> {
    const albums = await this.albumModel.find({ artist: id });
    for (const album of albums) {
      await this.albumService.deleteAlbumById(album.id);
    }
    await this.artistModel.findByIdAndDelete(id);
  }
}
