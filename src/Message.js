import React from 'react'
import cx from 'classnames'
import Avatar from './Avatar'
import { createHTMLMarkup } from './utils'
import { DateParser } from 'olasearch'

const Message = ({ message }) => {
  let { userId, timestamp } = message
  let isBot = !userId
  let text = isBot ? message.reply : message.message
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
          {DateParser.format(timestamp * 1000, 'DD MMM')}
        </div>
      </div>
    </div>
  )
}

export default Message
