import axios from "axios";

import { UPDATE_CALLCENTER, CALL_CENTER_STATE, NEW_CALL_SCRIPT, UPDATE_CALL_SCRIPT, GET_CALLCENTER } from "./types";
import { DialogActions } from "@material-ui/core";

// Get Call Center
export const getCallCenter = (id) => dispatch => {
  axios
    .get('/api/call-centers/call-center/' + id)
    .then( res => 
      dispatch({
        type: GET_CALLCENTER,
        payload: res.data
      }))
    .catch(err => console.log(err))
}

// Update Call Center
export const updateCallCenter = (update, id) => dispatch => {
    axios
      .post('/api/call-centers/edit/' + id, update )
      .then(res => 
        dispatch({
          type: UPDATE_CALLCENTER,
          payload: 'Update Successful!'
      })
      )
      .catch(err => console.log(err))
  }

// Temp Updates
export const callCenterState = (callCenterData) => dispatch => {
    dispatch({
        type: CALL_CENTER_STATE,
        payload: callCenterData
    })
}

// New Call Script
export const newCallScript = (callScript, id) => dispatch => {
  axios
  .post('/api/call-centers/new-call-script/' + id, callScript )
  .then(res => 
    dispatch({
      type: NEW_CALL_SCRIPT,
      payload: callScript
  })
  )
  .catch(err => console.log(err))
}

// Update Call Script
export const updateCallScript = (update) => dispatch => {
  axios
  .post('/api/call-centers/update-call-script/', update)
  .then(res => 
    dispatch({
      type: UPDATE_CALL_SCRIPT,
      payload: update  
    })
  )
  .catch(err => console.log(err))
}