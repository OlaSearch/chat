import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions, Decorators } from '@olasearch/core'
import { setFeedbackMessage, setFeedbackRating } from './actions'
import {
  IGNORE_FEEDBACK_INTENTS,
  EMOJI_POSITIVE,
  EMOJI_NEGATIVE
} from './Settings'
import { checkIfAwaitingResponse } from './utils'

/**
 * Shows a thumbs up/down feedback
 * @example ./../styleguide/MessageFeedback.md
 */
class MessageFeedback extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool
  }
  handlePositive = e => {
    /* Update the query term */
    this.props.updateQueryTerm(EMOJI_POSITIVE)
    /* Set the message ID for later logging */
    this.props.setFeedbackMessage(this.props.message.id)
    /* Set positive or negative feedback */
    this.props.setFeedbackRating(EMOJI_POSITIVE)
    /* Send the message */
    this.props.onSubmit({ intent: 'OLA.FeedbackIntent' })
  }
  handleNegative = () => {
    /* Update the query term */
    this.props.updateQueryTerm(EMOJI_NEGATIVE)
    /* Set the message ID for later logging */
    this.props.setFeedbackMessage(this.props.message.id)
    /* Set positive or negative feedback */
    this.props.setFeedbackRating(EMOJI_NEGATIVE)
    /* Send the message */
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
    if (intent && intent === this.props.config.initialIntent) return null
    if (IGNORE_FEEDBACK_INTENTS.indexOf(intent) !== -1 && !mc) return null

    return (
      <div className='olachat-feedback'>
        <button
          type='button'
          onClick={this.handlePositive}
          className='olachat-feedback-positive'
        >
          <span className='emoji-thumbs-up' />
        </button>
        <button
          type='button'
          onClick={this.handleNegative}
          className='olachat-feedback-negative'
        >
          <span className='emoji-thumbs-down' />
        </button>
      </div>
    )
  }
}

export default connect(null, {
  setFeedbackMessage,
  setFeedbackRating
})(Decorators.withConfig(MessageFeedback))
