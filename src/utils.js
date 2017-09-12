module.exports = {
  createHTMLMarkup (html) {
    if (Array.isArray(html)) html = html.join('')
    return { __html: html }
  },
  createMessage (text, userId) {
    return {
      message: text
    }
  },
  checkIfAwaitingResponse (response) {
    if (!response) return false
    return response.answer && 'awaiting_user_input' in response.answer && response.answer.awaiting_user_input === false
  },
  convertoFloat32ToInt16 (buffer) {
    var l = buffer.length
    var buf = new Int16Array(l)

    while (l--) {
      buf[l] = buffer[l] * 0xFFFF    // convert to 16 bit
    }
    return buf.buffer
  },
  stripHtml (text) {
    if (!text) return ''
    if (Array.isArray(text)) text = text[0]
    return text.replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/ig, ' ')
  },
  triggerMouseEvent (node, eventType) {
    var event = new window.Event(eventType, { bubbles: false, cancelable: true })
    node.dispatchEvent(event)
  },
  closest (iframeEl, element, elementClosest) {
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector
    }
    var el = element
    var ancestor = element
    if (!iframeEl.contains(el)) return null
    do {
        if (ancestor.matches(elementClosest)) return ancestor
        ancestor = ancestor.parentElement
    } while (ancestor !== null)
    return null
  },
  avatarBot: null
}
