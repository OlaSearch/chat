import React from 'react'
import Textarea from 'react-flexi-textarea'
import { connect } from 'react-redux'
import { disabledFeedback, logFeedback } from './actions'

class InputFeedback extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      submitted: false
    }
  }
  onFormSubmit = (e) => {
    e.preventDefault()
    if (!this.state.message) return this.Input.el.focus()
    let lastMessage = this.props.messages[this.props.messages.length - 1]
    this.props.logFeedback(this.state.message, lastMessage.id)
    this.setState({
      message: '',
      submitted: true
    }, () => {
      setTimeout(this.cancelFeedback, 1000)
    })
  };
  onChange = (e) => {
    this.setState({
      message: e.target.value
    })
  };
  cancelFeedback = (e) => {
    this.props.disabledFeedback()
  };
  registerRef = (el) => {
    this.Input = el
  };
  render () {
    let { submitted } = this.state
    return (
      <form className='olachat-footer olachat-footer-feedback' onSubmit={this.onFormSubmit}>
        <div className='olachat-input'>
          {submitted
            ? <span className='olachat-feedback-thankyou'>Thank you for your feedback</span>
            : <Textarea
              placeholder='Enter your feedback'
              onChange={this.onChange}
              value={this.state.message}
              rows={1}
              cols={1}
              autoFocus
              ref={this.registerRef}
              />
          }
        </div>
        {submitted
          ? null
          : <button className='olachat-submit'>
            <span>Send</span>
          </button>
        }
        <button className='olachat-button-cancel' type='button' onClick={this.cancelFeedback}>
          <span>{submitted ? 'Continue' : 'Cancel' }</span>
        </button>
      </form>
    )
  }
}

module.exports = connect(null, { disabledFeedback, logFeedback })(InputFeedback)
