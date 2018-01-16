import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clearMessages, setBotStatus, clearBotQueryTerm } from './actions'
import { Actions, Decorators } from '@olasearch/core'
import classNames from 'classnames'
import mitt from 'mitt'
import Bubble from './Bubble'
import Chat from './Chat'
import Vui from './Vui'

const DEBUG = false
const supportsVoice = DEBUG
  ? false
  : navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
const emitter = mitt()

class Bot extends Component {
  constructor(props) {
    super(props)
    let { speechRecognitionProvider } = props /* speechOutputProvider */
    if (speechRecognitionProvider) {
      /* Create a voiceadapter */
      this.voiceAdapter = require('./adapters/webkit').default({ emitter })
      /* Lazy load tokens */
      // this.voiceAdapter.prefetchToken()
    } else {
      this.voiceadapter = null
    }
  }
  static childContextTypes = {
    emitter: PropTypes.object,
    env: PropTypes.string
  }
  getChildContext() {
    return {
      emitter,
      env: this.props.env
    }
  }
  toggleActive = () => {
    /* Pause all audio */
    this.voiceAdapter && this.voiceAdapter.stopSpeaking()

    /* Reset */
    if (!this.props.showHistory) {
      // this.props.clearMessages()

      /* Clear initial query term */
      // this.props.clearBotQueryTerm()
    }

    const currentActiveStatus = !this.props.isBotActive

    /* Stop all audio */
    this.props.setBotStatus(currentActiveStatus)

    /* Handle active status */
    this.props.onBubbleClick && this.props.onBubbleClick(currentActiveStatus)
    /* Log when chatbot opens or closes */
    this.props.log({
      eventLabel: currentActiveStatus ? 'open' : 'close',
      eventCategory: 'bot',
      eventType: 'O',
      setNewUser: false,
      payload: { bot: true }
    })
  }
  static defaultProps = {
    showHistory: false,
    speechRecognitionProvider: 'webkit',
    vui: false,
    showBubble: true,
    voiceInput: true,
    bubbleProps: {},
    onBubbleClick: null,
    botProps: {
      botName: 'Bot',
      userName: 'You'
    },
    headerProps: {
      title: 'Bot title'
    },
    avatarProps: {
      avatarBot: null,
      avatarUser: null
    }
  }
  componentDidMount() {
    /* Send load log for new user */
    if (this.props.isNewUser) {
      this.props.log({
        eventLabel: 'load',
        eventCategory: 'bot',
        eventType: 'O',
        setNewUser: false,
        payload: { bot: true }
      })
    }
  }
  render() {
    const passProps = {
      onHide: this.toggleActive,
      ...this.props.headerProps,
      ...this.props.avatarProps,
      ...this.props.botProps,
      initialIntent: this.props.initialIntent,
      voiceAdapter: this.voiceAdapter,
      onRequestClose: this.toggleActive,
      voiceInput: this.props.voiceInput,
      emitter
    }
    const HAS_VOICES = this.props.isPhone
      ? window.speechSynthesis.getVoices().length > 1
      : true
    const { isBotActive, showBubble } = this.props
    const component = isBotActive ? (
      this.props.vui && supportsVoice && HAS_VOICES ? (
        <Vui {...passProps} />
      ) : (
        <Chat {...passProps} />
      )
    ) : null
    const botClass = classNames('olachat-bot', {
      'olachat-bot-active': isBotActive,
      'olachat-bot-iframe': this.props.iFrame,
      'olachat-bot-mobile': this.props.isPhone,
      'olachat-bot-tablet': this.props.isTablet,
      'olachat-bot-desktop': this.props.isDesktop,
    })
    return (
      <div className={botClass} style={{ opacity: 0 }}>
        <div className="olachat-bot-overlay" />
        {isBotActive ? null : showBubble ? (
          <Bubble
            onClick={this.toggleActive}
            isActive={isBotActive}
            {...this.props.bubbleProps}
          />
        ) : null}
        {component}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isPhone: state.Device.isPhone,
    isTablet: state.Device.isTablet,
    isDesktop: state.Device.isDesktop,
    isNewUser: state.Context.isNewUser,
    isBotActive: state.Conversation.isBotActive
  }
}

module.exports = connect(mapStateToProps, {
  clearMessages,
  setBotStatus,
  clearBotQueryTerm
})(Decorators.withLogger(Bot))
