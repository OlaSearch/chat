import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { activateFeedback } from './actions'

class FeedBack extends React.Component {
  render () {
    let { isActive, isBot, isTyping, messageIdx, message: { awaitingUserInput } } = this.props
    if (!isActive || !isBot || isTyping || !awaitingUserInput || messageIdx < 1) return null
    return (
      <div className='olachat-feedback'>
        <a onClick={this.props.activateFeedback}>Something not right?</a>
      </div>
    )
  }
}

module.exports = connect(null, { activateFeedback })(FeedBack)
