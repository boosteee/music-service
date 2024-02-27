import { combineReducers, legacy_createStore } from 'redux';
import { playerReducer } from './playerReducer';

export const rootReducer = combineReducers({
  player: playerReducer,
});

export const store = legacy_createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;
