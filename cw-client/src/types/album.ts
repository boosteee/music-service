import { IArtist } from './artist';
import { IGenre } from './genre';
import { ITrack } from './track';

export interface IAlbum {
  _id: string;
  name: string;
  year: number;
  artist: IArtist;
  genre: IGenre;
  tracks: ITrack[];
  picture: string;
}
