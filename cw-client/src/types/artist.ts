import { IAlbum } from './album';

export interface IArtist {
  _id: string;
  name: string;
  albums: IAlbum[];
  picture: string;
}
