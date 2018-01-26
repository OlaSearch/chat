/* global Element */
import { EMOJI_LIST } from './Settings'

export function createHTMLMarkup (html) {
  if (Array.isArray(html)) html = html.join('')
  return { __html: html }
}

export function createMessageMarkup (text) {
  if (!text) return null
  const emojiRegex = /^\\[a-z|0-9]+\b/g
  let t = text.replace(emojiRegex, match => {
    return '<span class="' + `${EMOJI_LIST[match]}` + '"></span>'
  })
  return createHTMLMarkup(t)
}

export function createMessage (text, userId) {
  return {
    message: text
  }
}

export function checkIfAwaitingResponse (response) {
  if (!response) return false
  return (
    response.answer &&
    'awaiting_user_input' in response.answer &&
    response.answer.awaiting_user_input === false
  )
}

export function convertoFloat32ToInt16 (buffer) {
  var l = buffer.length
  var buf = new Int16Array(l)

  while (l--) {
    buf[l] = buffer[l] * 0xffff // convert to 16 bit
  }
  return buf.buffer
}

export function stripHtml (text) {
  if (!text) return ''
  if (Array.isArray(text)) text = text[0]
  return text.replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/gi, ' ')
}

export function triggerMouseEvent (node, eventType) {
  var event = new window.Event(eventType, {
    bubbles: false,
    cancelable: true
  })
  node.dispatchEvent(event)
}

export function isClosest (iframeEl, element, elementClosest) {
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector
  }
  var el = element
  var ancestor = element
  if (!iframeEl.contains(el)) return null
  do {
    if (ancestor.matches(elementClosest)) return ancestor
    ancestor = ancestor.parentElement
  } while (ancestor !== null)
  return null
}
