import types from './../ActionTypes'
import { ActionTypes } from 'olasearch'

const initialState = {
  messages: [],
  isTyping: false,
  language: 'en',
  shouldPoll: false
}

const createMessageObj = (answer, results) => {
  return {
    id: answer.id,
    reply: answer.reply,
    reply_voice: answer.reply_voice,
    timestamp: answer.timestamp,
    intent: answer.intent,
    message: answer.message,
    awaitingUserInput: answer.awaiting_user_input,
    in_response_to: answer.in_response_to,
    slot_options: answer.slot_options,
    quick_replies: answer.quick_replies,
    fulfilled: answer.fulfilled,
    card: answer.card,
    search: answer.search,
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
      if (!action.answer) return state
      let { answer, results, payload } = action

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
          let msg = { ...answer, reply: reply[i], id: answer.id + '_' + i }
          messages.push(createMessageObj(msg))
        }
      } else {
        messages.push(createMessageObj(answer, results))
      }

      /**
       * Update older messages
       */
      let original_messages = state.messages.map((item) => {
        if (item.id === in_response_to) {
          item['message'] = message
        }
        return item
      })
      return {
        ...state,
        messages: [...original_messages, ...messages],
      }

    case types.CLEAR_MESSAGES:
      return {
        ...state,
        messages: []
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

    default:
      return state
  }
}
