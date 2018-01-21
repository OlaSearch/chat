import types from './../ActionTypes'
import { checkIfAwaitingResponse } from './../utils'
import { utilities, Actions } from '@olasearch/core'

/* Query sanitization */
const { sanitizeText, uuid } = utilities
const CHAT_DELAY = 300
const CHAT_REPLY_DELAY = 600

export function updateBotQueryTerm (term) {
  return {
    type: types.UPDATE_BOT_QUERY_TERM,
    term: sanitizeText(term)
  }
}

export function clearBotQueryTerm () {
  return {
    type: types.CLEAR_BOT_QUERY_TERM
  }
}

export function changePage (page) {
  return {
    type: types.CHANGE_BOT_PAGE,
    page
  }
}

export function addMessage (payload, addCallback) {
  return (dispatch, getState) => {
    var state = getState()
    var { messages, language, perPage, q, page, facet_query } = state.Conversation
    var context = state.Context
    var intent = payload && payload.intent ? { intent: payload.intent } : {}
    var msgId = uuid()
    var in_response_to = messages.length
      ? messages[messages.length - 1]['id']
      : null

    /* Add more params to query */
    const query = {
      q,
      page,
      per_page: perPage,
      facet_query,
      msgId,
      language,
      in_response_to,
      ...intent
    }

    const { projectId, env = 'staging', searchInput } = query
    const api = 'search'
    const timestamp = new Date().getTime() / 1000

    /* Add this to ui */
    if (query.q) {
      dispatch({
        type: types.REQUEST_ADD_MESSAGE,
        message: {
          id: msgId,
          userId: context.userId,
          message: query.q,
          timestamp,
          in_response_to
        }
      })

      addCallback && addCallback(msgId)
    }

    /* Simulate delay - Show typing indicator */
    setTimeout(
      () => dispatch(showTypingIndicator({ msgId })),
      payload && payload.start ? 0 : CHAT_DELAY
    )

    return new Promise((resolve, reject) => {
      /* Simulate delay */
      setTimeout(() => {
        return dispatch({
          types: [
            types.REQUEST_BOT,
            types.REQUEST_BOT_SUCCESS,
            types.REQUEST_BOT_FAILURE
          ],
          query,
          context,
          api,
          payload: {
            ...payload,
            bot: true
          }
        }).then(response => {
          /* Hide typing indicator */
          dispatch(hideTypingIndicator())

          /* Check if more messages should be requested */
          if (checkIfAwaitingResponse(response) && searchInput !== 'voice') {
            /* Remove intent */
            if (payload && 'intent' in payload) {
              delete payload['intent'] /* Remove intent */
              if ('start' in payload) {
                delete payload['start']
              } /* Remove start flag */
            }
            /* Clear previous query */
            dispatch(clearBotQueryTerm())
            /* Ask for more messages */
            dispatch(addMessage(payload))
          }

          /**
           * Log views. When user views a
           * 1. Cards
           * 2. Quick reply
           * 3. Search
           **/
          // To do

          return resolve(response)
        })
      }, CHAT_REPLY_DELAY)
    })
  }
}

/**
 * Load more results
 * Only used on chat interface
 */
export function loadMore (message) {
  return (dispatch, getState) => {
    /**
     * message.search is from Intent engine. If Intent engine is down, fallback to message.message
     * Hacky
     */
    let q
    let facet_query = []
    let searchAdapterOptions = {}
    if (message.search) {
      q = message.search.q
      facet_query = message.search.facet_query || []
      searchAdapterOptions = message.search.searchAdapterOptions
    } else {
      q = message.message
    }

    /* Current page in the message */
    var state = getState()
    var context = state.Context
    var { perPage, page } = state.Conversation

    /* Update page */
    dispatch(changePage(++page))

    let query = {
      q,
      per_page: perPage,
      page,
      facet_query,
      msgId: message.id,
      searchAdapterOptions
    }
    
    /* Execute a search with appendResult: true */
    return dispatch({
      types: [
        types.REQUEST_BOT,
        types.REQUEST_BOT_SUCCESS,
        types.REQUEST_BOT_FAILURE
      ],
      query,
      context,
      api: 'search',
      payload: {
        bot: true,
        routeChange: false,
        appendResult: true,
        msgId: message.id
      }
    })
  }
}

export function showTypingIndicator ({ msgId }) {
  return {
    type: types.SHOW_TYPING_INDICATOR,
    msgId
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

export function logFeedback (feedbackMessage) {
  /* eventMessage => feed */
  return (dispatch, getState) => {
    let { feedbackMessageId, feedbackRating } = getState().Conversation

    dispatch(
      Actions.Logger.log({
        eventType: 'C',
        eventCategory: 'Feedback',
        eventAction: 'click',
        eventMessage: feedbackMessage,
        messageId: feedbackMessageId,
        eventLabel: feedbackRating,
        debounce: false,
        payload: {
          bot: true
        }
      })
    )
  }
}

export function setBotStatus (status) {
  return {
    type: types.SET_BOT_STATUS,
    status
  }
}

export function toggleSearchVisibility (messageId) {
  return {
    type: types.TOGGLE_SEARCH_VISIBILITY,
    messageId
  }
}
