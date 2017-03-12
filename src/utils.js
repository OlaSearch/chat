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
  },
  convertoFloat32ToInt16 (buffer) {
    var l = buffer.length;
    var buf = new Int16Array(l)

    while (l--) {
      buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
    }
    return buf.buffer
  }
}
