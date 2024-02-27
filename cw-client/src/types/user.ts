import { IPlaylist } from './playlist';

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: number;
  isBlocked: boolean;
  playlists: IPlaylist[];
}

export interface IUserLoginData
  extends Omit<
    IUser,
    '_id' | 'role' | 'playlists' | 'username' | 'isBlocked'
  > {}

export interface IUserRegisterData
  extends Omit<IUser, '_id' | 'role' | 'playlists'> {}

export interface IUserAuthData
  extends Omit<IUser, '_id' | 'role' | 'password'> {}

export interface IUserAuth {
  user: IUserAuthData;
  token: string;
}
