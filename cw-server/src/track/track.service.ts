import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { Track } from './schemas/track.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { Album } from 'src/album/schemas/album.schema';
import { Playlist } from 'src/playlist/schemas/playlist.schema';
import { FileService, FileType } from 'src/file/file.service';
import * as path from 'path';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { join } from 'path';
import { createReadStream, statSync } from 'fs';

@Injectable()
export class TrackService {
  private readonly CHUNK_SIZE: number = 524288;
  constructor(
    @InjectModel(Track.name) private trackModel: Model<Track>,
    @InjectModel(Album.name) private albumModel: Model<Album>,
    @InjectModel(Playlist.name) private playlistModel: Model<Playlist>,
    private readonly fileService: FileService,
  ) {}

  async addTrack(dto: CreateTrackDto, audio: any): Promise<Track> {
    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const filePath = path.resolve(__dirname, '..', '..', 'static', audioPath);
    const durationInSeconds = await getAudioDurationInSeconds(filePath);
    const album = await this.albumModel.findById(dto.albumId);
    const track = await this.trackModel.create({
      ...dto,
      album: dto.albumId,
      track: audioPath,
      duration: Math.ceil(durationInSeconds),
      feat: dto.feat,
    });

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
          path: 'artist',
          model: 'Artist',
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
      .populate({
        path: 'feat',
        model: 'Artist',
      })
      .exec();

    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  streamAudioFile(track: string, range: string | undefined, res: Response) {
    const filePath = join(process.cwd(), 'static', 'audio', track);
    const stat = statSync(filePath);
    const fileSize = stat.size;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : start + this.CHUNK_SIZE - 1;

      end = Math.min(end, start + this.CHUNK_SIZE - 1, fileSize - 1);

      if (start >= fileSize) {
        res
          .status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
          .send(
            'Requested range not satisfiable\n' + start + ' >= ' + fileSize,
          );
        return;
      }

      const chunksize = end - start + 1;
      const file = createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'audio/mpeg',
      };

      res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(HttpStatus.OK, head);
      createReadStream(filePath).pipe(res);
    }
  }
}
