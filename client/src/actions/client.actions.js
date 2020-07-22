import axios from "axios";
import { FIND_CLIENT, CLEAR_SEARCH, NEW_CLIENT, SAVE_ALERT, GET_CLIENT, UPDATE_CLIENT, ADD_NOTE, SAVE_NOTE } from "./types";

// Find Clients
export const findClient = (client) => dispatch => {
    axios
      .post('/api/clients/', client)
      .then(res =>
        {
          dispatch({
            type: FIND_CLIENT,
            payload: res.data
          })
        })
      .catch((err) => console.log(err))
};

// Get Client
export const getClient = (id) => dispatch => {
  axios
    .post('/api/clients/client/', id)
    .then(res => {
      dispatch({
        type: GET_CLIENT,
        payload: res.data
      })
    })
}

// Clear Search
export const clearSearch = () => dispatch => {
  dispatch({
    type: CLEAR_SEARCH
  })
}

// New Client
export const newClient = (client) => dispatch => {
  axios
    .post('/api/clients/new/', client)
      .then(res => {
        dispatch({
          type: NEW_CLIENT,
          payload: res.data
        })
      })
      .catch((err) => console.log(err))
};

// Save Alert
export const saveAlert = (update) => dispatch => {
  axios
    .post('/api/clients/alert/', update)
      .then(res => {
        dispatch({
          type: SAVE_ALERT,
          payload: res.data
        })
      })
}

// Update Client
export const updateClient = (update) => dispatch => {
  axios
    .post('/api/clients/update/', update) 
      .then(res => {
        dispatch({
          type: UPDATE_CLIENT,
          payload: res.data
        })
      })
}

// Add Note
export const addNote = (data, id) => dispatch => {
  axios
    .post('/api/clients/add-note/' + id, data)
      .then(res => {
        dispatch({
          type: ADD_NOTE,
          payload: res.data
        })
      })
}

// Save Note
export const saveNote = (data) => dispatch => {
  axios
    .post('/api/clients/save-note/', data)
      .then(res => {
        dispatch({
          type: SAVE_NOTE,
          payload: res.data
        })
      })
}