import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { UserModule } from './user/user.module';
import { PlaylistModule } from './playlist/playlist.module';
import { AlbumModule } from './album/album.module';
import { FileModule } from './file/file.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
    }),
    ConfigModule.forRoot(),
    FileModule,
    TrackModule,
    UserModule,
    PlaylistModule,
    AlbumModule,
    ArtistModule,
    MongooseModule.forRoot('YOUR_DB_CONNECTION_LINK'),
    AuthModule,
  ],
})
export class AppModule {}
