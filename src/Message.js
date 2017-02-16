import React from 'react'
import cx from 'classnames'
import { createHTMLMarkup } from './utils'

const Message = ({ message }) => {
  let { userId, text, time } = message
  let isBot = !userId
  let messageClass = cx('olachat-message', {
    'olachat-message-bot': isBot
  })
  return (
    <div className={messageClass}>
      <span className='olachat-message-avatar'>asdas</span>
      <div className='olachat-message-body'>
        <div className='olachat-message-content' dangerouslySetInnerHTML={createHTMLMarkup(text)} />
        <div className='olachat-message-time'>
          {time}
        </div>
      </div>
    </div>
  )
}

export default Message
