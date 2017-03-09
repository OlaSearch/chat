import React from 'react'
import cx from 'classnames'
import { checkIfAwaitingResponse } from './utils'

/* All voice events */
const VOICE_EVENTS = ['onResult', 'onFinalResult', 'onStart', 'onEnd', 'onStop']
/* Component */
class Voice extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isRecording: false,
      isSpeaking: false
    }
  }
  static contextTypes = {
    emitter: React.PropTypes.object
  };
  static defaultProps = {
    showListening: false
  };
  componentWillUnmount() {
    const { emitter } = this.context
    for (let i = 0; i < VOICE_EVENTS.length; i++) {
      emitter.off(VOICE_EVENTS[i], this[VOICE_EVENTS[i]])
    }
  }
  componentDidMount () {
    const { emitter } = this.context
    for (let i = 0; i < VOICE_EVENTS.length; i++) {
      emitter.on(VOICE_EVENTS[i], this[VOICE_EVENTS[i]])
    }

    if (this.props.initialPayload) {
      this.onFinalResult(undefined, this.props.initialPayload)
    }
  }
  onResult = (text) => {
    this.props.onResult(text)
  };
  onFinalResult = (text, initialPayload) => {
    const { voiceAdapter } = this.props
    /* Stop recording if no text in final result */
    if (typeof text !== 'undefined' && !text) return voiceAdapter.stop()

    /* Set context field */
    this.props.addContextField('hasUsedVoice', true)

    this.props.onFinalResult(text, (response) => {
      let { answer } = response
      /* Stop voice */
      voiceAdapter.stop()

      /* If no answer */
      if (!answer || !answer.reply) return

      let reply = answer.reply_voice || answer.reply

      /* Check if fullfilled */
      let isFulfilled = answer.fulfilled

      /* Check if awaiting user reply */
      let isAwaitingReply = checkIfAwaitingResponse (response)

      /* Play audio */
      this.setState({
        isSpeaking: true
      })
      voiceAdapter.speak(reply, this.props.isPhone, () => {
        /* Then continue voice recognition after audio stop */
        if (!isFulfilled && !isAwaitingReply) {
          voiceAdapter.start()
        }

        if (isAwaitingReply) {
          this.onFinalResult()
        }

        this.setState({
          isSpeaking: false
        })
      })
    }, initialPayload)
  };
  onStart = () => {
    this.setState({
      isRecording: true
    })

    /* Play ping voice */
    this.playPing()
  };
  onEnd = () => {
    this.setState({
      isRecording: false
    })

    /* Play ping voice */
    this.playPing()
  };
  onStop = () => {
    this.setState({
      isRecording: false,
      isSpeaking: false
    })

    /* Play ping voice */
    this.playPing()
  };
  playPing = () => {
    if (this.props.isPhone) {
      // var utterance = new SpeechSynthesisUtterance()
      // utterance.pitch = 0.2
      // utterance.rate = 0.1
      // utterance.volume = 1.0
      // utterance.text = 'ph'
      // /* Say */
      // window.speechSynthesis.speak(utterance)
      return
    }
    var audio = new Audio()
    audio.crossOrigin = true
    audio.src = '/tap.mp3'
    audio.play()
  };
  handleSpeechStart = () => {
    const { voiceAdapter } = this.props

    if (this.state.isRecording) {
      voiceAdapter.stop()
    } else {
      /* Start listening */
      voiceAdapter.start()
    }
    this.props.handleVoiceButtonClick && this.props.handleVoiceButtonClick()
  };
  render () {
    let { isRecording, isSpeaking } = this.state
    let { isTyping, className, containerClass, hasUsedVoice, searchInput, showListening } = this.props
    let klass = cx('olachat-mic', className, {
      'olachat-mic-isrecording': isRecording && !isTyping,
      'olachat-mic-isloading': isTyping,
      'olachat-mic-isspeaking': isSpeaking
    })
    let containerKlass = cx('olachat-voice', {
      [`${containerClass}`]: hasUsedVoice && !isSpeaking && !isRecording,
      'olachat-voice-isrecording': isRecording && !isTyping,
    })
    let showLoadingIndicator = isTyping && searchInput === 'voice'
    return (
      <div className={containerKlass} onClick={this.handleSpeechStart}>
        <button
          type='button'
          className={klass}
          >
          <span className='olachat-mic-text'>
            {isRecording ? 'Stop' : 'Speak'}
          </span>
          {isRecording && showListening
            ? <span className='olachat-mic-listening'>Listening<em>...</em></span>
            : null
          }
          {showLoadingIndicator && <span className='olachat-mic-loader'/>}
        </button>
      </div>
    )
  }
}

export default Voice
