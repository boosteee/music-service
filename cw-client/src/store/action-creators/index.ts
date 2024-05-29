import * as PlayerActionCreators from '../action-creators/player';
import * as QueueActionsCreators from '../action-creators/queue';

export default {
  ...PlayerActionCreators,
  ...QueueActionsCreators,
};
