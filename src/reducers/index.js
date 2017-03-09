import types from './../ActionTypes'
import { ActionTypes } from 'olasearch'

const initialState = {
  messages: [],
  isTyping: false
}

export default (state = initialState, action) => {
  switch (action.type) {

    case types.REQUEST_ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.message]
      }

    case ActionTypes.REQUEST_SEARCH_SUCCESS:
      if (!action.answer || !action.answer.reply) return state
      return {
        ...state,
        messages: [...state.messages, {
          id: action.answer.id,
          reply: action.answer.reply,
          reply_voice: action.answer.reply_voice,
          timestamp: action.answer.timestamp,
          intent: action.answer.intent,
          message: action.answer.message
        }],
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

    default:
      return state
  }
}
