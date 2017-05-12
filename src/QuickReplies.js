import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'olasearch'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

class QuickReplies extends Component {
  handleClick = (label) => {
    this.props.updateQueryTerm(label)
    this.props.onSubmit()
  };
  render () {
    let { options } = this.props
    if (!options || !options.length) return null
    let replies = options.map(({ label }, idx) => <QuickReplyButton key={idx} label={label} handleClick={this.handleClick} />)
    return (
      <div className='olachat-qreply'>
        <ReactCSSTransitionGroup
          transitionName='qreply'
          transitionAppear
          transitionEnterTimeout={300}
          transitionLeaveTimeout={100}
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

const QuickReplyButton = ({ label, handleClick }) => {
  function onClick () {
    handleClick(label)
  }
  return (
    <button
      className='olachat-qreply-button'
      type='button'
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default connect(null, { updateQueryTerm: Actions.Search.updateQueryTerm })(QuickReplies)
