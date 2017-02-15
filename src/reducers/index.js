import types from './../ActionTypes'

const initialState = {
  messages: [
    {
      id: 1,
      text: 'Hello, how are you?',
      userId: 2,
      time: '20 minutes ago',
    },
    {
      id: 2,
      text: 'Hello, how are you?',
      userId: 2,
      time: '2 minutes ago',
    },
    {
      id: 3,
      text: 'I am fine. My name is chatterbot',
      userId: null,
      time: '2 minutes ago',
    },
    {
      id: 11,
      text: 'Hello, how are you?',
      userId: 2,
      time: '20 minutes ago',
    },
    {
      id: 22,
      text: 'Hello, how are you?',
      userId: 2,
      time: '2 minutes ago',
    },
    {
      id: 33,
      text: 'I am fine. My name is chatterbot',
      userId: null,
      time: '2 minutes ago',
    },
    {
      id: 111,
      text: 'Hello, how are you?',
      userId: 2,
      time: '20 minutes ago',
    },
    {
      id: 222,
      text: 'Hello, how are you?',
      userId: 2,
      time: '2 minutes ago',
    },
    {
      id: 333,
      text: 'I am fine. My name is chatterbot',
      userId: null,
      time: '2 minutes ago',
    },
    {
      id: 3332,
      text: 'I am fine. My name is chatterbot',
      userId: null,
      time: '2 minutes ago',
    }
  ],
  isLoading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_ADD_MESSAGE:
      return {
        ...state,
        messages: [ ...state.messages, action.message ]
      }
    default:
      return state
  }
}
