module.exports = {
  createHTMLMarkup (html) {
    if (Array.isArray(html)) html = html.join('')
    return { __html: html }
  },
  createMessage (text, userId) {
    return {
      message: text
    }
  }
}
