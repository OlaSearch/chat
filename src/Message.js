import React from 'react'
import cx from 'classnames'
import Avatar from './Avatar'
import { createHTMLMarkup } from './utils'

const Message = ({ message }) => {
  let { userId, text, date } = message
  let isBot = !userId
  let messageClass = cx('olachat-message', {
    'olachat-message-bot': isBot
  })
  return (
    <div className={messageClass}>
      <Avatar
        isBot={isBot}
        userId={userId}
      />
      <div className='olachat-message-body'>
        <div className='olachat-message-content' dangerouslySetInnerHTML={createHTMLMarkup(text)} />
        <div className='olachat-message-date'>
          {date}
        </div>
      </div>
    </div>
  )
}

export default Message
