/* global Audio */
import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { checkIfAwaitingResponse } from './utils'
import { connect } from 'react-redux'
import { Actions } from '@olasearch/core'
import Mic from '@olasearch/icons/lib/mic'
import MicOff from '@olasearch/icons/lib/mic-off'

/* All voice events */
const VOICE_EVENTS = ['onResult', 'onFinalResult', 'onStart', 'onEnd', 'onStop']
/* Component */
class Voice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isRecording: false,
      isSpeaking: false
    }
  }
  static contextTypes = {
    emitter: PropTypes.object
  }
  static defaultProps = {
    showListening: false,
    containerClass: '',
    iconSize: 20
  }
  componentWillUnmount() {
    const { emitter } = this.context
    for (let i = 0; i < VOICE_EVENTS.length; i++) {
      emitter.off(VOICE_EVENTS[i], this[VOICE_EVENTS[i]])
    }
  }
  componentDidMount() {
    const { emitter } = this.context
    if (!emitter) return
    for (let i = 0; i < VOICE_EVENTS.length; i++) {
      emitter.on(VOICE_EVENTS[i], this[VOICE_EVENTS[i]])
    }

    if (this.props.initialPayload) {
      /* Empty message to bot */
      this.onFinalResult(undefined, this.props.initialPayload)
    }
  }
  onResult = text => {
    this.props.onResult(text)
  }
  onFinalResult = (text, initialPayload) => {
    const { voiceAdapter } = this.props
    /* Stop recording if no text in final result */
    if (typeof text !== 'undefined' && !text) return voiceAdapter.stop()

    /* Stop voice */
    voiceAdapter.stop()

    this.props.onFinalResult(
      text,
      response => {
        let { answer } = response

        /* If no answer */
        if (!answer || !answer.reply) return

        let reply = answer.reply_voice || answer.reply

        /* Check if fullfilled */
        let isFulfilled = answer.fulfilled

        /* Check if awaiting user reply */
        let isAwaitingReply = checkIfAwaitingResponse(response)

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
            /* Empty message to bot */
            this.onFinalResult(undefined)
          }

          this.setState({
            isSpeaking: false
          })
        })
      },
      initialPayload
    )
  }
  onStart = () => {
    this.setState({
      isRecording: true
    })

    /* Play ping voice */
    this.playPing()
  }
  onEnd = () => {
    this.setState({
      isRecording: false
    })

    /* Play ping voice */
    this.playPing()
  }
  onStop = (e) => {
    /* Die if has already stopped recording */
    if (!this.state.isRecording && !this.state.isSpeaking) return

    this.setState({
      isRecording: false,
      isSpeaking: false
    })

    /* Play ping voice */
    this.playPing()
  }
  playPing = () => {
    if (this.props.isPhone) {
      return
    }
    var audio = new Audio()
    audio.crossOrigin = true
    audio.src = 'https://cdn.olasearch.com/assets/audio/tap.mp3'
    audio.play()
  }
  handleSpeechStart = () => {
    const { voiceAdapter } = this.props

    if (this.state.isRecording) {
      voiceAdapter.stop()
    } else {
      /* Start listening */
      voiceAdapter.start()
    }
    this.props.handleVoiceButtonClick && this.props.handleVoiceButtonClick()
  }
  render() {
    let { isRecording, isSpeaking } = this.state
    let {
      isTyping,
      className,
      containerClass,
      hasUsedVoice,
      searchInput,
      showListening,
      iconSize
    } = this.props
    let klass = cx('olachat-mic', className, {
      'olachat-mic-isrecording': isRecording && !isTyping,
      'olachat-mic-isloading': isTyping,
      'olachat-mic-isspeaking': isSpeaking
    })
    let containerKlass = cx('olachat-voice', {
      [`${containerClass}`]: hasUsedVoice && !isSpeaking && !isRecording,
      'olachat-voice-isrecording': isRecording && !isTyping
    })
    let showLoadingIndicator = isTyping && searchInput === 'voice'
    return (
      <div className={containerKlass} onClick={this.handleSpeechStart}>
        <button type="button" className={klass}>
          {isRecording ? <Mic size={iconSize} /> : <Mic size={iconSize} />}
          {isRecording && showListening ? (
            <span className="olachat-mic-listening">
              Listening<em>...</em>
            </span>
          ) : null}
          {showLoadingIndicator && <span className="olachat-mic-loader" />}
        </button>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isTyping: state.Conversation.isTyping,
    searchInput: state.QueryState.searchInput,
    hasUsedVoice: state.Context.hasUsedVoice,
    isPhone: state.Device.isPhone
  }
}
export default connect(mapStateToProps, {
  addContextField: Actions.Context.addContextField
})(Voice)
