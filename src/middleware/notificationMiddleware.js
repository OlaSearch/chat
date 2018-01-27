import { utilities } from '@olasearch/core'
import types from './../ActionTypes'

const debounceNotify = utilities.debounce(notify, 300)

function notify ({ body, title, icon }) {
  if (
    window.Notification &&
    Notification.permission !== 'denied' &&
    !document.hasFocus()
  ) {
    Notification.requestPermission(function (status) {
      var n = new Notification(title, {
        body,
        icon
      })
      n.onclick = function () {
        window.focus()
      }
    })
  }
}
export default function ({ name, icon }) {
  return ({ dispatch, getState }) => next => action => {
    if (action.type === types.REQUEST_BOT_SUCCESS) {
      if (!action.answer) return next(action)
      let { reply_voice: reply, search } = action.answer
      if (!reply && search && search.title) reply = search.title
      if (reply) debounceNotify({ body: reply, title: name, icon })
    }
    return next(action)
  }
}
