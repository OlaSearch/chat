'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHTMLMarkup = createHTMLMarkup;
exports.createMessageMarkup = createMessageMarkup;
exports.createMessage = createMessage;
exports.checkIfAwaitingResponse = checkIfAwaitingResponse;
exports.convertoFloat32ToInt16 = convertoFloat32ToInt16;
exports.stripHtml = stripHtml;
exports.triggerMouseEvent = triggerMouseEvent;
exports.isClosest = isClosest;

var _Settings = require('./Settings');

function createHTMLMarkup(html) {
  if (Array.isArray(html)) html = html.join('');
  return { __html: html };
} /* global Element */
function createMessageMarkup(text) {
  if (!text) return null;
  var emojiRegex = /^\\[a-z|0-9]+\b/g;
  var t = text.replace(emojiRegex, function (match) {
    return '<span class="' + ('' + _Settings.EMOJI_LIST[match]) + '"></span>';
  });
  return createHTMLMarkup(t);
}

function createMessage(text, userId) {
  return {
    message: text
  };
}

function checkIfAwaitingResponse(response) {
  if (!response) return false;
  return response.answer && 'awaiting_user_input' in response.answer && response.answer.awaiting_user_input === false;
}

function convertoFloat32ToInt16(buffer) {
  var l = buffer.length;
  var buf = new Int16Array(l);

  while (l--) {
    buf[l] = buffer[l] * 0xffff; // convert to 16 bit
  }
  return buf.buffer;
}

function stripHtml(text) {
  if (!text) return '';
  if (Array.isArray(text)) text = text[0];
  return text.replace(/<(?:.|\n)*?>/gm, '').replace(/&nbsp;/gi, ' ');
}

function triggerMouseEvent(node, eventType) {
  var event = new window.Event(eventType, {
    bubbles: false,
    cancelable: true
  });
  node.dispatchEvent(event);
}

function isClosest(iframeEl, element, elementClosest) {
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
}