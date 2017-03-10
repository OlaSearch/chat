import React from 'react'
import Header from './Header'
import Voice from './Voice'
import { connect } from 'react-redux'
import { addMessage } from './actions'
import { Actions, Settings } from 'olasearch'

const supportsVoice = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

class Vui extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      scrollDirection: null
    }
  }
  static defaultProps = {
    title: 'Ola Bot'
  };
  addScrollListener = () => {
    let lastScrollTop = 0
    window.addEventListener('scroll', () => {
      var st = window.pageYOffset || document.documentElement.scrollTop
      if (st > lastScrollTop) {
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
  onVoiceFinal = (text, cb, params) => {
    if (typeof text !== 'undefined') {
      this.props.updateQueryTerm(text, Settings.SEARCH_INPUTS.VOICE)
    }
    return this.onSubmit(null, cb, 300, params)
  };
  onSubmit = (event, callback, textClearingDelay = 0, params) => {
    if (typeof params === 'undefined') params = { vui: true }
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
        // text: '',
        scrollDirection: null
      })
    }, textClearingDelay)

    /* Submit the message */
    return this.props.addMessage(params)
      .then((response) => {
        /* Scroll to top */
        this.scrollToView()
        /* Delete text state */
        this.setState({
          text: ''
        })
        callback && typeof callback === 'function' && callback(response)
      })
  };
  scrollToView = () => {
    window.scrollTo(0, 0)
  };
  handleVoiceButtonClick = () => {
    this.setState({
      scrollDirection: null
    })
  };
  render () {
    let { messages } = this.props
    let { scrollDirection, text } = this.state
    let voiceContainerClass = scrollDirection
      ? `olachat-voice-scroll-${scrollDirection}`
      : ''
    let initialPayload = { vui: true, immediate: true, intent: this.props.initialIntent }

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
            voiceAdapter={this.props.voiceAdapter}
            isPhone={this.props.isPhone}
            isTyping={this.props.isTyping}
            addContextField={this.props.addContextField}
            containerClass={voiceContainerClass}
            hasUsedVoice={this.props.hasUsedVoice}
            searchInput={this.props.searchInput}
            showListening
            initialPayload={initialPayload}
          />
          : null
        }
        {messages
          .filter((el, i) => i === messages.length - 1)
          .map(({ message, reply, userId }, idx) => {
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
