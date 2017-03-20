import types from './../ActionTypes'
import { checkIfAwaitingResponse } from './../utils'
import { ActionTypes, utilities, Actions } from 'olasearch'

const CHAT_DELAY = 200
const CHAT_REPLY_DELAY = 500

export function addMessage (payload) {
  return (dispatch, getState) => {
    var state = getState()
    var query = state.QueryState
    var { messages, language } = state.Conversation
    var context = state.Context
    var immediate = payload ? payload.immediate : false
    var intent = payload && payload.intent ? { intent: payload.intent } : {}
    var msgId = utilities.uuid()
    var in_response_to = messages.length ? messages[messages.length - 1]['id'] : null
    var { searchInput } = query

    /* Add this to ui */
    if (query.q) {
      dispatch({
        type: types.REQUEST_ADD_MESSAGE,
        message: {
          id: msgId,
          userId: context.userId,
          message: query.q,
          timestamp: state.Timestamp.timestamp,
          in_response_to
        }
      })
    }

    /* Add more params to query */
    query = {
      ...query,
      msgId,
      language,
      in_response_to,
      ...intent
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
          if (checkIfAwaitingResponse(response) && searchInput !== 'voice') {
            /* Remove intent */
            if (payload && 'intent' in payload) delete payload['intent']
            /* Clear previous query */
            dispatch(Actions.Search.clearQueryTerm())
            /* Ask for more messages */
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

export function changeLanguage (language) {
  return {
    type: types.CHANGE_LANGUAGE,
    language
  }
}
