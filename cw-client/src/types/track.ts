import { IAlbum } from './album';
import { IArtist } from './artist';
import { IPlaylist } from './playlist';

export interface ITrack {
  _id: string;
  name: string;
  album: IAlbum;
  playlists: IPlaylist[];
  duration: number;
  track: string;
  feat: IArtist[];
}

export interface IArtistTrack extends ITrack {
  picture: string;
}

export interface IPlaylistTrack extends IArtistTrack {
  artist: IArtist;
}
