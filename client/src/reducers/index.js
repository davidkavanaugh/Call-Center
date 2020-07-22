import { combineReducers } from "redux";
import authReducer from "./auth.reducer";
import errorReducer from "./error.reducer";
import alertReducer from './alert.reducer';
import callCenterReducer from './callCenter.reducer';
import clientReducer from './client.reducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  alert: alertReducer,
  callCenter: callCenterReducer,
  client: clientReducer
});