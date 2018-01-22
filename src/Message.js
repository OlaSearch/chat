import React from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import Avatar from './Avatar'
import Card from './Card'
import { createMessageMarkup } from './utils'
import { DateParser, AnswerMC } from '@olasearch/core'
import SlotOptions from './SlotOptions'
import SearchResultsMessage from './SearchResultsMessage'
import MessageFeedback from './MessageFeedback'
import Loader from './Loader'

class Message extends React.Component {
  constructor (props) {
    super(props)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.props.message !== nextProps.message ||
      this.props.isActive !== nextProps.isActive
    )
  }
  render () {
    let {
      message,
      avatarBot,
      avatarUser,
      addMessage,
      botName,
      userName,
      isActive,
      log,
      location
    } = this.props
    let {
      userId,
      timestamp,
      awaitingUserInput,
      fulfilled,
      card,
      slot_options: slotOptions,
      results,
      intent,
      mc, /* Machine comprehension */
      search, /* Search results */
      totalResults, /* Total search results */
      page, /* Current page */
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
    /**
     * Show location prompt if 
     * intent requires `location`
     * and `context` location is empty
     */
    let needsLocation = isActive && message.location && !location

    /**
     * Do not render SearchResultsMessage unless required. Takes a perf hit
     */
    let isSearchActive  = false
    /**
     * If search is active && has results, the reply from the bot is { answer: { search : { title } } }
     * When MC is being loaded isLoadingMC, should we hide search results ?
     * 
     * We are not checking for `search` key in `answer` because search should work without Intent Engine
     */
    if (results && results.length) {
      isSearchActive = true
      /* Bot reply */
      text = `<p>${search ? search.title : 'Here are some results I found'}</p>`
    } else {
      /* No results */
      text = text || `<p>${search ? search.no_result : 'Sorry, we didn\'t find any results.'}</p>`
    }

    if (needsLocation) text = ''

    return (
      <div className={messageClass}>
        <div className='olachat-message-inner'>
          <Avatar
            isBot={isBot}
            userId={userId}
            avatarBot={avatarBot}
            avatarUser={avatarUser}
          />
          <div className='olachat-message-body'>
            <div className='olchat-message-name'>
              {isBot ? botName : userName}
            </div>
            <div className='olachat-message-content'>
              <div
                className='olachat-message-reply'
                dangerouslySetInnerHTML={createMessageMarkup(text)}
              />
              <AnswerMC
                mc={mc}
                payload={{ messageId: message.id, bot: true }}
                loader={isActive ? <Loader /> : null}
              />
              <Card
                card={card}
              />
              {needsLocation
                ? null
                : isSearchActive
                  ? <SearchResultsMessage
                      results={results}
                      botName={botName}
                      message={message}
                      isActive={isActive}
                      page={page}
                      totalResults={totalResults}
                    />
                  : null
              }
            </div>
            <div className='olachat-message-date'>
              {DateParser.format(timestamp * 1000, 'DD MMM h:mm a')}
            </div>
            <SlotOptions
              onSubmit={addMessage}
              options={slotOptions}
              isActive={isActive}
              intent={intent}
              message={message}
              log={log}
              location={location}
            />
            <MessageFeedback
              isBot={isBot}
              message={message}
              isActive={isActive}
              onSubmit={addMessage}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Message
