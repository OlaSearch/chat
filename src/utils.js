/* global Element */
import { EMOJI_LIST, SLOT_TEXT } from './Settings'
import flatten from 'ramda/src/flatten'
import { utilities } from '@olasearch/core'
import invariant from 'invariant'

export function createHTMLMarkup (html) {
  if (Array.isArray(html)) html = html.join('')
  return { __html: html }
}

export function createMessageMarkup (text, options = {}) {
  if (!text) return null
  const { convertLinebreak } = options
  if (Array.isArray(text)) text = text[0]
  const emojiRegex = /^\\[a-z|0-9]+\b/g
  let t = text.replace(emojiRegex, match => {
    return '<span class="ola-emoji ' + `${EMOJI_LIST[match]}` + '"></span>'
  })
  /**
   * Cleanup
   * 1. Remove starting and ending linebreaks
   * 2. Replace new lines with line breaks
   */
  if (convertLinebreak) {
    t = t.replace(/^\n|\n$/gi, '').replace(/\n/gim, '<br />')
  }
  return createHTMLMarkup(t)
}

export function createMessage (text) {
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
  const { answer, results, mc } = response
  if (!answer) return []
  const { reply } = answer
  const isBot = !answer.userId
  const isSearchActive = isBot && results && results.length
  const sequence = {
    message: [],
    detached: [],
    outer: []
  }

  if (reply) {
    var isMultiple = Array.isArray(reply)
    if (isMultiple) {
      for (let i = 0; i < reply.length; i++) {
        sequence.message.push({
          type: 'text',
          content: reply[i]
        })
      }
    } else {
      sequence.message.push({
        type: 'text',
        content: reply
      })
    }
  }
  if (answer.slot && answer.slot.options) {
    sequence.detached.push({
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

  /**
   * Check if answer card source === 'results' and if search results are empty and no reply
   */
  if (
    !results.length &&
    answer.card &&
    answer.card.source &&
    answer.card.source === 'results'
  ) {
    /**
     * Always push a message along with search
     */
    if (!sequence.message.length) {
      sequence.message.push({
        type: 'text',
        search: true
      })
    }
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

  if (isBot && !sequence.message.length && !sequence.detached.length) {
    sequence.message.push({
      type: 'text',
      search: true
    })
  }

  if (answer.quick_replies && answer.quick_replies.length) {
    sequence.outer.push({
      type: 'quick_replies'
    })
  }
  return sequence
}

export function createSlot ({ id, name, value, type }) {
  return {
    entity_id: id,
    name,
    type,
    value
  }
}

export function isValidReply (reply) {
  if (Array.isArray(reply)) return reply.length
  return !!reply
}

/**
 * Play the audio track based on the audio url
 * @param {String} audioPath | url of the audio track
 */
export function playAudio (audioPath) {
  invariant(audioPath, 'Please specify the path of the audio track to play')
  const audio = new Audio()
  audio.crossOrigin = true
  audio.src = audioPath
  audio.play()
}
