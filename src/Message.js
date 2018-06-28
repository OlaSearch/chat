import React from 'react'
import cx from 'classnames'
import Avatar from './Avatar'
import Card from './Card'
import { DateParser, AnswerMC, Decorators } from '@olasearch/core'
import SlotOptions from './SlotOptions'
import Geo from './Geo'
import SearchResults from './SearchResults'
import MessageFeedback from './MessageFeedback'
import Loader from './Loader'
import FailureButtons from './FailureButtons'
import QuickReplies from './QuickReplies'
import MessageActions from './MessageActions'
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
  shouldComponentUpdate (nextProps) {
    return (
      this.props.message !== nextProps.message ||
      this.props.isActive !== nextProps.isActive ||
      this.props.theme !== nextProps.theme
    )
  }
  static defaultProps = {
    showTimestamp: false,
    chatBotMessageTimeout: 600
  }
  scrollIntoView = () => {
    this.props.scrollIntoView({ id: this.props.message.id })
  }
  render () {
    const {
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
      chatBotMessageTimeout,
      intentsFeedbackDisabled,
      chatBotMessageActions,
      isDesktop
    } = this.props
    const {
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
      // spellSuggestions /* Spell suggestions */,
      suggestedTerm /* Term that was searched for */,
      originalQuery,
      error,
      context = {},
      // payload,
      quick_replies: quickReplies,
      sequence,
      stale
    } = message
    const isBot = !userId
    var text = isBot ? message.reply : message.label || message.message

    const messageClass = cx('olachat-message', {
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
    const needsLocation = message.location && !context.location

    /**
     * Show feedback
     */
    const showFeedback =
      isBot && enableFeedback && intentsFeedbackDisabled.indexOf(intent) === -1

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

    const duration = isActive && !stale ? 300 : 0
    const timeout = isActive && !stale ? chatBotMessageTimeout : 0
    const defaultStyle = {
      transition: `all ${duration}ms ease-in-out`,
      opacity: 0,
      maxHeight: 0,
      overflow: 'hidden'
    }
    const defaultSlideUpStyle = {
      transition: `all ${duration}ms ease-in-out`,
      transform: 'translate3d(0, 10px, 0)',
      opacity: 0,
      maxHeight: 0,
      overflow: 'hidden'
    }
    const transitionSlideUpStyle = {
      entering: {
        opacity: 0,
        maxHeight: 0,
        transform: 'translate3d(0, 10px, 0)',
        overflow: 'hidden'
      },
      exited: {},
      entered: {
        opacity: 1,
        maxHeight: 'none',
        overflow: 'visible',
        transform: 'translate3d(0, 0, 0)'
      }
    }

    const transitionStyles = {
      entering: { opacity: 0 },
      exited: { opacity: 0 },
      entered: { opacity: 1, maxHeight: 'none', overflow: 'visible' }
    }

    const messageLen = sequence.message && sequence.message.length
    const messageComponents = sequence.message.map(
      ({ type, content, search }, idx) => {
        const showActions =
          isBot && chatBotMessageActions
            ? isDesktop ? idx === messageLen - 1 : idx === 0
            : false
        return (
          <Transition
            key={idx}
            timeout={idx * timeout}
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
                  className='olachat-message-reply-outer'
                >
                  {type === 'text' ? (
                    search ? (
                      <div className='olachat-message-reply'>
                        <div
                          dangerouslySetInnerHTML={createMessageMarkup(
                            text || translate('chat_sorry_no_result'),
                            {
                              convertLinebreak: !isBot
                            }
                          )}
                        />
                        <div className='olachat-message-arrow' />
                      </div>
                    ) : (
                      <div className='olachat-message-reply'>
                        <div
                          dangerouslySetInnerHTML={createMessageMarkup(
                            content,
                            { convertLinebreak: !isBot }
                          )}
                        />
                        <div className='olachat-message-arrow' />
                        {showActions ? (
                          <MessageActions
                            result={message}
                            position='top-left'
                            document={this.props.document}
                          />
                        ) : null}
                      </div>
                    )
                  ) : null}
                </div>
              )
            }}
          </Transition>
        )
      }
    )
    var hasSlot = false
    const hasMc =
      sequence.detached && sequence.detached.some(({ type }) => type === 'mc')
    const detachedComponents =
      sequence.detached &&
      sequence.detached.map(({ type }, idx) => {
        const isSlot = type === 'slot'
        if (isSlot) hasSlot = true
        /**
         * Show MC immediately
         * MC can take more time to load because of 1 additional http call
         */
        if (hasMc) idx = idx - 1
        const seqTimeout = isSlot
          ? (messageLen - 1 + idx) * timeout
          : (messageLen + idx) * timeout
        return (
          <Transition
            key={idx}
            timeout={seqTimeout}
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
                      document={this.props.document}
                      window={this.props.window}
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
                      document={this.props.document}
                      isDesktop={isDesktop}
                    />
                  ) : null}
                  {type === 'slot' ? (
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
      })

    const detachedLen = detachedComponents && detachedComponents.length
    const outerComponents =
      isActive &&
      sequence.outer &&
      sequence.outer.map(({ type }, idx) => {
        /**
         * Removed detachedLen
         */
        const outerTimeout =
          ((hasSlot || (messageLen === 1 && !detachedLen)
            ? messageLen - 1
            : messageLen) +
            idx) *
          timeout
        return (
          <Transition
            key={idx}
            timeout={{
              /**
               * Check this TODO
               */
              enter: outerTimeout,
              exit: 0
            }}
            onEntered={this.scrollIntoView}
            mountOnEnter
            unmountOnExit
          >
            {state => {
              return (
                <div
                  style={{
                    ...defaultSlideUpStyle,
                    ...transitionSlideUpStyle[state]
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
        {messageLen ? (
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
        ) : null}
        {/* / Message flex */}
        <div className='olachat-message-detach'>
          <TransitionGroup appear>{detachedComponents}</TransitionGroup>
        </div>
        {showFeedback ? (
          <MessageFeedback
            isBot={isBot}
            message={message}
            isActive={isActive}
            onSubmit={addMessage}
            updateQueryTerm={updateQueryTerm}
          />
        ) : null}
        <div className='olachat-message-outer'>
          <TransitionGroup appear>{outerComponents}</TransitionGroup>
        </div>
      </div>
    )
  }
}

export default Decorators.withTranslate(Message)
