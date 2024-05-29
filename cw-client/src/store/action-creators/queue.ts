import { QueueAction, QueueActionsTypes } from '@/types/queue';
import { IArtistTrack, IPlaylistTrack, ITrack } from '@/types/track';

export const setQueue = (
  payload: ITrack[] | IPlaylistTrack[] | IArtistTrack[]
): QueueAction => {
  return { type: QueueActionsTypes.SET_TRACKS, payload };
};

export const setSource = (payload: string): QueueAction => {
  return { type: QueueActionsTypes.SET_SOURCE, payload };
};
