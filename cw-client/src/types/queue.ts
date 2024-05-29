import { IArtistTrack, IPlaylistTrack, ITrack } from './track';

export interface QueueState {
  source: null | string;
  tracks: null | ITrack[] | IPlaylistTrack[] | IArtistTrack[];
}

export enum QueueActionsTypes {
  SET_SOURCE = 'SET_SOURCE',
  SET_TRACKS = 'SET_TRACKS',
}

interface SetTracksAction {
  type: QueueActionsTypes.SET_TRACKS;
  payload: ITrack[] | IPlaylistTrack[] | IArtistTrack[];
}

interface SetSourceAction {
  type: QueueActionsTypes.SET_SOURCE;
  payload: string;
}

export type QueueAction = SetTracksAction | SetSourceAction;
