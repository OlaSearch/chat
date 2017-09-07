import React from 'react'
import cx from 'classnames'
import Avatar from './Avatar'
import Card from './Card'
import { createHTMLMarkup } from './utils'
import { DateParser } from 'olasearch'
import SlotOptions from './SlotOptions'
import SearchResultsMessage from './SearchResultsMessage'
import MessageFeedback from './MessageFeedback'

const Message = ({ message, avatarBot, avatarUser, addMessage, botName, userName, minTextLength, isActive, isSearchActive, isTyping, messageIdx }) => {
  let { userId, timestamp, awaitingUserInput, fulfilled, card, slot_options: options, results, intent } = message
  let isBot = !userId
  let text = isBot ? message.reply : message.message
  let messageClass = cx('olachat-message', {
    'olachat-message-bot': isBot,
    'olachat-message-fulfilled': fulfilled,
    'olachat-message-collapse': typeof awaitingUserInput !== 'undefined' && !awaitingUserInput,
    'olachat-message-single': text && text.length < minTextLength,
    'olachat-message-wide': !!card,
    'olachat-message-with-search': results && results.length > 0,
    'olachat-message-isfeedback': message.isFeedback
  })
  return (
    <div className={messageClass}>
      <Avatar
        isBot={isBot}
        userId={userId}
        avatarBot={avatarBot}
        avatarUser={avatarUser}
      />
      <div className='olachat-message-body'>
        <div className='olchat-message-name'>
          {isBot
            ? botName
            : userName
          }
        </div>
        <div className='olachat-message-content'>
          <div className='olachat-message-reply' dangerouslySetInnerHTML={createHTMLMarkup(text)} />
          <Card
            card={card}
          />
          <SearchResultsMessage
            results={results}
            botName={botName}
            isActive={isSearchActive}
            message={message}
          />
        </div>
        <div className='olachat-message-date'>
          {DateParser.format(timestamp * 1000, 'DD MMM')}
        </div>
        <SlotOptions
          onSubmit={addMessage}
          options={options}
          isActive={isActive}
          intent={intent}
        />
        <MessageFeedback
          isBot={isBot}
          message={message}
          isActive={isActive}
          isTyping={isTyping}
          messageIdx={messageIdx}
        />
      </div>
    </div>
  )
}

Message.defaultProps = {
  minTextLength: 40
}

export default Message
