import React from 'react'
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

class MessageFeedback extends React.Component {
  handlePositive = () => {
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
  render() {
    let {
      isActive,
      isBot,
      isTyping,
      messageIdx,
      message: { awaitingUserInput, intent, mc }
    } = this.props

    /* Current message */
    if (messageIdx < 1) return null
    /* If user is typing */
    if (!isActive || !isBot || isTyping || !awaitingUserInput) return null
    /* Check if ignored intents or MC */
    if (IGNORE_FEEDBACK_INTENTS.indexOf(intent) !== -1 && !mc) return null

    return (
      <div className="olachat-feedback">
        <a onClick={this.handlePositive} className="olachat-feedback-positive">
          <span className="emoji-thumbs-up" />
        </a>
        <a onClick={this.handleNegative} className="olachat-feedback-negative">
          <span className="emoji-thumbs-down" />
        </a>
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
  updateQueryTerm: updateBotQueryTerm,
})(MessageFeedback)
