import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Playlist } from './schemas/playlist.schema';
import { Model, ObjectId } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { Track } from 'src/track/schemas/track.schema';
import { FileService, FileType } from 'src/file/file.service';
import { Album } from 'src/album/schemas/album.schema';
import { Artist } from 'src/artist/schemas/artist.schema';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Track.name) private trackModel: Model<Track>,
    private readonly fileService: FileService,
  ) {}

  async addPlaylist(dto: CreatePlaylistDto, picture: any): Promise<Playlist> {
    const imagePath = this.fileService.createFile(FileType.IMAGE, picture);
    const user = await this.userModel.findById(dto.userId);
    const playlist = await this.playlistModel.create({
      ...dto,
      user: dto.userId,
      name: dto.name,
      picture: imagePath,
    });
    user.playlists.push(playlist.id);
    await Promise.all([user.save(), playlist.save()]);
    return playlist;
  }

  async updatePlaylistDetails(
    playlistId: ObjectId,
    name: string,
    picture: any,
  ): Promise<Playlist> {
    console.log(playlistId);
    const playlist = await this.playlistModel.findById(playlistId).exec();
    console.log(await this.playlistModel.find());
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    const imagePath = this.fileService.createFile(FileType.IMAGE, picture);
    playlist.name = name;
    playlist.picture = imagePath;
    const updatedPlaylist = await playlist.save();
    return updatedPlaylist;
  }

  async getAll(): Promise<Playlist[]> {
    const playlists = await this.playlistModel.find();
    return playlists;
  }

  async getPlaylistsByUserId(userId: ObjectId): Promise<Playlist[]> {
    const playlists = await this.playlistModel.find({ user: userId }).exec();
    return playlists;
  }

  async getPlaylistByUserEmail(email: string): Promise<Playlist[]> {
    const user = await this.userModel.findOne({ email: email });
    const playlists = await this.playlistModel.find({ user: user.id }).exec();

    return playlists;
  }

  async deleteById(playlistId: ObjectId): Promise<void> {
    const user = await this.userModel.findOne({ playlists: playlistId }).exec();
    user.playlists = user.playlists.filter(
      (playlist) => playlist.toString() !== playlistId.toString(),
    );
    await user.save();
    const tracks = await this.trackModel.find({ playlists: playlistId }).exec();
    for (const track of tracks) {
      track.playlists = track.playlists.filter(
        (trackId) => trackId.toString() !== playlistId.toString(),
      );
      await track.save();
    }
    await this.playlistModel.findByIdAndDelete(playlistId);
  }

  async addTrackToPlaylist(
    trackId: ObjectId,
    playlistId: ObjectId,
  ): Promise<Playlist> {
    const playlist = await this.playlistModel.findById(playlistId).exec();
    const track = await this.trackModel.findById(trackId);
    playlist.tracks.push(track.id);
    track.playlists.push(playlist.id);
    await Promise.all([playlist.save(), track.save()]);
    return playlist;
  }

  async deleteTrackFromPlaylist(
    trackId: ObjectId,
    playlistId: ObjectId,
  ): Promise<Playlist> {
    const playlist = await this.playlistModel.findById(playlistId).exec();
    const track = await this.trackModel.findById(trackId);
    playlist.tracks = playlist.tracks.filter(
      (playlistId) => playlistId.toString() !== trackId.toString(),
    );
    track.playlists = track.playlists.filter(
      (trackId) => trackId.toString() !== playlistId.toString(),
    );
    await Promise.all([playlist.save(), track.save()]);
    return playlist;
  }

  async getPlaylistDetails(playlistId: ObjectId): Promise<Playlist> {
    const playlist = await this.playlistModel
      .findById(playlistId)
      .populate({
        path: 'tracks',
        model: Track.name,
        populate: {
          path: 'album',
          model: Album.name,
          populate: {
            path: 'artist',
            model: Artist.name,
          },
        },
      })
      .exec();
    return playlist;
  }
}
