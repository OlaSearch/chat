import React from 'react'
import ReactDOM from 'react-dom'
import Message from './Message'
import TypingIndicator from './TypingIndicator'
import classNames from 'classnames'
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

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
} catch (e) { /* pass */ }

class Messages extends React.Component {
  constructor (props) {
    super(props)
    this.scrollTop = 0
    this.previousScrollTop = 0
    this.scrollHeight = undefined
    this.state = {
      isInfiniteLoading: false
    }
  }
  static defaultProps = {
    flipped: false,
    scrollLoadThreshold: 10,
    messageComponent: null
  };
  componentDidMount () {
    var scrollableDomEl = ReactDOM.findDOMNode(this)
    // If there are not yet any children (they are still loading),
    // this is a no-op as we are at both the top and bottom of empty viewport
    var heightDifference = this.props.flipped
        ? scrollableDomEl.scrollHeight - scrollableDomEl.clientHeight
        : 0

    scrollableDomEl.scrollTop = heightDifference
    this.scrollTop = heightDifference

    // Unless passive events are supported, we must not hook onScroll event
    // directly - that will break hardware accelerated scrolling. We poll it
    // with requestAnimationFrame instead.
    if (supportsPassive) {
      scrollableDomEl.addEventListener('scroll', this.onScroll, { passive: true })
    } else {
      this.rafRequestId = window.requestAnimationFrame(this.pollScroll)
    }
  }
  componentDidUpdate (nextProps) {
    this.updateScrollTop()
  }
  pollScroll = () => {
    this.previousScrollTop = ReactDOM.findDOMNode(this).scrollTop
    this.onScroll()
    this.rafRequestId = window.requestAnimationFrame(this.pollScroll)
  };
  onScroll = () => {
    var domNode = ReactDOM.findDOMNode(this)
    var scrollDirection = domNode.scrollTop < this.previousScrollTop ? 'up' : 'down'

    /* Update previous scroll */
    this.previousScrollTop = domNode.scrollTop

    if (!this.props.flipped && scrollDirection === 'up') return
    if (this.props.flipped && scrollDirection === 'down') return

    if (domNode.scrollTop !== this.scrollTop) {
      if (this.shouldTriggerLoad(domNode)) {
        this.setState({ isInfiniteLoading: true })
        var p = this.props.onLoad()
        p.then(() => this.setState({ isInfiniteLoading: false }))
      }
      // the dom is ahead of the state
      this.updateScrollTop()
    }
  };
  isPassedThreshold = (flipped, scrollLoadThreshold, scrollTop, scrollHeight, clientHeight) => {
    return flipped
        ? scrollTop <= scrollLoadThreshold
        : scrollTop >= (scrollHeight - clientHeight - scrollLoadThreshold)
  };
  shouldTriggerLoad = (domNode) => {
    var passedThreshold = this.isPassedThreshold(
        this.props.flipped,
        this.props.scrollLoadThreshold,
        domNode.scrollTop,
        domNode.scrollHeight,
        domNode.clientHeight)
    return passedThreshold && !this.state.isLoading
  };
  updateScrollTop = () => {
    var scrollableDomEl = ReactDOM.findDOMNode(this)
    var newScrollTop = scrollableDomEl.scrollTop + (this.props.flipped
        ? scrollableDomEl.scrollHeight - (this.scrollHeight || 0)
        : 0)
    var scrollHeightDifference = this.scrollHeight ? this.scrollHeight - scrollableDomEl.scrollHeight : 0

    // if something was removed from list we need to include this difference in new scroll top
    if (this.props.flipped && scrollHeightDifference > 0) {
      newScrollTop += scrollHeightDifference
    }
    if (newScrollTop !== scrollableDomEl.scrollTop) {
      scrollableDomEl.scrollTop = newScrollTop
    }
    this.scrollTop = scrollableDomEl.scrollTop
    this.scrollHeight = scrollableDomEl.scrollHeight
  };
  scrollToView = () => {
    var scrollableDomEl = ReactDOM.findDOMNode(this)
    scrollableDomEl.scrollTop = this.props.flipped ? this.scrollHeight : 0
  };
  render () {
    let { messages, flipped, messageComponent, isTyping } = this.props
    let { isInfiniteLoading } = this.state
    if (!flipped) {
      messages = messages.slice().reverse()
    }
    let loadingSpinner = isInfiniteLoading ? <div>Loading</div> : null
    let messagesComponent = messageComponent
      ? messages.map(messageComponent)
      : messages.map((message, idx) => {
        let nextMsgs = messages.slice(idx)
        let isSearchActive = nextMsgs.filter((msg) => !msg.userId).length === nextMsgs.length
        return (
          <Message
            avatarBot={this.props.avatarBot}
            avatarUser={this.props.avatarUser}
            message={message}
            key={message.id}
            addMessage={this.props.addMessage}
            isActive={idx === messages.length - 1}
            messageIdx={idx}
            isSearchActive={isSearchActive}
            botName={this.props.botName}
            userName={this.props.userName}
            isTyping={isTyping}
          />
        )
      }
    )
    let overlayKlass = classNames('olachat-messages-overlay', {
      'olachat-messages-overlay-active': this.props.feedbackActive
    })
    let messagesKlass = classNames('olachat-messages', {
      'olachat-messages-feedback-active': this.props.feedbackActive
    })

    return (
      <div className={messagesKlass}>
        {/*<div className={overlayKlass} onClick={this.props.dismissModal} /> */}
        <div className='olachat-messages-wrapper'>
          {/* flipped ? loadingSpinner : null */}
          {isTyping ? flipped ? null : <TypingIndicator avatarBot={this.props.avatarBot} /> : null}
          <ReactCSSTransitionGroup
            transitionName='messages'
            transitionAppear
            transitionAppearTimeout={300}
            transitionEnterTimeout={500}
            transitionLeave={false}
            component='div'
            className='olachat-messages-list'
          >
            {messagesComponent}
          </ReactCSSTransitionGroup>
          {flipped ? null : loadingSpinner}
          {isTyping ? flipped ? <ReactCSSTransitionGroup transitionEnterTimeout={300} transitionLeave={false} transitionAppearTimeout={300} transitionAppear transitionName='messages'><TypingIndicator avatarBot={this.props.avatarBot} /></ReactCSSTransitionGroup> : null : null}
        </div>
      </div>
    )
  }
}

export default Messages
