import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Artist } from 'src/artist/schemas/artist.schema';
import { Genre } from './genre.schema';
import { Track } from 'src/track/schemas/track.schema';
import * as mongoose from 'mongoose';

export type AlbumDocument = HydratedDocument<Album>;

@Schema()
export class Album {
  @Prop()
  name: string;

  @Prop()
  year: number;

  @Prop()
  picture: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' })
  artist: Artist;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' })
  genre: Genre;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }] })
  tracks: Track[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
