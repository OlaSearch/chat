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
    return response.answer && 'awaiting_user_input' in response.answer && response.answer.awaiting_user_input === false
  }
}
