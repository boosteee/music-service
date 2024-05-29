import { IAlbum } from './album';
import { IUser } from './user';

export interface IArtist {
  _id: string;
  name: string;
  albums: IAlbum[];
  picture: string;
  subscribers: IUser[];
}
