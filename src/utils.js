/* global Element */
import { EMOJI_LIST, SLOT_TEXT } from './Settings'
import flatten from 'ramda/src/flatten'
import { utilities } from '@olasearch/core'

export function createHTMLMarkup (html) {
  if (Array.isArray(html)) html = html.join('')
  return { __html: html }
}

export function createMessageMarkup (text) {
  if (!text) return null
  const emojiRegex = /^\\[a-z|0-9]+\b/g
  let t = text.replace(emojiRegex, match => {
    return '<span class="ola-emoji ' + `${EMOJI_LIST[match]}` + '"></span>'
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

export function rgb2hex (rgb) {
  if (!rgb) return ''
  if (rgb.indexOf('rgb') === -1) {
    return rgb
  } else {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/)
    function hex (x) {
      return ('0' + parseInt(x).toString(16)).slice(-2)
    }
    return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
  }
}

export function lighten (c, p) {
  /* Convert color */
  c = rgb2hex(c)
  var n = parseInt(c.slice(1), 16),
    a = Math.round(2.55 * p),
    // Bitshift 16 bits to the left
    r = (n >> 16) + a,
    // Bitshift 8 bits to the left based on blue
    b = ((n >> 8) & 0x00ff) + a,
    //
    g = (n & 0x0000ff) + a
  // Calculate
  return (
    '#' +
    (
      0x1000000 +
      (r < 255 ? (r < 1 ? 0 : r) : 255) * 0x10000 +
      (b < 255 ? (b < 1 ? 0 : b) : 255) * 0x100 +
      (g < 255 ? (g < 1 ? 0 : g) : 255)
    )
      .toString(16)
      .slice(1)
  )
}

export function darken (c, p) {
  return lighten(c, -1 * p)
}

export function imagesLoaded (imgs, callback) {
  var len = imgs.length
  var counter = 0

  for (let i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener('load', incrementCounter, false)
  }

  function incrementCounter () {
    counter++
    if (counter === len) {
      callback()
    }
  }
}

export function getFacetSuggestions (response) {
  // console.log(response)
  if (!response || !response.facets) return []
  return flatten(
    response.facets.map(({ values, name: facetName }) =>
      values.map(({ name }) => ({
        term: utilities.getDisplayName(name),
        value: name,
        name: facetName,
        partial: true
      }))
    )
  )
}

export function getSuggestSlotType (type) {
  switch (type) {
    case SLOT_TEXT:
    case undefined:
    case null:
      return undefined

    default:
      return type
  }
}

export function createMessageSequence (response) {
  const { answer, results, suggestedTerm, payload, mc } = response
  if (!answer) return []
  const { reply, search } = answer
  const { originalQuery } = payload
  const isBot = !answer.userId
  const isSearchActive = isBot && results && results.length
  const sequence = {
    message: [],
    detached: [],
    outer: []
  }

  if (answer.reply) {
    var isMultiple = Array.isArray(answer.reply)
    if (isMultiple) {
      for (let i = 0; i < answer.reply.length; i++) {
        sequence.message.push({
          type: 'text',
          content: answer.reply[i]
        })
      }
    } else {
      sequence.message.push({
        type: 'text',
        content: answer.reply
      })
    }
  }
  if (answer.slot && answer.slot.options) {
    sequence.message.push({
      type: 'slot'
    })
  }

  if (mc) {
    sequence.detached.push({
      type: 'mc'
    })
  }

  if (answer.card) {
    sequence.detached.push({
      type: 'card'
    })
  }

  if (isSearchActive) {
    /**
     * Always push a message along with search
     */
    if (!sequence.message.length) {
      sequence.message.push({
        type: 'text',
        search: true
      })
    }
    sequence.detached.push({
      type: 'search'
    })
  }
  if (answer.quick_replies && answer.quick_replies.length) {
    sequence.outer.push({
      type: 'quick_replies'
    })
  }
  return sequence
}
