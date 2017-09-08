import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'olasearch'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

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
    let replies = options.map(({ label, value }, idx) => <QuickReplyButton key={idx} label={label} value={value} isActive={isActive} handleClick={this.handleClick} />)

    // if (!isActive) replies = null
    return (
      <div className='olachat-qreply'>
        <ReactCSSTransitionGroup
          transitionName='qreply'
          transitionAppear
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
          transitionAppearTimeout={300}
          component='div'
          className='olachat-qreply-list'
        >
          {replies}
        </ReactCSSTransitionGroup>
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
