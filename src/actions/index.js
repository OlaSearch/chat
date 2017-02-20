import types from './../ActionTypes'

const myArray = [null, 12312321]
export function addMessage ({ text }) {
  /* Replace carriage return with line break */
  text = text.replace(/(\r\n|\n|\r)/g,"<br />")

  let message = (userId) => ({
    id: Math.random(),
    text: text,
    userId: typeof userId === 'undefined' ? Math.random() : userId,
    date: 'January 29, 2017',
  })

  return (dispatch, getState) => {
    dispatch({
      type: types.REQUEST_ADD_MESSAGE,
      message: message()
    })

    /* Show typing indicator after 1 second */
    setTimeout(() => dispatch(showTypingIndicator()), 500)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        /* Hide typing indicator */
        dispatch(hideTypingIndicator())

        /* Add new message retrieved from the server */
        dispatch({
          type: types.REQUEST_ADD_MESSAGE,
          message: message(null)
        })
        /* Send the message object returned by the server */
        resolve(message(null))
      }, 2000)

    })
  }
}


export function showTypingIndicator () {
  return {
    type: types.SHOW_TYPING_INDICATOR
  }
}

export function hideTypingIndicator () {
  return {
    type: types.HIDE_TYPING_INDICATOR
  }
}