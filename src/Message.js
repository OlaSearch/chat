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
      location,
      translate,
      updateQueryTerm
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
    let needsLocation = isActive ? message.location : message.location

    /**
     * Do not render SearchResultsMessage unless required. Takes a perf hit
     */
    let isSearchActive = false
    /**
     * If search is active && has results, the reply from the bot is { answer: { search : { title } } }
     * When MC is being loaded isLoadingMC, should we hide search results ?
     *
     * We are not checking for `search` key in `answer` because search should work without Intent Engine
     */
    // console.log(this.props.message)
    if (results && results.length) {
      isSearchActive = true
      /* Bot reply */
      text = `<p>
        ${
  search
    ? suggestedTerm
      ? translate('could_not_find', { originalQuery, suggestedTerm })
      : search.title
    : translate('here_some_result')
}
      </p>`
    } else {
      /* No results */
      text =
        text ||
        `<p>${search ? search.no_result : translate('sorry_no_result')}</p>`
    }

    return (
      <div className={messageClass}>
        {/* Message flex */}
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
              {text ? (
                <div
                  className='olachat-message-reply'
                  dangerouslySetInnerHTML={createMessageMarkup(text)}
                />
              ) : null}
              <AnswerMC
                mc={mc}
                payload={{ messageId: message.id, bot: true }}
                loader={isActive ? <Loader /> : null}
              />
              <Card card={card} />
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
            <div className='olachat-message-date'>
              {DateParser.format(timestamp * 1000, 'DD MMM h:mm a')}
            </div>
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
            {isBot && spellSuggestions && spellSuggestions.length ? (
              <TopicSuggestions
                onSubmit={addMessage}
                options={spellSuggestions.map(({ term }) => ({ label: term }))}
                isActive={isActive}
                updateQueryTerm={updateQueryTerm}
              />
            ) : null}
            {error ? (
              <FailureButtons
                message={message}
                onSubmit={addMessage}
                isActive={isActive}
              />
            ) : null}
            {isBot ? (
              <MessageFeedback
                isBot={isBot}
                message={message}
                isActive={isActive}
                onSubmit={addMessage}
                updateQueryTerm={updateQueryTerm}
              />
            ) : null}
          </div>
        </div>
        {/* / Message flex */}
      </div>
    )
  }
}

export default Decorators.withTranslate(Message)
