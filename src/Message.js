import React from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'
import Avatar from './Avatar'
import Card from './Card'
import { DateParser, AnswerMC, Decorators } from '@olasearch/core'
import SlotOptions from './SlotOptions'
import Geo from './Geo'
import SearchResults from './SearchResults'
import MessageFeedback from './MessageFeedback'
import TopicSuggestions from './TopicSuggestions'
import Loader from './Loader'
import FailureButtons from './FailureButtons'
import QuickReplies from './QuickReplies'
import { createMessageMarkup } from './utils'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import Transition from 'react-transition-group/Transition'

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
    showTimestamp: false,
    chatBotMessageTimeout: 400
  }
  scrollIntoView = node => {
    this.props.scrollIntoView({ id: this.props.message.id })
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
      showTimestamp,
      enableFeedback,
      chatBotMessageTimeout
    } = this.props
    let {
      userId,
      timestamp,
      awaitingUserInput,
      fulfilled,
      card,
      slot,
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
      quick_replies: quickReplies,
      sequence
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
     * search => only exists if intent engine is ON
     */
    if (isBot) {
      if (results && results.length) {
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

    const duration = isActive ? 300 : 0
    const timeout = isActive ? chatBotMessageTimeout : 0
    const defaultStyle = {
      transition: `all ${duration}ms ease-in-out`,
      opacity: 0,
      maxHeight: 0,
      overflow: 'hidden'
    }

    const transitionStyles = {
      entering: { opacity: 0, maxHeight: 0, overflow: 'hidden' },
      exited: { opacity: 0, maxHeight: 0, overflow: 'hidden' },
      entered: { opacity: 1, maxHeight: 'none', overflow: 'visible' }
    }
    const messageLen = sequence.message.filter(({ type }) => type === 'text')
      .length

    const messageComponents = sequence.message.map(
      ({ type, content, search }, idx) => {
        /**
         * Make sure messages and slots appear together
         * @type {Boolean}
         */
        const isSlot = type === 'slot'
        return (
          <Transition
            key={idx}
            timeout={isSlot ? (idx - 1) * timeout : idx * timeout}
            classNames='message-animation'
            onEntered={this.scrollIntoView}
            mountOnEnter
            unmountOnExit
          >
            {state => {
              return (
                <div
                  style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                  }}
                >
                  {type === 'text' ? (
                    search ? (
                      <div
                        className='olachat-message-reply'
                        dangerouslySetInnerHTML={createMessageMarkup(text)}
                      />
                    ) : (
                      <div
                        className='olachat-message-reply'
                        dangerouslySetInnerHTML={createMessageMarkup(content)}
                      />
                    )
                  ) : null}
                  {isSlot ? (
                    <SlotOptions
                      onSubmit={addMessage}
                      updateQueryTerm={updateQueryTerm}
                      slot={slot}
                      isActive={isActive}
                      intent={intent}
                      log={log}
                    />
                  ) : null}
                </div>
              )
            }}
          </Transition>
        )
      }
    )
    const detachedComponents =
      sequence.detached &&
      sequence.detached.map(({ type }, idx) => {
        return (
          <Transition
            key={idx}
            timeout={(messageComponents.length + idx) * timeout}
            classNames='message-animation'
            mountOnEnter
            unmountOnExit
            onEntered={this.scrollIntoView}
          >
            {state => {
              return (
                <div
                  style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                  }}
                >
                  {type === 'mc' ? (
                    <AnswerMC
                      mc={mc}
                      payload={{ messageId: message.id, bot: true }}
                      loader={isActive ? <Loader theme={theme} /> : null}
                      showWhileFiltering
                    />
                  ) : null}
                  {type === 'card' ? (
                    <Card
                      card={card}
                      results={results}
                      location={location}
                      onSelect={addMessage}
                    />
                  ) : null}
                  {type === 'search' ? (
                    <SearchResults
                      results={results}
                      botName={botName}
                      message={message}
                      isActive={isActive}
                      page={page}
                      totalResults={totalResults}
                    />
                  ) : null}
                </div>
              )
            }}
          </Transition>
        )
      })

    const outerComponents =
      isActive &&
      sequence.outer &&
      sequence.outer.map(({ type }, idx) => {
        return (
          <Transition
            key={idx}
            timeout={{
              enter:
                (messageComponents.length + detachedComponents.length + idx) *
                timeout,
              exit: 0
            }}
            classNames='message-animation'
            onEntered={this.scrollIntoView}
            mountOnEnter
            unmountOnExit
          >
            {state => {
              return (
                <div
                  style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                  }}
                >
                  {type === 'quick_replies' && isActive ? (
                    <QuickReplies
                      onSubmit={addMessage}
                      updateQueryTerm={updateQueryTerm}
                      theme={theme}
                      quickReplies={quickReplies}
                    />
                  ) : null}
                </div>
              )
            }}
          </Transition>
        )
      })

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
              <TransitionGroup appear>{messageComponents}</TransitionGroup>
            </div>
            {showTimestamp ? (
              <div className='olachat-message-date'>
                {DateParser.format(timestamp * 1000, 'DD MMM h:mm a')}
              </div>
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
          <TransitionGroup appear>{detachedComponents}</TransitionGroup>
        </div>
        {isBot && enableFeedback ? (
          <MessageFeedback
            isBot={isBot}
            message={message}
            isActive={isActive}
            onSubmit={addMessage}
            updateQueryTerm={updateQueryTerm}
          />
        ) : null}
        <TransitionGroup appear>{outerComponents}</TransitionGroup>
      </div>
    )
  }
}

export default Decorators.withTranslate(Message)
