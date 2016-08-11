import { applyMiddleware, createStore, compose } from 'redux';
import createLogger from 'redux-logger';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers/index';
import DevTools from './components/DevTools';

const logger = createLogger();

const enhancers = [
  applyMiddleware(ReduxThunk, logger),
  DevTools.instrument()
];

const Store = createStore(rootReducer, {}, compose(...enhancers));

export default Store;