import React from 'react'
import Header from './Header'
import Voice from './Voice'
import { connect } from 'react-redux'
import { addMessage } from './actions'
import { Actions, Settings } from 'olasearch'
import { createHTMLMarkup } from './utils'

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
    /* Set text to empty */
    if (typeof text === 'undefined') text = ''
    /* Update query term */
    this.props.updateQueryTerm(text, Settings.SEARCH_INPUTS.VOICE)
    return this.onSubmit(cb, 300, params)
  };
  onSubmit = (callback, textClearingDelay = 0, params = {}) => {
    /**
     * Flow
     * 1. Immediate add to the messages redux atore
     * 2. Sync the message to the server
     * 3. Update sync status in redux store
     */

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
    let msgs = messages.filter((msg) => !msg.userId)
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
            containerClass={voiceContainerClass}
            hasUsedVoice={this.props.hasUsedVoice}
            showListening
            initialPayload={initialPayload}
          />
          : null
        }
        {msgs
          .filter((msg, i) => i === msgs.length - 1)
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
        <span className='olachat-vui-message' dangerouslySetInnerHTML={createHTMLMarkup(text)} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messages: state.Conversation.messages,
    isTyping: state.Conversation.isTyping
  }
}
export default connect(mapStateToProps, {
  addMessage,
  updateQueryTerm: Actions.Search.updateQueryTerm
})(Vui)
