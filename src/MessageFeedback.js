import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Decorators } from 'olasearch'
import { activateFeedback } from './actions'

class MessageFeedback extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      submitted: false
    }
  }
  static contextTypes = {
    env: PropTypes.string
  }
  onPositiveClick = () => {
    this.props.activateFeedback({
      eventLabel: 'positive',
      messageId: this.props.message.id
    })
    this.setState({
      submitted: true
    }, this.activateFeedback)
  };
  onNegativeClick = () => {
    this.props.activateFeedback({
      eventLabel: 'positive',
      messageId: this.props.message.id
    })
    this.setState({
      submitted: true
    }, this.activateFeedback)
  };
  activateFeedback = () => {
    setTimeout(() => {
      this.setState({
        submitted: false
      })
    }, 5000)
  };
  render () {
    let { isBot, log } = this.props
    if (!isBot) return null
    let { env } = this.context
    let { submitted } = this.state
    return (
      <div className='olachat-message-feedback'>
        {!submitted
          ? <div>
              <button
                type='button'
                className='olachat-message-feedback-positive'
                onClick={this.onPositiveClick}
              >
                <span>Positive</span>
              </button>
              <button
                type='button'
                className='olachat-message-feedback-negative'
                onClick={this.onNegativeClick}
              >
                <span>Negative</span>
              </button>
            </div>
          : <div className='olachat-message-done'>Thank you for the feedback</div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messages: state.Conversation.messages
  }
}

module.exports = connect(mapStateToProps, { activateFeedback })(Decorators.withLogger(MessageFeedback))
