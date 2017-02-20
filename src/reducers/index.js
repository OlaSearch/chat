import types from './../ActionTypes'

const initialState = {
  messages: [
    {
      id: 1,
      text: 'Hello, how are you?',
      userId: 2,
      date: 'January 29, 2016',
    },
    {
      id: 2,
      text: 'Hello, how are you?',
      userId: 2,
      date: 'January 29, 2017',
    },
    {
      id: 3,
      text: 'I am fine. My name is chatterbot',
      userId: null,
      date: 'January 29, 2017',
    },
    {
      id: 11,
      text: 'Hello, how are you?',
      userId: 2,
      date: 'January 29, 2017',
    },
    {
      id: 22,
      text: 'Hello, how are you?',
      userId: 2,
      date: 'January 29, 2017',
    },
    {
      id: 33,
      text: 'I am fine. My name is chatterbot',
      userId: null,
      date: 'January 29, 2017',
    },
    {
      id: 111,
      text: 'Hello, how are you?',
      userId: 2,
      date: 'January 29, 2017',
    },
    {
      id: 222,
      text: 'Hello, how are you?',
      userId: 2,
      date: 'January 29, 2017',
    },
    {
      id: 333,
      text: 'I am fine. My name is chatterbot',
      userId: null,
      date: 'January 29, 2017',
    },
  ],
  isTyping: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_ADD_MESSAGE:
      return {
        ...state,
        messages: [ ...state.messages, action.message ],
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
