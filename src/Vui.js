import React from 'react'
import mitt from 'mitt'
import Header from './Header'
import webkit from './adapters/webkit'
import houndify from './adapters/houndify'
import Voice from './Voice'
import TypingIndicator from './TypingIndicator'
import { connect } from 'react-redux'
import { addMessage } from './actions'
import { Actions, Settings } from 'olasearch'

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
const emitter = mitt()

class Vui extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      scrollDirection: null
    }

    /* Create a voiceadapter */
    this.voiceAdapter = houndify({ emitter })

    /* Add scroll event */
    // this.addScrollListener()
  }
  static defaultProps = {
    title: 'Ola Bot'
  };
  static childContextTypes = {
    emitter: React.PropTypes.object
  };
  getChildContext () {
    return {
      emitter
    }
  }
  componentDidMount() {
    this.props.addMessage({ singleLoop: true }, {
      intent: 'maternity-leave'
    }).then((response) => {
      /* Speak initial message */
      this.voiceAdapter.speak(response.answer.reply_voice, this.props.isPhone, () => {
        this.voiceAdapter.start()
      })
    })
  }
  addScrollListener = () => {
    let lastScrollTop = 0
    window.addEventListener('scroll',() => {
      var st = window.pageYOffset || document.documentElement.scrollTop
      if (st > lastScrollTop){
        if (this.state.scrollDirection !== 'down') {
          this.setState({
            scrollDirection: 'down'
          })
        }
      } else {
        if (this.state.scrollDirection !== 'up') {
          this.setState({
            scrollDirection: 'up'
          })
        }
      }

      lastScrollTop = st
    })
  }
  onVoiceChange = (text) => {
    this.setState({
      text
    })
  };
  onVoiceFinal = (text, cb) => {
    this.props.updateQueryTerm(text, Settings.SEARCH_INPUTS.VOICE)
    return this.onSubmit(null, cb, 300)
  };
  onSubmit = (event, callback, textClearingDelay = 0) => {
    /**
     * Flow
     * 1. Immediate add to the messages redux atore
     * 2. Sync the message to the server
     * 3. Update sync status in redux store
     */
    /* Stop form submission */
    event && event.preventDefault()

    if (this.props.isTyping) return

    /* Clear the final text input after 100ms */
    /* To simulate delay */
    setTimeout(() => {
      this.setState({
        text: '',
        scrollDirection: null
      })
    }, textClearingDelay)

    /* Submit the message */
    return this.props.addMessage({ singleLoop: true })
      .then((response) => {
        /* Scroll to top */
        this.scrollToView()
        callback && typeof callback === 'function' && callback(response)
      })

  };
  scrollToView = () => {
    window.scrollTo(0,0)
  };
  handleVoiceButtonClick = () => {
    this.setState({
      scrollDirection: null
    })
  };
  render () {
    let supportsVoice = window.SpeechRecognition || window.webkitSpeechRecognition
    let { isTyping, messages } = this.props
    let { scrollDirection, text } = this.state
    let voiceContainerClass = scrollDirection
      ? `olachat-voice-scroll-${scrollDirection}`
      : ''

    return (
      <div className='olachat-vui'>
        <Header
          onHide={this.props.onHide}
          title={this.props.title}
        />
        {supportsVoice
          ? <Voice
            onResult={this.onVoiceChange}
            onFinalResult={this.onVoiceFinal}
            voiceAdapter={this.voiceAdapter}
            isPhone={this.props.isPhone}
            isTyping={this.props.isTyping}
            addContextField={this.props.addContextField}
            containerClass={voiceContainerClass}
            hasUsedVoice={this.props.hasUsedVoice}
            searchInput={this.props.searchInput}
            showListening
          />
          : null
        }
        {messages
          .filter((el, i) => i === messages.length - 1)
          .map(({ message, reply, userId } , idx) => {
            let isBot = !userId
            let text = isBot ? reply : message
            return (
              <div key={idx} className='olachat-vui-reply'>
                {text}
              </div>
            )
          })
        }
        <span className='olachat-vui-message'>{text}</span>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messages: state.Conversation.messages,
    isTyping: state.Conversation.isTyping,
    isPhone: state.Device.isPhone,
    hasUsedVoice: state.Context.hasUsedVoice,
    searchInput: state.QueryState.searchInput
  }
}
export default connect(mapStateToProps, {
  addMessage,
  updateQueryTerm: Actions.Search.updateQueryTerm,
  addContextField: Actions.Context.addContextField
})(Vui)
