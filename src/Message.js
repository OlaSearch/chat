import React from 'react'
import cx from 'classnames'
import Avatar from './Avatar'
import Card from './Card'
import { createMessageMarkup } from './utils'
import { DateParser, AnswerMC } from '@olasearch/core'
import SlotOptions from './SlotOptions'
import SearchResultsMessage from './SearchResultsMessage'
import MessageFeedback from './MessageFeedback'
import Loader from './Loader'

function Message({
  message,
  avatarBot,
  avatarUser,
  addMessage,
  botName,
  userName,
  isActive,
  isSearchActive,
  isTyping,
  messageIdx,
  log,
  isLoadingMc
}) {
  let {
    userId,
    timestamp,
    awaitingUserInput,
    fulfilled,
    card,
    slot_options: slotOptions,
    results,
    intent,
    mc /* Machine comprehension */
  } = message
  let isBot = !userId
  let text = isBot ? message.reply : message.message
  let messageClass = cx('olachat-message', {
    'olachat-message-bot': isBot,
    'olachat-message-fulfilled': fulfilled,
    'olachat-message-collapse':
      typeof awaitingUserInput !== 'undefined' && !awaitingUserInput,
    'olachat-message-wide': !!card,
    'olachat-message-with-search': results && results.length > 0
  })
  return (
    <div className={messageClass}>
      <Avatar
        isBot={isBot}
        userId={userId}
        avatarBot={avatarBot}
        avatarUser={avatarUser}
      />
      <div className="olachat-message-body">
        <div className="olchat-message-name">{isBot ? botName : userName}</div>
        <div className="olachat-message-content">
          <AnswerMC
            mc={mc}
            payload={{ ...message, isBot: true }}
            loader={isActive ? <Loader /> : null}
          />

          {mc ? null : (
            <div
              className="olachat-message-reply"
              dangerouslySetInnerHTML={createMessageMarkup(text)}
            />
          )}
          <Card card={card} />
          <SearchResultsMessage
            results={results}
            botName={botName}
            isActive={isSearchActive}
            message={message}
          />
        </div>
        <div className="olachat-message-date">
          {DateParser.format(timestamp * 1000, 'DD MMM')}
        </div>
        <SlotOptions
          onSubmit={addMessage}
          options={slotOptions}
          isActive={isActive}
          intent={intent}
          message={message}
          log={log}
        />
        <MessageFeedback
          isBot={isBot}
          message={message}
          isActive={isActive}
          isTyping={isTyping}
          messageIdx={messageIdx}
          onSubmit={addMessage}
        />
      </div>
    </div>
  )
}

export default Message
