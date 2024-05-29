import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Album } from 'src/album/schemas/album.schema';
import { Artist } from 'src/artist/schemas/artist.schema';
import { Playlist } from 'src/playlist/schemas/playlist.schema';

export type TrackDocument = HydratedDocument<Track>;

@Schema()
export class Track {
  @Prop()
  name: string;

  @Prop()
  duration: number;

  @Prop()
  track: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  album: Album;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }] })
  playlists: Playlist[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }] })
  feat: Artist[];
}

export const TrackSchema = SchemaFactory.createForClass(Track);
