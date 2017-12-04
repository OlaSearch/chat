'use strict';

var _Settings = require('./Settings');

var utils = {
  createHTMLMarkup: function createHTMLMarkup(html) {
    if (Array.isArray(html)) html = html.join('');
    return { __html: html };
  },
  createMessageMarkup: function createMessageMarkup(text) {
    if (!text) return null;
    var emojiRegex = /^\\[a-z|0-9]+\b/g;
    var t = text.replace(emojiRegex, function (match) {
      return '<span class="' + ('' + _Settings.EMOJI_LIST[match]) + '"></span>';
    });
    return utils.createHTMLMarkup(t);
  },
  createMessage: function createMessage(text, userId) {
    return {
      message: text
    };
  },
  checkIfAwaitingResponse: function checkIfAwaitingResponse(response) {
    if (!response) return false;
    return response.answer && 'awaiting_user_input' in response.answer && response.answer.awaiting_user_input === false;
  },
  convertoFloat32ToInt16: function convertoFloat32ToInt16(buffer) {
    var l = buffer.length;
    var buf = new Int16Array(l);

    while (l--) {
      buf[l] = buffer[l] * 0xffff; // convert to 16 bit
    }
    return buf.buffer;
  },
  stripHtml: function stripHtml(text) {
    if (!text) return '';
    if (Array.isArray(text)) text = text[0];
    return text.replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/gi, ' ');
  },
  triggerMouseEvent: function triggerMouseEvent(node, eventType) {
    var event = new window.Event(eventType, {
      bubbles: false,
      cancelable: true
    });
    node.dispatchEvent(event);
  },
  closest: function closest(iframeEl, element, elementClosest) {
    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    var el = element;
    var ancestor = element;
    if (!iframeEl.contains(el)) return null;
    do {
      if (ancestor.matches(elementClosest)) return ancestor;
      ancestor = ancestor.parentElement;
    } while (ancestor !== null);
    return null;
  },

  avatarBot: null
}; /* global Element */


module.exports = utils;