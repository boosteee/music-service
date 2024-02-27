import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './schemas/playlist.schema';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { Track } from 'src/track/schemas/track.schema';
import { TrackModule } from 'src/track/track.module';
import { FileService } from 'src/file/file.service';

@Module({
  imports: [
    UserModule,
    TrackModule,
    MongooseModule.forFeature([
      { name: Playlist.name, schema: PlaylistSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Track.name, schema: UserSchema }]),
  ],
  controllers: [PlaylistController],
  providers: [PlaylistService, FileService],
})
export class PlaylistModule {}
