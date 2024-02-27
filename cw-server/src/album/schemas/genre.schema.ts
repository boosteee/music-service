import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Album } from './album.schema';

export type GenreDocument = HydratedDocument<Genre>;

@Schema()
export class Genre {
  @Prop()
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }] })
  albums: Album[];
}

export const GenreSchema = SchemaFactory.createForClass(Genre);
