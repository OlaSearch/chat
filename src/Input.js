import React from 'react'
import Voice from './Voice'
import { Settings } from 'olasearch'
import Textarea from 'react-flexi-textarea'

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
    }, () => this.onSubmit(null, cb, 300, Settings.SEARCH_INPUTS.VOICE ))
  };
  onSubmit = (event, callback, textClearingDelay = 0, searchInput = Settings.SEARCH_INPUTS.KEYBOARD) => {
    this.props.updateQueryTerm(this.state.text, searchInput)

    /**
     * Flow
     * 1. Immediate add to the messages redux atore
     * 2. Sync the message to the server
     * 3. Update sync status in redux store
     */
    /* Stop form submission */
    event && event.preventDefault()

    /* Stop submitting if text is empty */
    if (!this.state.text) {
      return this.Input.refs.textarea.focus()
    }

    // if (this.state.isTyping) return

    /* Clear the final text input after 100ms */
    /* To simulate delay */
    setTimeout(() => {
      this.setState({
        text: ''
      })

      /* Resize height */
      this.Input.autoGrow()

      /* Focus */
      this.Input.refs.textarea.focus()

    }, textClearingDelay)

    /* Submit the message */
    return this.props.onSubmit()
      .then((response) => {
        /* Callbacks */
        callback && typeof callback === 'function' && callback(response)
      })
  };
  onKeyDown = (event) => {
    if (event.nativeEvent.which === 13 && !event.nativeEvent.shiftKey) {
      this.onSubmit(event)
      event.preventDefault()
    }
  };
  render () {
    let supportsVoice = window.SpeechRecognition || window.webkitSpeechRecognition
    let { isTyping } = this.props
    return (
      <form className='olachat-footer' onSubmit={this.onSubmit}>
        <div className='olachat-input'>
          {supportsVoice
           ? <div className='olachat-input-voice'>
              <Voice
                onResult={this.onVoiceChange}
                onFinalResult={this.onVoiceFinal}
                voiceAdapter={this.props.voiceAdapter}
                addContextField={this.props.addContextField}
                isTyping={isTyping}
                searchInput={this.props.searchInput}
              />
            </div>
            : null
          }
          <Textarea
            type='text'
            placeholder='Type a message...'
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            value={this.state.text}
            rows={1}
            cols={1}
            ref={(el) => this.Input = el}
          />
        </div>
        <button disabled={isTyping} className='olachat-submit'>
          <span>Send</span>
        </button>
      </form>
    )
  }
}

export default Input
