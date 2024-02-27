import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './schemas/track.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { Album } from 'src/album/schemas/album.schema';
import { Artist } from 'src/artist/schemas/artist.schema';
import { Playlist } from 'src/playlist/schemas/playlist.schema';
import { FileService, FileType } from 'src/file/file.service';
import { Role } from 'src/decorators/role.decorator';
import { Roles } from 'src/user/schemas/user.schema';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<Track>,
    @InjectModel(Album.name) private albumModel: Model<Album>,
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
    private readonly fileService: FileService,
  ) {}

  async addTrack(dto: CreateTrackDto, audio: any): Promise<Track> {
    console.log(audio);
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const album = await this.albumModel.findById(dto.albumId);
    const track = await this.trackModel.create({
      ...dto,
      album: dto.albumId,
      track: audioPath,
    });
    console.log(audioPath);
    console.log(track);
    album.tracks.push(track.id);
    await Promise.all([track.save(), album.save()]);
    return track;
  }

  async search(query: string): Promise<Track[]> {
    const tracks = await this.trackModel
      .find({
        name: { $regex: new RegExp(query, 'i') },
      })
      .populate({
        path: 'album',
        populate: {
          path: 'artist', // Предполагается, что у вас есть связь между альбомом и исполнителем с именем "artist"
          model: 'Artist', // Замените 'Artist' на фактическую модель исполнителя
        },
      });

    return tracks;
  }

  async getById(trackId: ObjectId): Promise<Track> {
    const track = await this.trackModel.findById(trackId);
    return track;
  }

  async getByAlbumId(albumId: ObjectId): Promise<Track[]> {
    const tracks = await this.trackModel.find({ album: albumId });
    return tracks;
  }

  async getByArtistId(artistId: ObjectId): Promise<Track[]> {
    const albums = await this.albumModel
      .find({ artist: artistId })
      .populate('tracks');
    const tracks: Track[] = [];
    for (const album of albums) {
      tracks.push(...album.tracks);
    }
    return tracks;
  }

  async deleteById(trackId: ObjectId): Promise<void> {
    const album = await this.albumModel.findOne({ tracks: trackId }).exec();
    const playlists = await this.playlistModel.find({ tracks: trackId }).exec();
    for (const playlist of playlists) {
      playlist.tracks = playlist.tracks.filter(
        (playlistId) => playlistId.toString() !== trackId.toString(),
      );
      await playlist.save();
    }
    album.tracks = album.tracks.filter(
      (albumId) => albumId.toString() !== trackId.toString(),
    );
    await album.save();
    await this.trackModel.findByIdAndDelete(trackId);
  }

  async getTrackDetails(trackId: ObjectId): Promise<Track> {
    const track = await this.trackModel
      .findById(trackId)
      .populate({
        path: 'album',
        model: 'Album',
        populate: {
          path: 'artist',
          model: 'Artist',
        },
      })
      .exec();

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }
}
