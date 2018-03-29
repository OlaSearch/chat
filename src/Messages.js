import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Message from './Message'
import TypingIndicator from './TypingIndicator'
import Loader from '@olasearch/icons/lib/loader'
import scrollIntoView from 'dom-scroll-into-view'
import { imagesLoaded } from './utils'

/**
 * Message interface
 * message = {
 *   id,
 *   user_id,
 *   text,
 *   timestamp
 * }
 */

var supportsPassive = false
try {
  var opts = Object.defineProperty({}, 'passive', {
    get () {
      supportsPassive = true
    }
  })
  window.addEventListener('test', null, opts)
} catch (e) {
  /* pass */
}

export default class Messages extends React.Component {
  constructor (props) {
    super(props)
    this.scrollTop = 0
    this.previousScrollTop = 0
    this.scrollHeight = undefined
    this.state = {
      isInfiniteLoading: false,
      shouldRender: false
    }
    this.isComponentMounted = false
  }
  static contextTypes = {
    document: PropTypes.object
  }
  static defaultProps = {
    flipped: true /* Messages start from bottom to top */,
    scrollLoadThreshold: 10,
    messageComponent: null
  }
  componentDidMount () {
    /**
     * Prevent force layout on render
     */
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        this.setState({ shouldRender: true })

        var heightDifference = this.props.flipped
          ? this.messagesEl.scrollHeight - this.messagesEl.clientHeight
          : 0
        this.messagesEl.scrollTop = heightDifference
        this.scrollTop = heightDifference
      })
    })

    // // Unless passive events are supported, we must not hook onScroll event
    // // directly - that will break hardware accelerated scrolling. We poll it
    // // with requestAnimationFrame instead.
    if (supportsPassive) {
      this.messagesEl.addEventListener('scroll', this.onScroll, {
        passive: true
      })
    } else {
      this.rafRequestId = window.requestAnimationFrame(this.pollScroll)
    }

    this.isComponentMounted = true

    /* Add click listener */
    this.messagesEl.addEventListener('click', this.clickListener)
  }
  clickListener = e => {
    if (!e.target || e.target.nodeName !== 'A') return
    let href = e.target.getAttribute('href')

    /**
     * Is this link inside a message? Log it separately
     */
    const isMessageLink = e.target.closest('.olachat-message-reply')
    const messageItem = e.target.closest('.olachat-messages-item')
    const message = this.props.messages
      .filter(({ id }) => id === messageItem.getAttribute('id'))
      .reduce((_, a) => a, null)
    /**
     * If there is a href tag, consider the link as a message
     */
    if (!href) {
      this.props.updateQueryTerm(e.target.text)
      e.preventDefault()
      return this.props.addMessage()
    }

    /* Log */
    if (isMessageLink) {
      this.props.log({
        eventLabel: e.target.text,
        eventCategory: 'message_link',
        eventType: 'C',
        result: {
          title: e.target.text
        } /* Used to quickly find title in admin panel */,
        payload: { bot: true, message }
      })
    }

    /**
     * Final pass. Link has href and it goes to a new page
     * Hide the bot
     */
    setTimeout(() => this.props.setBotStatus(false), 200)
  }
  componentWillUnmount () {
    this.isComponentMounted = false
    if (this.messagesEl) {
      this.messagesEl.removeEventListener('click', this.clickListener)
    }
  }
  componentDidUpdate (prevProps, prevState) {
    /**
     * A new message has been received. We need to scroll
     */
    if (this.props.newMessageId !== prevProps.newMessageId) {
      this.scrollIntoView({ id: this.props.newMessageId })
    }
    /**
     * Always scroll to bottom during initial load
     */
    if (
      prevState.shouldRender !== this.state.shouldRender &&
      this.state.shouldRender
    ) {
      this.scrollIntoView({ id: this.props.newMessageId, position: 'end' })
    }
  }
  pollScroll = () => {
    if (!this.isComponentMounted) return
    this.previousScrollTop = this.messagesEl.scrollTop
    this.onScroll()
    this.rafRequestId = window.requestAnimationFrame(this.pollScroll)
  }
  onScroll = () => {
    var scrollDirection =
      this.messagesEl.scrollTop < this.previousScrollTop ? 'up' : 'down'

    /* Update previous scroll */
    this.previousScrollTop = this.messagesEl.scrollTop

    if (!this.props.flipped && scrollDirection === 'up') return
    if (this.props.flipped && scrollDirection === 'down') return

    if (this.messagesEl.scrollTop !== this.scrollTop) {
      if (this.shouldTriggerLoad(this.messagesEl)) {
        this.setState({ isInfiniteLoading: true })
        var p = this.props.onLoad()
        p.then(() => this.setState({ isInfiniteLoading: false }))
      }
      // the dom is ahead of the state
      this.updateScrollTop()
    }
  }
  isPassedThreshold = (
    flipped,
    scrollLoadThreshold,
    scrollTop,
    scrollHeight,
    clientHeight
  ) => {
    return flipped
      ? scrollTop <= scrollLoadThreshold
      : scrollTop >= scrollHeight - clientHeight - scrollLoadThreshold
  }
  shouldTriggerLoad = domNode => {
    var passedThreshold = this.isPassedThreshold(
      this.props.flipped,
      this.props.scrollLoadThreshold,
      domNode.scrollTop,
      domNode.scrollHeight,
      domNode.clientHeight
    )
    return passedThreshold && !this.state.isInfiniteLoading
  }
  updateScrollTop = () => {
    var newScrollTop =
      this.messagesEl.scrollTop +
      (this.props.flipped
        ? this.messagesEl.scrollHeight - (this.scrollHeight || 0)
        : 0)
    var scrollHeightDifference = this.scrollHeight
      ? this.scrollHeight - this.messagesEl.scrollHeight
      : 0
    // if something was removed from list we need to include this difference in new scroll top
    // if (this.props.flipped && scrollHeightDifference > 0) {
    //   newScrollTop += scrollHeightDifference
    // }
    if (newScrollTop !== this.messagesEl.scrollTop) {
      /* Not requried */
      // this.messagesEl.scrollTop = newScrollTop
    }
    this.scrollTop = this.messagesEl.scrollTop
    this.scrollHeight = this.messagesEl.scrollHeight
  }
  /**
   * Scroll in to view. Pass the message ID
   */
  scrollIntoView = ({ id, position = 'start' }) => {
    const doc = this.context.document || document
    const domId = id
    const domNode = doc.getElementById(domId)
    if (!domNode) return
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        /* Fixes a bug in Mobile devices where keyboard loses focus */
        scrollIntoView(domNode, this.messagesEl, {
          onlyScrollIfNeeded: true,
          alignWithTop: position !== 'end'
        })
      })
    })
  }
  registerRef = el => {
    this.messagesEl = el
  }
  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.messages !== this.props.messages ||
      nextProps.newMessageId !== this.props.newMessageId ||
      nextState !== this.state ||
      nextProps.theme !== this.props.theme
    )
  }
  render () {
    let { messages, flipped, messageComponent, theme } = this.props
    let { isInfiniteLoading } = this.state
    if (!flipped) {
      messages = messages.slice().reverse()
    }
    let loadingSpinner = isInfiniteLoading ? <div>Loading</div> : null
    return (
      <div className='olachat-messages' ref={this.registerRef}>
        {this.state.shouldRender ? (
          <div className='olachat-messages-wrapper'>
            <div className='olachat-messages-list'>
              {messages.map((message, idx) => {
                return (
                  <div
                    key={message.id}
                    id={message.id}
                    className='olachat-messages-item'
                  >
                    {message.isTyping ? (
                      <TypingIndicator avatarBot={this.props.avatarBot} />
                    ) : (
                      <Message
                        avatarBot={this.props.avatarBot}
                        avatarUser={this.props.avatarUser}
                        message={message}
                        addMessage={this.props.addMessage}
                        isActive={idx === messages.length - 1}
                        botName={this.props.botName}
                        userName={this.props.userName}
                        log={this.props.log}
                        location={this.props.location}
                        isMounted={this.isComponentMounted}
                        updateQueryTerm={this.props.updateQueryTerm}
                        theme={theme}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className='olachat-message-loader'>
            <Loader />
          </div>
        )}
        <style jsx>
          {`
            .olachat-message-loader {
              color: ${theme.primaryColor};
            }
            .olachat-messages :global(.olachat-message-reply) {
              background-color: ${theme.chatUserMessageBackground};
              color: ${theme.chatUserMessageColor};
            }
            .olachat-messages
              :global(.olachat-message-bot .olachat-message-reply) {
              background-color: ${theme.chatBotMessageBackground};
              color: ${theme.chatBotMessageColor};
            }
            .olachat-messages
              :global(.olachat-message-error .olachat-message-reply) {
              background: ${theme.dangerColor};
              color: white;
            }
            /* Slot */
            .olachat-messages :global(.olachat-slots-button),
            .olachat-messages :global(.olachat-slots-button:disabled:hover) {
              color: ${theme.chatBotSlotButtonColor};
              background-color: ${theme.chatBotSlotButtonBackground};
              border-color: ${theme.chatBotSlotButtonColor};
              line-height: 1.5;
            }
            .olachat-messages :global(.olachat-slots-button:hover) {
              background-color: ${theme.chatBotSlotButtonColor};
              color: ${theme.chatBotSlotButtonBackground};
            }

            /* Request geo location button */
            .olachat-messages :global(.ola-link-geo),
            .olachat-messages :global(.ola-link-geo:hover),
            .olachat-messages :global(.ola-link-geo:focus),
            .olachat-messages :global(.ola-link-geo:disabled:hover) {
              color: ${theme.primaryButtonColor};
              background-color: ${theme.primaryButtonBackground};
            }
            .olachat-messages :global(.typing-indicator span) {
              background-color: ${theme.primaryColor};
            }
            .olachat-messages :global(.ola-btn-pill) {
              font-size: ${theme.smallFontSize};
              padding: 4px 6px;
            }

            /* Links inside message */
            .olachat-messages :global(.olachat-message-reply a) {
              color: ${theme.chatLinkColor};
            }
            /* Quick replies */
            .olachat-messages :global(.olachat-quickreplies-button) {
              box-shadow: inset 0 0 0 1px ${theme.chatQuickReplyColor};
              color: ${theme.chatQuickReplyColor};
              border-color: ${theme.chatQuickReplyColor};
              line-height: 1.5;
            }
            .olachat-messages :global(.olachat-quickreplies-button:hover) {
              background: ${theme.chatQuickReplyHoverBackground};
              color: ${theme.chatQuickReplyHoverColor};
            }
          `}
        </style>
      </div>
    )
  }
}
