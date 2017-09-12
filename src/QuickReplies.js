import React from 'react'
import { connect } from 'react-redux'
import { Actions, Decorators } from 'olasearch'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

class QuickReplies extends React.Component {
  handleClick = (label) => {
    this.props.updateQueryTerm(label)
    this.props.onSubmit()
    this.props.log({
      eventCategory: 'quick_reply',
      eventLabel: label,
      eventAction: 'click',
      eventType: 'C'
    })
  };
  static defaultProps = {
    quickReplies: []
  };
  render () {
    let { quickReplies } = this.props
    if (!quickReplies || !quickReplies.length) return null
    let replies = quickReplies.map(({ label }, idx) => <QuickReplyButton key={idx} handleClick={this.handleClick} label={label} />)
    return (
      <div className='olachat-smartsuggestions'>
        <ReactCSSTransitionGroup
          transitionName='qreply'
          transitionAppear
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
          transitionAppearTimeout={300}
          component='div'
          className='olachat-smartsuggestions-list'
        >
          {replies}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

const QuickReplyButton = ({ label, handleClick, isActive }) => {
  function onClick () {
    handleClick(label)
  }

  return (
    <button
      className='olachat-smartsuggestions-button'
      type='button'
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function mapStateToProps (state) {
  let len = state.Conversation.messages.length
  let latestMsg = state.Conversation.messages[len - 1]
  return {
    quickReplies: latestMsg ? latestMsg.quick_replies : null
  }
}

export default connect(mapStateToProps, { updateQueryTerm: Actions.Search.updateQueryTerm })(Decorators.withLogger(QuickReplies))
