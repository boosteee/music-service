import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './schemas/album.schema';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { Artist, ArtistSchema } from 'src/artist/schemas/artist.schema';
import { ArtistModule } from 'src/artist/artist.module';
import { Playlist, PlaylistSchema } from 'src/playlist/schemas/playlist.schema';
import { Track, TrackSchema } from 'src/track/schemas/track.schema';
import { TrackModule } from 'src/track/track.module';
import { FileService } from 'src/file/file.service';

@Module({
  imports: [
    TrackModule,
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
  ],
  controllers: [AlbumController],
  providers: [AlbumService, FileService],
  exports: [AlbumService],
})
export class AlbumModule {}
