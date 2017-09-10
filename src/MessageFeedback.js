import React from 'react'
import { connect } from 'react-redux'
import { Actions } from 'olasearch'
import { activateFeedback, disabledFeedback, setFeedbackMessage, setFeedbackRating, logFeedback } from './actions'
import { FEEDBACK_INTENT, HELP_INTENT, PROFANITY_INTENT } from './Settings'

// const EMOJI_POSITIVE = ':+1:'

// const EMOJI_NEGATIVE = ':-1:'
const IGNORE_FEEDBACK_INTENTS = [FEEDBACK_INTENT, HELP_INTENT, PROFANITY_INTENT]
const EMOJI_POSITIVE = '\\01f44d'
const EMOJI_NEGATIVE = '\\01f44e'

class FeedBack extends React.Component {
  componentWillUnmount () {
    this.props.disabledFeedback()
  }
  handlePositive = () => {
    this.props.updateQueryTerm(EMOJI_POSITIVE)
    this.props.setFeedbackMessage(this.props.message.id)
    this.props.setFeedbackRating(EMOJI_POSITIVE)
    this.props.onSubmit({ intent: 'OLA.FeedbackIntent' })
  };
  handleNegative = () => {
    this.props.updateQueryTerm(EMOJI_NEGATIVE)
    this.props.setFeedbackMessage(this.props.message.id)
    this.props.setFeedbackRating(EMOJI_NEGATIVE)
    this.props.onSubmit({ intent: 'OLA.FeedbackIntent' })
  };
  render () {
    let { isActive, isBot, isTyping, messageIdx, message: { awaitingUserInput, intent } } = this.props
    if (!isActive || !isBot || isTyping || !awaitingUserInput || messageIdx < 1 || IGNORE_FEEDBACK_INTENTS.indexOf(intent) !== -1) return null
    return (
      <div className='olachat-feedback'>
        <a onClick={this.handlePositive} className='olachat-feedback-positive'>
          <span className='emoji-thumbs-up' />
        </a>
        <a onClick={this.handleNegative} className='olachat-feedback-negative'>
          <span className='emoji-thumbs-down' />
        </a>
      </div>
    )
  }
}

module.exports = connect(null, { activateFeedback, disabledFeedback, setFeedbackMessage, setFeedbackRating, logFeedback, updateQueryTerm: Actions.Search.updateQueryTerm })(FeedBack)
