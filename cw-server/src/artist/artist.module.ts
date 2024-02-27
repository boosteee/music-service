import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { AlbumModule } from 'src/album/album.module';
import { TrackModule } from 'src/track/track.module';
import { Album, AlbumSchema } from 'src/album/schemas/album.schema';
import { FileService } from 'src/file/file.service';

@Module({
  imports: [
    AlbumModule,
    MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
  ],
  controllers: [ArtistController],
  providers: [ArtistService, FileService],
  exports: [ArtistService],
})
export class ArtistModule {}
