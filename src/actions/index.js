import types from './../ActionTypes'
var myArray = [null, 12312321]
export function addMessage (text) {
  /* Replace carriage return with line break */
  text = text.replace(/(\r\n|\n|\r)/g,"<br />")

  return {
    type: types.REQUEST_ADD_MESSAGE,
    message: {
      id: Math.random(),
      text: text,
      userId: myArray[Math.floor(Math.random() * myArray.length)],
      time: '2 minutes ago',
    },
  }
}