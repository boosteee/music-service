import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist } from './schemas/artist.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Album } from 'src/album/schemas/album.schema';
import { AlbumService } from 'src/album/album.service';
import { FileService, FileType } from 'src/file/file.service';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ArtistService {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<Artist>,
    @InjectModel(Album.name) private albumModel: Model<Album>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly albumService: AlbumService,
    private readonly userService: UserService,
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
    const users = await this.userModel.find({ subscriptions: id });
    for (const album of albums) {
      await this.albumService.deleteAlbumById(album.id);
    }
    for (const user of users) {
      await this.unsubscribeUser(id, user.email);
    }
    await this.artistModel.findByIdAndDelete(id);
  }

  async subscribeUser(id: ObjectId, email: string): Promise<void> {
    const artist = await this.artistModel.findById(id);
    const user = await this.userModel.findOne({ email: email });
    artist.subscribers.push(user);
    user.subscriptions.push(artist);
    await Promise.all([artist.save(), user.save()]);
  }

  async unsubscribeUser(id: ObjectId, email: string): Promise<void> {
    const artist = await this.artistModel.findById(id);
    const user = await this.userModel.findOne({ email: email });
    artist.subscribers = artist.subscribers.filter(
      (subscriber) => subscriber.toString() !== user._id.toString(),
    );
    await artist.save();
    user.subscriptions = user.subscriptions.filter(
      (subscription) => subscription.toString() !== artist._id.toString(),
    );
    await user.save();
  }

  async getSubscriptionsByUserEmail(email: string): Promise<Artist[]> {
    const user = await this.userModel.findOne({ email: email });
    return this.artistModel.find({ subscribers: user._id });
  }
}
