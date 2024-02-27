import { ITrack } from './track';
import { IUser } from './user';

export interface IPlaylist {
  _id: string;
  name: string;
  picture: string;
  user: IUser;
  tracks: ITrack[];
}
