import types from './../ActionTypes'
import {
  checkIfAwaitingResponse,
  createMessageSequence,
  playAudio
} from './../utils'
import { utilities, Actions, Settings } from '@olasearch/core'
import {
  CHAT_DELAY,
  CHAT_REPLY_DELAY,
  RESULTS_FOR_MC,
  DEFAULT_EVENT_SOURCE
} from './../Settings'
import invariant from 'invariant'
import omit from 'ramda/src/omit'

/* Query sanitization */
const { sanitizeText, uuid } = utilities
const { SLOT_DATE } = Settings

/**
 * Update query term in redux state
 * @param  {string} term
 */
export function updateBotQueryTerm (term) {
  return {
    type: types.UPDATE_BOT_QUERY_TERM,
    term: sanitizeText(term)
  }
}

/**
 * Clear query term
 */
export function clearBotQueryTerm () {
  return {
    type: types.CLEAR_BOT_QUERY_TERM
  }
}

/**
 * Send a message to the chatbot
 * @param {string} payload.intent
 * @param {string} payload.value
 * @param {string} payload.query
 * @param {string} payload.label
 * @param {boolean} payload.hidden Hides a message from displaying in the bot
 * @param {Array} payload.slots
 */
export function addMessage (payload) {
  return (dispatch, getState) => {
    const state = getState()
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
    const hideTyping = payload && payload.prevMsgId
    /**
     * Parameters that needs to added to the query
     */
    const payloadParams = omit(['value', 'label', 'intent', 'query'], payload)

    /**
     * Update typing
     */
    if (payload.prevMsgId) {
      dispatch(updateMessageId(payload.prevMsgId, msgId))
    }

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

    const { searchInput } = query
    const api = 'search'
    const timestamp = new Date().getTime() / 1000

    /**
     * Check if original query is filled
     * Only use if you want to dynamically replace the query
     */
    if (payload && typeof payload.query !== 'undefined') {
      query.q = payload.query
    }

    /* User message */
    const message = {
      id: msgId,
      userId: context.userId,
      message: query.q,
      sequence: {
        message: [
          {
            type: 'text',
            content: label || query.q
          }
        ]
      },
      label,
      timestamp,
      in_response_to
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

        /* Add a callback */
        if (payload && payload.callback) payload.callback(message)
      }
    }

    if (stopSubmit) return

    /* Simulate delay - Show typing indicator */
    if (!hideTyping) {
      setTimeout(
        () => dispatch(showTypingIndicator(msgId)),
        (payload && payload.start) || !showUserMessage ? 0 : CHAT_DELAY
      )
    }

    return new Promise(resolve => {
      /* Simulate delay */
      setTimeout(() => {
        /* Update timestamp */

        dispatch(Actions.Search.addTimestamp(api))

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
              isSidebarOpen:
                state.Device.isDesktop &&
                response.answer &&
                response.answer.cart &&
                response.answer.cart === true
                  ? true
                  : state.Conversation.isSidebarOpen,
              ...(response.results
                ? {
                  results: response.results.slice(0, perPage)
                }
                : {})
            }
          },
          payload: {
            eventSource: DEFAULT_EVENT_SOURCE,
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
            }
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
            if ('slots' in payload) {
              delete payload['slots']
            }
            if ('hidden' in payload) {
              delete payload['hidden']
            }
            if ('query' in payload) {
              delete payload['query']
            }
            /* Clear previous query */
            dispatch(clearBotQueryTerm())

            /* Check if response from this message is empty */
            const isEmptyResponse = response.answer.empty

            /* Ask for more messages */
            /**
             * Add a delay based on no of messages
             */
            var delayNextMessage = 0
            if (
              payload &&
              payload.chatBotMessageTimeout &&
              Array.isArray(response.answer.reply)
            ) {
              /**
               * Todo.. check the length of message.sequence => detached and outer components also
               */
              delayNextMessage =
                payload.chatBotMessageTimeout * response.answer.reply.length
            }
            setTimeout(() => {
              dispatch(
                addMessage({
                  ...payload,
                  prevMsgId: isEmptyResponse ? msgId : null
                })
              )
            }, delayNextMessage)
          }

          /* Add a callback */
          if (payload && payload.callback) payload.callback(response)

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
 * Check for context variables
 */
export function checkBotContext () {
  return (dispatch, getState) => {
    const params = omit(['messages'], getState().Conversation)
    const payload = { bot: true }
    return dispatch(
      Actions.Context.checkContext({
        params,
        payload
      })
    )
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

/**
 * Show typing indicator for a message
 * @param  {string} msgId
 */
export function showTypingIndicator (msgId) {
  invariant(msgId, 'msgId is required')
  return {
    type: types.SHOW_TYPING_INDICATOR,
    msgId
  }
}

/**
 * Hide typing indicator
 */
export function hideTypingIndicator () {
  return {
    type: types.HIDE_TYPING_INDICATOR
  }
}

/**
 * Clears all chatbot messages
 */
export function clearMessages () {
  return {
    type: types.CLEAR_MESSAGES
  }
}

/**
 * Poll the server when the chatbot is idle. Not used now.
 */
export function pollWhenIdle () {
  return (dispatch, getState) => {
    const { shouldPoll } = getState().Conversation
    if (!shouldPoll) return
    dispatch(addMessage({ intent: 'idle' }))
  }
}

/**
 * Add the message id for which user is sending a feedback in state
 * @param {string} messageId
 */
export function setFeedbackMessage (messageId) {
  return {
    type: types.SET_FEEDBACK_MESSAGE_ID,
    messageId
  }
}

/**
 * Set a rating for a feedback
 * @param {string} rating
 */
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
  return dispatch => {
    dispatch({
      type: types.SET_BOT_STATUS,
      status
    })
    /**
     * If the bot is hidden, update all messages to mark them as stale
     */
    if (status === false) {
      dispatch(markMessagesAsStale())
    }

    /**
     * Also make sure remove any typing messages
     */
    dispatch({
      type: types.CLEANUP_MESSAGES
    })
  }
}

/**
 * Mark old messages as stale. This is used to prevent old messages from animating when chatbot is opened
 */
export function markMessagesAsStale () {
  return {
    type: types.MARK_MESSAGES_STALE
  }
}

/**
 * ShowBot: Show
 */
export function showBot () {
  return dispatch => {
    dispatch(setBotStatus(true))
  }
}

/**
 * Hidebot
 */
export function hideBot () {
  return dispatch => {
    dispatch(setBotStatus(false))
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

/**
 * User choose to not share his current location
 */
export function ignoreLocation () {
  return {
    type: types.IGNORE_LOCATION
  }
}

/**
 * Show a chatbot invite
 */
export function showInvite () {
  return {
    type: types.SHOW_INVITE
  }
}

/**
 * Update message of an invite
 * @param  {Object} invite
 */
export function updateInvite (invite) {
  return dispatch => {
    dispatch(playPing())
    return dispatch({
      type: types.UPDATE_INVITE,
      invite
    })
  }
}

/**
 * Hide an invite
 */
export function hideInvite () {
  return {
    type: types.HIDE_INVITE
  }
}

/**
 * Hide sidebar
 */
export function hideSidebar () {
  return {
    type: types.HIDE_CHAT_SIDEBAR
  }
}

/**
 * Show sidebar
 */
export function showSidebar () {
  return {
    type: types.SHOW_CHAT_SIDEBAR
  }
}

/**
 * Toggle sidebar visiblity
 */
export function toggleSidebar () {
  return {
    type: types.TOGGLE_CHAT_SIDEBAR
  }
}

/**
 * Update message id of a message in state
 * @param  {string} oldId
 * @param  {string} newId
 */
export function updateMessageId (oldId, newId) {
  return {
    type: types.UPDATE_TYPING_MESSAGE_ID,
    oldId,
    newId
  }
}

/**
 * Get shopping cart items
 * @param  {string} options.intent
 */
export function getShoppingCart ({ intent }) {
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
      context,
      payload: {
        bot: true
      },
      meta: {
        log: false
      },
      query: {
        q: '',
        intent,
        skipPersistState: true
      }
    })
  }
}

/**
 * Change initial intent
 */
export function setActiveIntent (intent) {
  return {
    type: types.SET_ACTIVE_INTENT,
    intent
  }
}

export function playPing () {
  return (dispatch, getState) => {
    const PING_SOUND_URL = 'https://cdn.olasearch.com/assets/audio/tap.mp3'
    const { isPhone } = getState().Device

    if (!isPhone) {
      playAudio(PING_SOUND_URL)
    }
  }
}
