import React from 'react'
import Voice from './Voice'

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      submitting: false
    }
  }
  onChange = (event) => {
    this.setState({
      text: event.target.value
    })
  };
  onVoiceChange = (text) => {
    this.setState({
      text
    })
  };
  onVoiceFinal = (text, cb) => {
    this.setState({
      text
    }, () => this.onSubmit(null, cb))
  };
  onSubmit = (event, callback) => {
    /**
     * Flow
     * 1. Immediate add to the messages redux atore
     * 2. Sync the message to the server
     * 3. Update sync status in redux store
     */
    /* Stop form submission */
    event && event.preventDefault()

    /* Stop submitting if text is empty */
    if (!this.state.text || this.state.submitting) return

    /* Set submit flag */
    this.setState({
      submitting: true,
      text: ''
    })

    /* Submit the message */
    return this.props.onSubmit({ text: this.state.text })
      .then((message) => {
        this.setState({
          submitting: false
        })

        /* We should scroll to top */

        /* Callbacks */
        callback && typeof callback === 'function' && callback(message)
      })
  };
  onKeyDown = (event) => {
    if (event.nativeEvent.which === 13 && !event.nativeEvent.shiftKey) {
      this.onSubmit(event)
      event.preventDefault()
    }
  };
  render () {
    let { submitting } = this.state
    return (
      <form className='olachat-footer' onSubmit={this.onSubmit}>
        <div className='olachat-input'>
          <Voice
            onResult={this.onVoiceChange}
            onFinalResult={this.onVoiceFinal}
            voiceAdapter={this.props.voiceAdapter}
          />
          <textarea
            type='text'
            placeholder='Type a message...'
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            value={this.state.text}
          />
        </div>
        <button disabled={submitting}>Send</button>
      </form>
    )
  }
}

export default Input
