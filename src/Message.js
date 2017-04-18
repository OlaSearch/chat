import React from 'react'
import cx from 'classnames'
import Avatar from './Avatar'
import { createHTMLMarkup } from './utils'
import { DateParser } from 'olasearch'

const Message = ({ message, avatarBot }) => {
  let { userId, timestamp, awaitingUserInput, fulfilled } = message
  let isBot = !userId
  let text = isBot ? message.reply : message.message
  let messageClass = cx('olachat-message', {
    'olachat-message-bot': isBot,
    'olachat-message-fulfilled': fulfilled,
    'olachat-message-collapse': typeof awaitingUserInput !== 'undefined' && !awaitingUserInput,
    'olachat-message-single': text && text.length < 40
  })
  return (
    <div className={messageClass}>
      <Avatar
        isBot={isBot}
        userId={userId}
        avatarBot={avatarBot}
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
