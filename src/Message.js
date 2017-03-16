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
    'olachat-message-collapse': typeof awaitingUserInput !== 'undefined' && !awaitingUserInput
  })
  let paragraphs = []
  if (text && text.length > 160) {
    paragraphs = text.split(/(\.)['"" \)\n]/g).filter((i) => i && i !== '.')
  }
  // console.log(text.length, paragraphs)
  return (
    <div className={messageClass}>
      <Avatar
        isBot={isBot}
        userId={userId}
        avatarBot={avatarBot}
      />
      <div className='olachat-message-body'>
        {paragraphs.length
          ? paragraphs.map((para, idx) => {
              let klass = cx('olachat-message-content', {
                'olachat-message-children': idx > 0
              })
              return <div className={klass} key={idx} dangerouslySetInnerHTML={createHTMLMarkup(para)} />
            })
          : <div className='olachat-message-content' dangerouslySetInnerHTML={createHTMLMarkup(text)} />
        }
        <div className='olachat-message-date'>
          {DateParser.format(timestamp * 1000, 'DD MMM')}
        </div>
      </div>
    </div>
  )
}

export default Message
