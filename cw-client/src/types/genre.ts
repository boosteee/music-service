import { IAlbum } from './album';

export interface IGenre {
  _id: string;
  name: string;
  albums: IAlbum[];
}

export interface IGenreLabel extends IGenre {
  label: string;
}
