import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'olasearch'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

const DISAMBIGUATION_INTENT_NAME = 'OLA.DisambiguateIntent'
class SlotOptions extends Component {
  handleClick = ({ label, value }) => {
    let { intent } = this.props
    let args = intent === DISAMBIGUATION_INTENT_NAME ? { intent: value } : {}
    this.props.updateQueryTerm(label)
    this.props.onSubmit(args)
  };
  render () {
    let { options, isActive } = this.props
    if (!options || !options.length) return null
    let replies = options.map(({ label, value }, idx) => <CSSTransition key={idx} timeout={{ enter: 300, exit: 300 }} classNames='qreply'><QuickReplyButton label={label} value={value} isActive={isActive} handleClick={this.handleClick} /></CSSTransition>)

    // if (!isActive) replies = null
    return (
      <div className='olachat-qreply'>
        <TransitionGroup
          appear
          className='olachat-qreply-list'
        >
        {replies}
        </TransitionGroup>
      </div>
    )
  }
}

const QuickReplyButton = ({ label, value, handleClick, isActive }) => {
  function onClick () {
    handleClick({ label, value })
  }
  return (
    <button
      className='olachat-qreply-button'
      type='button'
      onClick={onClick}
      disabled={!isActive}
    >
      {label}
    </button>
  )
}

export default connect(null, { updateQueryTerm: Actions.Search.updateQueryTerm })(SlotOptions)
