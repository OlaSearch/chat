'use strict';

module.exports = {
  createHTMLMarkup: function createHTMLMarkup(html) {
    if (Array.isArray(html)) html = html.join('');
    return { __html: html };
  },
  createMessage: function createMessage(text, userId) {
    return {
      message: text
    };
  }
};