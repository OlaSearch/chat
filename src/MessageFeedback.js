import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions } from '@olasearch/core'
import {
  activateFeedback,
  disabledFeedback,
  setFeedbackMessage,
  setFeedbackRating,
  logFeedback,
  updateBotQueryTerm
} from './actions'
import {
  IGNORE_FEEDBACK_INTENTS,
  EMOJI_POSITIVE,
  EMOJI_NEGATIVE
} from './Settings'
import { checkIfAwaitingResponse } from './utils';

class MessageFeedback extends React.Component {
  static contextTypes = {
    config: PropTypes.object
  }
  handlePositive = (e) => {
    this.props.updateQueryTerm(EMOJI_POSITIVE)
    this.props.setFeedbackMessage(this.props.message.id)
    this.props.setFeedbackRating(EMOJI_POSITIVE)
    this.props.onSubmit({ intent: 'OLA.FeedbackIntent' })
  }
  handleNegative = () => {
    this.props.updateQueryTerm(EMOJI_NEGATIVE)
    this.props.setFeedbackMessage(this.props.message.id)
    this.props.setFeedbackRating(EMOJI_NEGATIVE)
    this.props.onSubmit({ intent: 'OLA.FeedbackIntent' })
  }
  render () {
    let {
      isActive,
      isBot,
      message: { awaitingUserInput, intent, mc }
    } = this.props

    /* If user is typing */
    if (!isActive || !isBot || !awaitingUserInput) return null
    /* Check if ignored intents or MC */
    if (intent === this.context.config.initialIntent) return null
    if (IGNORE_FEEDBACK_INTENTS.indexOf(intent) !== -1 && !mc) return null

    return (
      <div className='olachat-feedback'>
        <button type='button' onClick={this.handlePositive} className='olachat-feedback-positive'>
          <span className='emoji-thumbs-up' />
        </button>
        <button type='button' onClick={this.handleNegative} className='olachat-feedback-negative'>
          <span className='emoji-thumbs-down' />
        </button>
      </div>
    )
  }
}

module.exports = connect(null, {
  activateFeedback,
  disabledFeedback,
  setFeedbackMessage,
  setFeedbackRating,
  logFeedback,
  updateQueryTerm: updateBotQueryTerm
})(MessageFeedback)
