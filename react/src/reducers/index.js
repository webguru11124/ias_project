import { combineReducers, createStore } from 'redux';
import auth from './modules/auth';
import experiment from './modules/experiment';
import files from './modules/files';
import image from './modules/image';
import vessel from './modules/vessel';
import measure from './modules/measure';
import tiling from './modules/tiling';
import display from './modules/displayReducer';
import metaData from './modules/metaData';

const reducer = combineReducers({
  auth: auth,
  experiment: experiment,
  files: files,
  image: image,
  vessel: vessel,
  tiling: tiling,
  measure: measure,
  display: display,
  metaData: metaData,
});

const store = createStore(reducer);
export default store;
