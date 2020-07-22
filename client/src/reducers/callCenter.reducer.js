import {
    UPDATE_CALLCENTER, CALL_CENTER_STATE, NEW_CALL_SCRIPT, UPDATE_CALL_SCRIPT, GET_CALLCENTER
  } from '../actions/types';
  
  const initialState = {
    callCenter: {
      callScripts: []
    },
    error: {}
  };
  
  export default (state = initialState, action) => {
  
    switch (action.type) {
      case UPDATE_CALLCENTER:
        return {
          callCenter: null
        };
      case CALL_CENTER_STATE:
        return {
          ...state,
          callCenter: action.payload
        };
      case NEW_CALL_SCRIPT:
        return {
          ...state, 
          callCenter: action.payload
        };
      case UPDATE_CALL_SCRIPT:
        return {
          ...state,
          callCenter: action.payload
        };
      case GET_CALLCENTER: 
        return {
          ...state,
          callCenter: action.payload
        }
      default:
        return state;
    }
  }