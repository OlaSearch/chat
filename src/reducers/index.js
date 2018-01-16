import types from './../ActionTypes'
import { ActionTypes } from '@olasearch/core'

const initialState = {
  q: '',
  messages: [],
  isTyping: false,
  language: 'en',
  shouldPoll: false,
  feedbackActive: false,
  feedbackMessageId: null,
  feedbackRating: null,
  /* Flag to indicate if bot is currently active */
  isBotActive: false,

  /* For Search */
  perPage: 3 /* Per page is managed in Conversation state: As it can conflict with QueryState (Search) */,
  page: 1,
  totalResults: 0,
  // facet_query: [],
}

const createMessageObj = ({ answer, results, mc }) => {
  return {
    ...answer,
    mc,
    awaitingUserInput: answer.awaiting_user_input,
    results
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.message]
      }

    case ActionTypes.REQUEST_SEARCH_SUCCESS:
      /* If its not from Bot: Do NOTHING */
      if (!action.answer || !action.payload.bot || action.answer.error) return state
      let { answer, results, payload, mc } = action

      /* Check if the answer is empty */
      if (answer.empty) return state

      if (payload.appendResult) {
        return {
          ...state,
          messages: state.messages.map((item, idx) => {
            if (item.id === answer.in_response_to) {
              return {
                ...item,
                results: [...item.results, ...results]
              }
            }
            return item
          })
        }
      }

      let { reply, in_response_to, message } = answer
      let messages = []
      if (Array.isArray(reply)) {
        for (let i = 0; i < reply.length; i++) {
          let msg = { ...answer, mc, reply: reply[i], id: answer.id + '_' + i }
          messages.push(createMessageObj({ answer: msg }))
        }
      } else {
        messages.push(createMessageObj({ answer, results, mc }))
      }

      /**
       * Update older messages
       */
      let original_messages = state.messages.map(item => {
        if (item.id === in_response_to) {
          item['message'] = message
        }
        return item
      })
      return {
        ...state,
        messages: [...original_messages, ...messages],
        totalResults: action.totalResults
      }

    case types.CLEAR_MESSAGES:
      return {
        ...state,
        messages: []
      }
    
    case types.CHANGE_BOT_PER_PAGE:
      return {
        ...state,
        perPage: action.perPage
      }

    case ActionTypes.REQUEST_MC_SUCCESS:
      return {
        ...state,
        messages: state.messages.map(item => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              mc: action.mc
            }
          }
          return item
        })
      }

    case types.SHOW_TYPING_INDICATOR:
      return {
        ...state,
        isTyping: true
      }

    case types.HIDE_TYPING_INDICATOR:
      return {
        ...state,
        isTyping: false
      }

    case types.CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.language
      }

    case types.FEEDBACK_SET_ACTIVE:
      return {
        ...state,
        feedbackActive: true
      }

    case types.FEEDBACK_SET_DISABLE:
      return {
        ...state,
        feedbackActive: false
      }

    case types.SET_FEEDBACK_MESSAGE_ID:
      return {
        ...state,
        feedbackMessageId: action.messageId
      }

    case types.SET_FEEDBACK_RATING:
      return {
        ...state,
        feedbackRating: action.rating
      }

    case types.SET_BOT_STATUS:
      return {
        ...state,
        isBotActive: action.status
      }
    
    case types.UPDATE_BOT_QUERY_TERM:
      return {
        ...state,
        q: action.term,
        page: 1
      }
    
    case types.CLEAR_BOT_QUERY_TERM:
      return {
        ...state,
        q: '',
        page: 1
      }
    
    case types.CHANGE_BOT_PAGE:
      return {
        ...state,
        page: action.page
      }
    
    case ActionTypes.OLA_REHYDRATE:
      return {
        ...state,
        messages: action.botState ? action.botState.messages : []
      }

    default:
      return state
  }
}
