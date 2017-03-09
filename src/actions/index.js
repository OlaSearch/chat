import types from './../ActionTypes'
import { checkIfAwaitingResponse } from './../utils'
import { ActionTypes, utilities } from 'olasearch'

const CHAT_DELAY = 200
const CHAT_REPLY_DELAY = 500

export function addMessage (payload) {
  return (dispatch, getState) => {
    var state = getState()
    var query = state.QueryState
    var context = state.Context
    var vui = payload ? payload.vui : false
    var immediate = payload ? payload.immediate : false
    var intent = payload ? payload.intent : null

    if (!vui && query.q) {
      dispatch({
        type: types.REQUEST_ADD_MESSAGE,
        message: {
          id: utilities.uuid(),
          userId: context.userId,
          message: query.q,
          timestamp: state.Timestamp.timestamp
        }
      })
    }

    if (intent) {
      query = {
        ...query,
        intent
      }
    }

    /* Simulate delay - Show typing indicator */
    setTimeout(() => dispatch(showTypingIndicator()), immediate ? 0 : CHAT_DELAY)

    return new Promise((resolve, reject) => {
      /* Simulate delay */
      setTimeout(() => {
        return dispatch({
          types: [
            ActionTypes.REQUEST_SEARCH,
            ActionTypes.REQUEST_SEARCH_SUCCESS,
            ActionTypes.REQUEST_SEARCH_FAILURE
          ],
          query,
          context,
          api: 'search',
          payload
        }).then((response) => {

          /* Hide typing indicator */
          dispatch(hideTypingIndicator())

          /* Check if more messages should be requested */
          if (checkIfAwaitingResponse(response) && !vui) {
            delete payload['intent']
            dispatch(addMessage(payload))
          }

          return resolve(response)

        })
      }, immediate ? 0 : CHAT_DELAY + CHAT_REPLY_DELAY)
    })

  }
}

export function showTypingIndicator () {
  return {
    type: types.SHOW_TYPING_INDICATOR
  }
}

export function hideTypingIndicator () {
  return {
    type: types.HIDE_TYPING_INDICATOR
  }
}

export function clearMessages () {
  return {
    type: types.CLEAR_MESSAGES
  }
}