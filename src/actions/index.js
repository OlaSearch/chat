import types from './../ActionTypes'
import { checkIfAwaitingResponse } from './../utils'
import { ActionTypes, utilities, Actions } from 'olasearch'

const CHAT_DELAY = 300
const CHAT_REPLY_DELAY = 600

export function addMessage (payload) {
  return (dispatch, getState) => {
    var state = getState()
    var query = state.QueryState
    var { projectId, env } = query
    if (!env) env = 'staging'
    var { messages, language } = state.Conversation
    var context = state.Context
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
    setTimeout(() => dispatch(showTypingIndicator()), payload && payload.start ? 0 : CHAT_DELAY)

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
            if (payload && 'intent' in payload) {
              delete payload['intent'] /* Remove intent */
              if ('start' in payload) delete payload['start'] /* Remove start flag */
            }
            /* Clear previous query */
            dispatch(Actions.Search.clearQueryTerm())
            /* Ask for more messages */
            dispatch(addMessage(payload))
          }

          return resolve(response)

        })
      }, CHAT_REPLY_DELAY)
    })

  }
}

export function loadMore (message) {
  return (dispatch, getState) => {
    var currentPage = getState().QueryState.page
    dispatch(Actions.Search.changePage(++currentPage))
    dispatch(Actions.Search.executeSearch({
      routeChange: false,
      appendResult: true,
      extraParams: {
        /* Additional params */
        q: message.search.q,
        facet_query: message.search.facet_query,
        msgId: message.id,
        searchAdapterOptions: message.search.searchAdapterOptions
      }
    }))
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

export function pollWhenIdle () {
  return (dispatch, getState) => {
    let { shouldPoll } = getState().Conversation
    if (!shouldRetry) return
    dispatch(addMessage({ intent: 'idle' }))
  }
}


export function activateFeedback () {
  return {
    type: types.FEEDBACK_SET_ACTIVE
  }
}

export function disabledFeedback () {
  return {
    type: types.FEEDBACK_SET_DISABLE
  }
}

export function setFeedbackMessage (messageId) {
  return {
    type: types.SET_FEEDBACK_MESSAGE_ID,
    messageId
  }
}

export function setFeedbackRating (rating) {
  return {
    type: types.SET_FEEDBACK_RATING,
    rating
  }
}

export function logFeedback (feedbackMessage) { /* eventMessage => feed */
  return (dispatch, getState) => {
    let { feedbackMessageId, feedbackRating } = getState().Conversation

    dispatch(Actions.Logger.log({
      eventType: 'C',
      eventCategory: 'Feedback',
      eventAction: 'click',
      eventMessage: feedbackMessage,
      messageId: feedbackMessageId,
      eventLabel: feedbackRating,
      debounce: false
    }))

  }
}

export function setBotStatus (status) {
  return {
    type: types.SET_BOT_STATUS,
    status
  }
}