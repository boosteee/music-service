import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Track } from 'src/track/schemas/track.schema';
import * as mongoose from 'mongoose';
import { Playlist } from 'src/playlist/schemas/playlist.schema';
import { Artist } from 'src/artist/schemas/artist.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: Roles;

  @Prop()
  isBlocked: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }] })
  playlists: Playlist[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }] })
  subscriptions: Artist[];
}

export enum Roles {
  Admin,
  User,
}
export const UserSchema = SchemaFactory.createForClass(User);
