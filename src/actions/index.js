import types from './../ActionTypes'

export function addMessage (text) {
  /* Replace carriage return with line break */
  text = text.replace(/(\r\n|\n|\r)/g,"<br />")

  return {
    type: types.REQUEST_ADD_MESSAGE,
    message: {
      id: Math.random(),
      text: text,
      userId: null,
      time: '2 minutes ago',
    },
  }
}