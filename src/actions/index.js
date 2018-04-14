import types from './../ActionTypes'
import { checkIfAwaitingResponse, createMessageSequence } from './../utils'
import { utilities, Actions, Settings } from '@olasearch/core'
import invariant from 'invariant'
import omit from 'ramda/src/omit'

/* Query sanitization */
const { sanitizeText, uuid } = utilities
const { SLOT_DATE } = Settings
const CHAT_DELAY = 300
const CHAT_REPLY_DELAY = 600
const RESULTS_FOR_MC = 12

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

export function addMessage (payload) {
  return (dispatch, getState) => {
    var state = getState()
    var {
      messages,
      language,
      perPage,
      q,
      page,
      facet_query
    } = state.Conversation
    /* Get filters from Search Query */
    var { filters } = state.QueryState
    var context = state.Context
    var intent = {}
    var label = null
    var msgId = uuid()
    var in_response_to = messages.length
      ? messages[messages.length - 1]['id']
      : null
    const showUserMessage = !(payload && payload.hidden)
    const stopSubmit = payload && payload.disableSubmit
    /**
     * Parameters that needs to added to the query
     */
    const payloadParams = omit(['value', 'label', 'intent', 'query'], payload)

    /**
     * Check if payload has `label` => THis will be displayed in bot
     */
    if (payload && payload.label) {
      label = payload.label
    }

    /**
     * Check if payload has `value`
     */
    if (payload && payload.value) {
      q = payload.value
    }

    /**
     * Check if payload has `intent`
     */
    if (payload && payload.intent) {
      intent = { intent: payload.intent }
    }

    /* Add more params to query */
    const query = {
      q,
      label,
      page,
      per_page: RESULTS_FOR_MC /* Always fetch 12 results from search engine. MC expects top 10 results */,
      facet_query,
      filters,
      msgId,
      language,
      in_response_to,
      ...intent,
      ...payloadParams
    }

    const { projectId, env = 'staging', searchInput } = query
    const api = 'search'
    const timestamp = new Date().getTime() / 1000

    /* User message */
    const message = {
      id: msgId,
      userId: context.userId,
      message: query.q,
      sequence: {
        message: [
          {
            type: 'text',
            content: query.q
          }
        ]
      },
      label,
      timestamp,
      in_response_to
    }

    /**
     * Check if original query is filled
     * Only use if you want to dynamically replace the query
     */
    if (payload && typeof payload.query !== 'undefined') {
      query.q = payload.query
    }

    /* Add this to ui */
    if (query.q) {
      /**
       * Add message only if hidden is undefined or false
       */
      if (showUserMessage) {
        dispatch({
          type: types.REQUEST_ADD_MESSAGE,
          message
        })
      }
    }

    if (stopSubmit) return

    /* Simulate delay - Show typing indicator */
    setTimeout(
      () => dispatch(showTypingIndicator(msgId)),
      (payload && payload.start) || !showUserMessage ? 0 : CHAT_DELAY
    )

    return new Promise((resolve, reject) => {
      const outerResolve = resolve
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
          beforeSuccessCallback: response => {
            return {
              ...response,
              sequence: createMessageSequence(response),
              ...(response.results
                ? {
                  results: response.results.slice(0, perPage)
                }
                : {})
            }
          },
          payload: {
            ...payload,
            message,
            context,
            originalQuery: query.q,
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
              /**
               * Remove value and label from payload
               */
              if ('value' in payload) {
                delete payload['value']
              }
              if ('label' in payload) {
                delete payload['label']
              }
              if ('hidden' in payload) {
                delete payload['hidden']
              }
            }
            /* Clear previous query */
            dispatch(clearBotQueryTerm())
            /* Ask for more messages */
            dispatch(addMessage(payload))

            return outerResolve(response)
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
      }, showUserMessage ? CHAT_REPLY_DELAY : 0)
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
    /*
      Always take the intent from original message
      If the current intent is OLA.Disambiguation, then on loadmore, disambiguation is triggered
     */
    const { intent } = message
    if (message.search) {
      q = message.search.q
      const slots = message.search.slots || []
      facet_query = slots.filter(({ facet_query }) => facet_query).map(item => {
        return {
          ...item,
          type: item.type && item.type === SLOT_DATE ? 'daterange' : 'string',
          selected: item.value
        }
      })
      searchAdapterOptions = message.search.searchAdapterOptions
    } else {
      q = message.message || message.originalQuery
    }

    /* Current page in the message */
    var state = getState()
    var context = state.Context
    var { page = 1 } = message
    var { perPage } = state.Conversation
    /* Get filters from Search Query */
    var { filters } = state.QueryState

    /* Update page */
    page = page + 1

    let query = {
      q,
      per_page: perPage,
      page,
      facet_query,
      intent,
      filters,
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
        msgId: message.id,
        q,
        page
      }
    })
  }
}

export function showTypingIndicator (msgId) {
  invariant(msgId, 'msgId is required')
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

/**
 * setBotStatus: Show or hide a bot
 * @param {Boolean} status
 */
export function setBotStatus (status) {
  invariant(typeof status !== 'undefined', 'Status is required (Boolean)')
  return {
    type: types.SET_BOT_STATUS,
    status
  }
}

/**
 * ShowBot: Show
 */
export function showBot () {
  return {
    type: types.SET_BOT_STATUS,
    status: true
  }
}

/**
 * Hidebot
 */
export function hideBot () {
  return {
    type: types.SET_BOT_STATUS,
    status: false
  }
}

/**
 * [toggleSearchVisibility Show or hide search results inside a message]
 * @param  {String} messageId
 */
export function toggleSearchVisibility (messageId) {
  invariant(messageId, 'Message ID is required (Boolean)')
  return {
    type: types.TOGGLE_SEARCH_VISIBILITY,
    messageId
  }
}

export function ignoreLocation () {
  return {
    type: types.IGNORE_LOCATION
  }
}

export function showInvite () {
  return {
    type: types.SHOW_INVITE
  }
}

export function hideInvite () {
  return {
    type: types.HIDE_INVITE
  }
}

export function hideSidebar () {
  return {
    type: types.HIDE_SIDEBAR
  }
}

export function showSidebar () {
  return {
    type: types.SHOW_SIDEBAR
  }
}

export function toggleSidebar () {
  return {
    type: types.TOGGLE_SIDEBAR
  }
}

export function getShoppingCart (intent) {
  const api = 'search'
  return (dispatch, getState) => {
    const state = getState()
    const context = state.Context
    return dispatch({
      types: [
        types.REQUEST_CART,
        types.REQUEST_CART_SUCCESS,
        types.REQUEST_CART_FAILURE
      ],
      api,
      beforeSuccessCallback: response => {
        return {
          ...response,
          isSidebarOpen:
            state.Conversation.cart === null && response.answer.card
              ? true
              : !response.answer.card ? false : state.isSidebarOpen
        }
      },
      context,
      payload: {
        bot: true
      },
      query: {
        q: 'Show me summary',
        intent
      }
    })
  }
}
