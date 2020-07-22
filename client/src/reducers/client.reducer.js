import {
    FIND_CLIENT, CLEAR_SEARCH, NEW_CLIENT, SAVE_ALERT, GET_CLIENT, UPDATE_CLIENT, ADD_NOTE, SAVE_NOTE
  } from '../actions/types';
  
  const initialState = {
    clients: [],
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case FIND_CLIENT:
        let clients = action.payload;
        for (let [key] of Object.entries(clients)) {
          if (clients[key].dob) {
            clients[key].dob = clients[key].dob.substring(0,10)
          }
        }
        return {
          ...state,
          clients: clients
        };
      case CLEAR_SEARCH:
        return {
          ...state,
          clients: []
        }
      case NEW_CLIENT:
        return {
          ...state,
          clients: action.payload
        };
      case SAVE_ALERT: 
        return {
          ...state,
          clients: action.payload
        }
      case GET_CLIENT:
        return {
          ...state,
          clients: action.payload
        }
      case UPDATE_CLIENT:
        return {
          ...state,
          clients: action.payload
        }
      case ADD_NOTE:
        return {
          ...state,
          clients: action.payload
        }
      case SAVE_NOTE:
        return {
          ...state,
          clients: action.payload
        }
      default: 
        return state;
    }
  }
