import { createStore, applyMiddleware, compose } from 'redux';
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reduxThunkMiddleware from 'redux-thunk';
import * as reducers from './reducers';

export default function configureStore (initialState) {
  const config = {
    key: 'hs-analyzer',
    storage,
    whitelist: ['site']
  };

  return createStore(
    persistCombineReducers(config, reducers.reducers),
    initialState,
    compose(applyMiddleware(reduxThunkMiddleware))
  );
}
