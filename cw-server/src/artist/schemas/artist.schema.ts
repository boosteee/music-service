import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Album } from 'src/album/schemas/album.schema';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema()
export class Artist {
  @Prop()
  name: string;

  @Prop()
  picture: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }] })
  albums: Album[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  subscribers: User[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
