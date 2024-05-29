import { combineReducers } from 'redux';
import { legacy_createStore } from 'redux';
import { playerReducer } from './playerReducer';
import { queueReducer } from './queueReducer';

export const rootReducer = combineReducers({
  player: playerReducer,
  queue: queueReducer,
});

declare global {
  interface Window {
    // ⚠️ notice that "Window" is capitalized here
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

export const store = legacy_createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export type RootState = ReturnType<typeof rootReducer>;
