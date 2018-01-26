import React from 'react'
import Textarea from 'react-flexi-textarea'
import { connect } from 'react-redux'
import { Decorators } from '@olasearch/core'
import { disabledFeedback, logFeedback } from './actions'

class InputFeedback extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      submitted: false
    }
  }
  onFormSubmit = e => {
    e.preventDefault()
    if (!this.state.message) return this.Input.el.focus()
    /* Log feedback */
    this.props.logFeedback(this.state.message)
    this.setState(
      {
        message: '',
        submitted: true
      },
      () => {
        setTimeout(this.cancelFeedback, 1000)
      }
    )
  }
  onChange = e => {
    this.setState({
      message: e.target.value
    })
  }
  cancelFeedback = e => {
    this.props.disabledFeedback()
  }
  registerRef = el => {
    this.Input = el
  }
  render () {
    let { submitted } = this.state
    const { translate } = this.props
    return (
      <form
        className='olachat-footer olachat-footer-feedback'
        onSubmit={this.onFormSubmit}
      >
        <div className='olachat-input'>
          {submitted ? (
            <span className='olachat-feedback-thankyou'>
              {translate('thank_you')}
            </span>
          ) : (
            <Textarea
              placeholder={translate('enter_feedback')}
              onChange={this.onChange}
              value={this.state.message}
              rows={1}
              cols={1}
              autoFocus
              ref={this.registerRef}
            />
          )}
        </div>
        {submitted ? null : (
          <button className='olachat-submit'>
            <span>{translate('send')}</span>
          </button>
        )}
        <button
          className='olachat-button-cancel'
          type='button'
          onClick={this.cancelFeedback}
        >
          <span>{submitted ? translate('continue') : translate('cancel')}</span>
        </button>
      </form>
    )
  }
}

module.exports = connect(null, { disabledFeedback, logFeedback })(
  Decorators.injectTranslate(InputFeedback)
)
