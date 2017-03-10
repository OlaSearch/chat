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
  },
  checkIfAwaitingResponse: function checkIfAwaitingResponse(response) {
    return response.answer && 'awaiting_user_input' in response.answer && response.answer.awaiting_user_input === false;
  }
};