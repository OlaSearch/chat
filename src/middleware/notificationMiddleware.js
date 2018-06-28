import { utilities } from '@olasearch/core'
import types from './../ActionTypes'
import { isValidReply } from './../utils'

const debounceNotify = utilities.debounce(notify, 300)

function notify ({ body, title, icon }) {
  /**
   * Check if local development mode
   */
  if (utilities.isDev()) return
  if (
    window.Notification &&
    Notification.permission !== 'denied' &&
    !document.hasFocus()
  ) {
    Notification.requestPermission(function () {
      const n = new Notification(title, {
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
  return () => next => action => {
    if (action.type === types.REQUEST_BOT_SUCCESS) {
      if (!action.answer) return next(action)
      var { reply_voice: reply, search } = action.answer
      if (!reply && search && search.title) reply = search.title
      if (isValidReply(reply)) {
        debounceNotify({ body: reply, title: name, icon })
      }
    }
    return next(action)
  }
}
