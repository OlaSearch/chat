import React from 'react'
import { connect } from 'react-redux'
import { updateBotQueryTerm } from './actions'
import { Decorators } from '@olasearch/core'
import { EMPTY_ARRAY } from './Settings'

class QuickReplies extends React.Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.quickReplies !== this.props.quickReplies 
  }
  handleClick = (label, intent) => {
    let args = {}
    if (intent) {
      args = { intent }
    }
    this.props.updateQueryTerm(label)
    this.props.onSubmit(args)
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
  render () {
    let { quickReplies } = this.props
    if (!quickReplies || !quickReplies.length) return null
    let replies = quickReplies.map(({ label, intent }, idx) => (
      <QuickReplyButton key={idx} handleClick={this.handleClick} intent={intent} label={label} />
    ))
    return (
      <div className='olachat-smartsuggestions'>
        <div className='olachat-smartsuggestions-list'>
          {replies}
        </div>
      </div>
    )
  }
}

function QuickReplyButton ({ label, intent, handleClick, isActive }) {
  function onClick () {
    handleClick(label, intent)
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
    quickReplies: latestMsg ? latestMsg.quick_replies : EMPTY_ARRAY
  }
}

export default Decorators.withLogger(connect(mapStateToProps, {
  updateQueryTerm: updateBotQueryTerm
})(QuickReplies))
