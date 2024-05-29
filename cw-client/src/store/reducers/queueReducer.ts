import { QueueAction, QueueActionsTypes, QueueState } from '@/types/queue';

const initialState: QueueState = {
  source: null,
  tracks: null,
};

export const queueReducer = (
  state = initialState,
  action: QueueAction
): QueueState => {
  switch (action.type) {
    case QueueActionsTypes.SET_TRACKS:
      return { ...state, tracks: action.payload };
    case QueueActionsTypes.SET_SOURCE:
      return { ...state, source: action.payload };
    default:
      return state;
  }
};
