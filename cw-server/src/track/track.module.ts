import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './schemas/track.schema';
import { Album, AlbumSchema } from 'src/album/schemas/album.schema';
import { Genre, GenreSchema } from 'src/album/schemas/genre.schema';
import { Artist, ArtistSchema } from 'src/artist/schemas/artist.schema';
import { Playlist, PlaylistSchema } from 'src/playlist/schemas/playlist.schema';
import { FileService } from 'src/file/file.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
  ],
  controllers: [TrackController],
  providers: [TrackService, FileService],
  exports: [TrackService],
})
export class TrackModule {}
