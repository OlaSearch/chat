import React from 'react'
import { connect } from 'react-redux'
import { updateBotQueryTerm } from './actions'
import { Actions, Decorators } from '@olasearch/core'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'
// import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

class QuickReplies extends React.Component {
  handleClick = label => {
    this.props.updateQueryTerm(label)
    this.props.onSubmit()
    this.props.log({
      eventCategory: 'quick_reply',
      eventLabel: label,
      eventAction: 'click',
      eventType: 'C',
      result: { title: label },
      payload: { bot: true }
    })
  }
  static defaultProps = {
    quickReplies: []
  }
  render() {
    let { quickReplies } = this.props
    if (!quickReplies || !quickReplies.length) return null
    let replies = quickReplies.map(({ label }, idx) => (
      <CSSTransition
        key={idx}
        timeout={{ enter: 500, exit: 300 }}
        classNames="slots"
      >
        <QuickReplyButton handleClick={this.handleClick} label={label} />
      </CSSTransition>
    ))
    return (
      <div className="olachat-smartsuggestions">
        <TransitionGroup className="olachat-smartsuggestions-list" appear>
          {replies}
        </TransitionGroup>
      </div>
    )
  }
}

function QuickReplyButton({ label, handleClick, isActive }) {
  function onClick() {
    handleClick(label)
  }

  return (
    <button
      className="olachat-smartsuggestions-button"
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function mapStateToProps(state) {
  let len = state.Conversation.messages.length
  let latestMsg = state.Conversation.messages[len - 1]
  return {
    quickReplies: latestMsg ? latestMsg.quick_replies : null
  }
}

export default connect(mapStateToProps, {
  updateQueryTerm: updateBotQueryTerm
})(Decorators.withLogger(QuickReplies))
