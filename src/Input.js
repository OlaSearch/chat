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
  onVoiceChange = (text, callback) => {
    this.setState({
      text
    }, callback)
  };
  onVoiceFinal = (text) => {
    this.onVoiceChange(() => console.log('called'))
  };
  onSubmit = (event) => {
    /**
     * Flow
     * 1. Immediate add to the messages redux atore
     * 2. Sync the message to the server
     * 3. Update sync status in redux store
     */
    /* Stop form submission */
    event && event.preventDefault()

    if (!this.state.text) return event

    /* Set submit flag */
    this.setState({
      submitting: true,
      text: ''
    })

    /* Submit the message */
    this.props.onSubmit(this.state.text)
      .then(() => {
        this.setState({
          submitting: false
        })
      })
  };
  onKeyDown = (event) => {
    if (event.nativeEvent.which === 13 && !event.nativeEvent.shiftKey) {
      this.onSubmit()
      event.preventDefault()
    }
  };
  render () {
    let { submitting } = this.state
    return (
      <form className='olachat-footer' onSubmit={this.onSubmit}>
        <div className='olachat-input'>
          <Voice
            onChange={this.onVoiceChange}
            onFinal={this.onVoiceFinal}
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
