import React from 'react'
import { connect } from 'react-redux'
import { Decorators } from '@olasearch/core'
import { EMPTY_ARRAY } from './Settings'

/**
 * Quick replies
 * @example ./../styleguide/QuickReplies.md
 */
class QuickReplies extends React.PureComponent {
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
      result: { title: label } /* Used to quickly find title in admin panel */,
      payload: { bot: true }
    })
  }
  static defaultProps = {
    quickReplies: EMPTY_ARRAY
  }
  render () {
    let { quickReplies } = this.props
    if (!quickReplies.length) return null
    return (
      <div className='olachat-quickreplies'>
        <div className='olachat-quickreplies-list'>
          {quickReplies.map(({ label, intent }, idx) => (
            <QuickReplyButton
              key={idx}
              handleClick={this.handleClick}
              intent={intent}
              label={label}
            />
          ))}
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
      className='olachat-quickreplies-button'
      type='button'
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Decorators.withLogger(QuickReplies)
