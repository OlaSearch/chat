import types from './../ActionTypes'
import { EMPTY_ARRAY } from './../Settings'
import { ActionTypes, utilities } from '@olasearch/core'

const initialState = {
  q: '',
  messages: EMPTY_ARRAY,
  isTyping: false,
  language: 'en',
  shouldPoll: false,
  feedbackActive: false,
  feedbackMessageId: null,
  feedbackRating: null,
  isLoading: false,
  /* Flag to indicate if bot is currently active */
  isBotActive: false,

  /* Track the latest message: Used to scroll to the new message */
  newMessageId: null,

  /* For Search */
  perPage: 3 /* Per page is managed in Conversation state: As it can conflict with QueryState (Search) */,
  page: 1,
  facet_query: EMPTY_ARRAY
}

function createMessageObj ({
  answer,
  results,
  mc,
  totalResults,
  page = 1,
  ...rest
}) {
  return {
    ...answer,
    mc,
    awaitingUserInput: answer.awaiting_user_input,
    results,
    showSearch: false,
    totalResults,
    page,
    ...rest
  }
}

function createTypingMsg (msgId) {
  return {
    id: utilities.uuid(),
    msgId,
    isTyping: true
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_ADD_MESSAGE:
      return {
        ...state,
        newMessageId: action.message.id,
        messages: [...state.messages, action.message]
      }

    case types.REQUEST_BOT:
      return {
        ...state,
        isLoading: true
      }

    case types.REQUEST_BOT_SUCCESS:
      let {
        answer = {},
        results,
        payload,
        mc,
        totalResults,
        page,
        suggestedTerm,
        spellSuggestions
      } = action

      /**
       * Searching inside the bot
       */
      if (payload.appendResult && payload.bot) {
        return {
          ...state,
          isLoading: false,
          messages: state.messages.map((item, idx) => {
            if (item.id === answer.in_response_to) {
              return {
                ...item,
                results: [...item.results, ...results],
                page: payload.page
              }
            }
            /**
             * Pure search, no Intent engine
             */
            if (
              item.msgId &&
              !answer.in_response_to &&
              item.id === payload.msgId
            ) {
              return {
                ...item,
                results: [...item.results, ...results],
                page: payload.page
              }
            }
            return item
          })
        }
      }

      /* Check if the answer is empty */
      if (answer && (answer.empty || answer.error)) return state

      let { in_response_to, message } = answer
      let msg = createMessageObj({
        answer,
        results,
        mc,
        totalResults,
        page,
        suggestedTerm,
        spellSuggestions,
        originalQuery: payload.originalQuery
      })
      return {
        ...state,
        isLoading: false,
        newMessageId: msg.id,
        messages: state.messages.map(item => {
          /**
           * Replace the message text after profanity check from Intent engine
           */
          if (item.id === in_response_to) {
            return {
              ...item,
              message:
                item.message === message
                  ? item.message
                  : message /* To prevent re-render */,
              suggestedTerm
            }
          }
          /**
           * Pure search, no Intent engine
           */
          if (item.msgId && item.isTyping && !in_response_to) {
            return {
              ...item,
              ...msg,
              isTyping: false
            }
          }
          /**
           * Replace typing message with new message from Intent Engne
           */
          if (item.msgId && msg.in_response_to === item.msgId) {
            return msg
          }
          return item
        })
      }

    case types.REQUEST_BOT_FAILURE:
      return {
        ...state,
        messages: state.messages
          .map(item => {
            if (item.id === action.payload.message.id) {
              return {
                ...action.payload.message,
                error: true
              }
            }
            return item
          })
          .filter(item => item.msgId !== action.payload.message.id)
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
          if (item.id === action.payload.messageId) {
            return {
              ...item,
              mc: action.mc
            }
          }
          return item
        })
      }

    case types.SHOW_TYPING_INDICATOR:
      let typingMsg = createTypingMsg(action.msgId)
      return {
        ...state,
        newMessageId: typingMsg.id,
        messages: [...state.messages, typingMsg],
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

    case ActionTypes.OLA_REHYDRATE:
      return {
        ...state,
        messages: action.botState
          ? action.botState.messages.map(item => ({
            ...item,
            showSearch: false
          }))
          : []
      }

    case types.TOGGLE_SEARCH_VISIBILITY:
      return {
        ...state,
        messages: state.messages.map(msg => {
          if (msg.id === action.messageId) {
            return {
              ...msg,
              showSearch: !msg.showSearch
            }
          }
          return msg
        })
      }

    default:
      return state
  }
}
