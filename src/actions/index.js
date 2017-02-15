import types from './../ActionTypes'

export function addMessage () {
  return {
    type: types.REQUEST_ADD_MESSAGE,
    message: {
      id: Math.random(),
      text: 'Crap, I am fine. My name is chatterbot',
      userId: null,
      time: '2 minutes ago',
    },
  }
}