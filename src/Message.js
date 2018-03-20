import React from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import Avatar from './Avatar'
import Card from './Card'
import { createMessageMarkup } from './utils'
import { DateParser, AnswerMC, Decorators } from '@olasearch/core'
import SlotOptions from './SlotOptions'
import Geo from './Geo'
import SearchResultsMessage from './SearchResultsMessage'
import MessageFeedback from './MessageFeedback'
import TopicSuggestions from './TopicSuggestions'
import Loader from './Loader'
import FailureButtons from './FailureButtons'
import QuickReplies from './QuickReplies'

/**
 * Chatbot message
 * @example ./../styleguide/Message.md
 */
class Message extends React.Component {
  constructor (props) {
    super(props)
  }
  shouldComponentUpdate (nextProps, nextState) {
    return (
      this.props.message !== nextProps.message ||
      this.props.isActive !== nextProps.isActive ||
      this.props.theme !== nextProps.theme
    )
  }
  componentDidUpdate () {
    this.props.onUpdate && this.props.onUpdate()
  }
  static defaultProps = {
    showTimestamp: false
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
      location,
      translate,
      theme,
      updateQueryTerm,
      showTimestamp
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
      mc /* Machine comprehension */,
      search /* Search results */,
      totalResults /* Total search results */,
      page /* Current page */,
      spellSuggestions /* Spell suggestions */,
      suggestedTerm /* Term that was searched for */,
      originalQuery,
      error,
      context = {},
      payload,
      quick_replies: quickReplies
    } = message
    let isBot = !userId
    let text = isBot ? message.reply : message.label || message.message

    let messageClass = cx('olachat-message', {
      'olachat-message-bot': isBot,
      'olachat-message-fulfilled': fulfilled,
      'olachat-message-collapse':
        typeof awaitingUserInput !== 'undefined' && !awaitingUserInput,
      'olachat-message-wide': !!card,
      'olachat-message-with-search': results && results.length > 0,
      'olachat-message-error': error,
      'olachat-message-active': isActive,
      'olachat-message-with-qr': quickReplies && quickReplies.length
    })
    /**
     * Show location prompt if
     * intent requires `location`
     * and `context` location is empty
     *
     * isActive message, needs location
     *
     */
    let needsLocation = message.location && !context.location

    /**
     * Do not render SearchResultsMessage unless required. Takes a perf hit
     */
    let isSearchActive = false

    /**
     * search => only exists if intent engine is ON
     */
    if (isBot) {
      if (results && results.length) {
        /* Flag to display search results */
        isSearchActive = true
        text =
          suggestedTerm && suggestedTerm !== originalQuery
            ? translate('chat_could_not_find', { originalQuery, suggestedTerm })
            : search && search.title
              ? search.title
              : translate('chat_here_some_result')
      } else {
        if (search) {
          /* Bot has a reply here */
          /* Search is also active */
          if (text) {
            if (suggestedTerm && suggestedTerm !== originalQuery) {
              text = `${translate('chat_could_not_find', {
                originalQuery,
                suggestedTerm
              })} ${text}`
            }
          } else {
            /* No results */
            text = search.no_result || translate('chat_sorry_no_result')
          }
        }
      }
    }
    if (needsLocation) {
      return (
        <div className={messageClass}>
          <div className='olachat-message-inner'>
            {isBot ? (
              <Avatar
                isBot={isBot}
                userId={userId}
                avatarBot={avatarBot}
                avatarUser={avatarUser}
              />
            ) : null}
            <div className='olachat-message-body'>
              {isBot ? (
                <Geo
                  location={location}
                  needsLocation={needsLocation}
                  message={message}
                  onSubmit={addMessage}
                  isActive={isActive}
                />
              ) : null}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className={messageClass}>
        {/* Message flex */}
        <div className='olachat-message-inner'>
          {isBot ? (
            <Avatar
              isBot={isBot}
              userId={userId}
              avatarBot={avatarBot}
              avatarUser={avatarUser}
            />
          ) : null}
          <div className='olachat-message-body'>
            <div className='olchat-message-name'>
              {isBot ? botName : userName}
            </div>
            <div className='olachat-message-content'>
              {text ? (
                <div
                  className='olachat-message-reply'
                  dangerouslySetInnerHTML={createMessageMarkup(text)}
                />
              ) : null}
            </div>
            {showTimestamp ? (
              <div className='olachat-message-date'>
                {DateParser.format(timestamp * 1000, 'DD MMM h:mm a')}
              </div>
            ) : null}
            {isBot ? (
              <Geo
                location={location}
                needsLocation={needsLocation}
                message={message}
                onSubmit={addMessage}
                isActive={isActive}
              />
            ) : null}
            {isBot ? (
              <SlotOptions
                onSubmit={addMessage}
                updateQueryTerm={updateQueryTerm}
                options={slotOptions}
                isActive={isActive}
                intent={intent}
                message={message}
                log={log}
              />
            ) : null}

            {error ? (
              <FailureButtons
                message={message}
                onSubmit={addMessage}
                isActive={isActive}
              />
            ) : null}
          </div>
        </div>
        {/* / Message flex */}
        <div className='olachat-message-detach'>
          <AnswerMC
            mc={mc}
            payload={{ messageId: message.id, bot: true }}
            loader={isActive ? <Loader theme={theme} /> : null}
            showWhileFiltering
          />
          <Card card={card} results={results} location={location} />
          {isSearchActive ? (
            <SearchResultsMessage
              results={results}
              botName={botName}
              message={message}
              isActive={isActive}
              page={page}
              totalResults={totalResults}
            />
          ) : null}
        </div>
        {isBot ? (
          <MessageFeedback
            isBot={isBot}
            message={message}
            isActive={isActive}
            onSubmit={addMessage}
            updateQueryTerm={updateQueryTerm}
          />
        ) : null}
        {isActive ? (
          <QuickReplies
            onSubmit={addMessage}
            updateQueryTerm={updateQueryTerm}
            theme={theme}
            quickReplies={quickReplies}
          />
        ) : null}
      </div>
    )
  }
}

export default Decorators.withTranslate(Message)
