import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { clearMessages } from './actions'
import { Actions, Decorators } from 'olasearch'
import classNames from 'classnames'
// import webkit from './adapters/webkit'
// import houndify from './adapters/houndify'
// import watson from './adapters/watson'
// import bing from './adapters/bing'
import mitt from 'mitt'
import Bubble from './Bubble'
import Chat from './Chat'
import Vui from './Vui'

const DEBUG = false
const supportsVoice = DEBUG
  ? false
  : navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
const emitter = mitt()

class Bot extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: !!props.debug
    }
    let { speechRecognitionProvider } = props /* speechOutputProvider */
    if (speechRecognitionProvider) {
      /* Create a voiceadapter */
      this.voiceAdapter = require('./adapters/google').default({ emitter })

      /* Lazy load tokens */
      this.voiceAdapter.prefetchToken()
    } else {
      this.voiceadapter = null
    }
  }
  static childContextTypes = {
    emitter: PropTypes.object,
    env: PropTypes.string
  };
  getChildContext () {
    return {
      emitter,
      env: this.props.env
    }
  }
  toggleActive = () => {
    /* Pause all audio */
    this.voiceAdapter && this.voiceAdapter.stopSpeaking()

    /* Reset */
    this.props.dispatch(clearMessages())
    this.props.dispatch(Actions.Search.clearQueryTerm())

    /* Stop all audio */

    this.setState({
      isActive: !this.state.isActive
    }, () => {
      /* Handle active status */
      this.props.onBubbleClick && this.props.onBubbleClick(this.state.isActive)
    })
  };
  static defaultProps = {
    vui: false,
    bubbleProps: {},
    onBubbleClick: null,
    botProps: {
      botName: 'Bot',
      userName: 'You'
    },
    headerProps: {
      title: 'Calculate maternity leave'
    },
    avatarProps: {
      avatarBot: null,
      avatarUser: null
    }
  };
  componentDidMount() {
    /* Send load log for new user */
    if (this.props.isNewUser) {
      this.props.log({
        eventLabel: 'load',
        eventCategory: 'bot',
        eventType: 'O'
      })
    }
  };
  render () {
    // const initialIntent = 'start'
    const passProps = {
      onHide: this.toggleActive,
      ...this.props.headerProps,
      ...this.props.avatarProps,
      ...this.props.botProps,
      initialIntent: this.props.initialIntent,
      voiceAdapter: this.voiceAdapter,
      onRequestClose: this.toggleActive,
      emitter
    }
    const HAS_VOICES = this.props.isPhone ? window.speechSynthesis.getVoices().length > 1 : true
    const component = this.state.isActive
      ? this.props.vui && supportsVoice && HAS_VOICES
        ? <Vui {...passProps} />
        : <Chat {...passProps} />
      : null
    const { isActive } = this.state
    const botClass = classNames('olachat-bot', {
      'olachat-bot-active': isActive,
      'olachat-bot-iframe': this.props.iFrame,
      'olachat-bot-mobile': this.props.isPhone,
      'olachat-bot-tablet': this.props.isTablet,
      'olachat-bot-desktop': this.props.isDesktop,
      'olachat-bot-testing': this.props.env === 'testing'
    })
    return (
      <div className={botClass}>
        <div className='olachat-bot-overlay' />
        {isActive
          ? null
          : <Bubble
            onClick={this.toggleActive}
            isActive={this.state.isActive}
            {...this.props.bubbleProps}
            />
        }
        {component}
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    isPhone: state.Device.isPhone,
    isTablet: state.Device.isTablet,
    isDesktop: state.Device.isDesktop,
    isNewUser: state.Context.isNewUser
  }
}

module.exports = connect(mapStateToProps)(Decorators.withLogger(Bot))
