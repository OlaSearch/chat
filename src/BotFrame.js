import React from 'react'
import Bot from './Bot'
import Frame from 'react-frame-component'
import { connect } from 'react-redux'
import { Decorators } from 'olasearch'
import { triggerMouseEvent, closest } from './utils'
import { OLACHAT_IFRAME_ID, OLACHAT_MESSAGE_ELEMENT } from './Settings'

class BotFrame extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: props.debug
    }
    this.addedIframeClickEvent = false
    this.addedMessageClickEvent = false
  }
  handleBubbleClick = (isActive) => {
    this.setState({
      isActive
    }, () => {
      document.documentElement.classList.toggle('ola-chatbot-rootActive', this.state.isActive)
    })
  };
  static defaultProps = {
    width: 320,
    widthActive: 880,
    height: 85,
    heightActive: '100%',
    inline: false,
    zIndex: 99999999,
    iframeStyle: {
      border: 'none',
      maxWidth: '100%'
    }
  }
  componentDidMount () {
    this.checkForListener()
    /* Add inline css */
    var style = document.createElement('style')
    style.id = 'ola-styles'
    style.type = 'text/css'
    style.innerHTML = this.props.isDesktop ? `` : `
      .ola-chatbot-rootActive, .ola-chatbot-rootActive body{
        -webkit-overflow-scrolling : touch !important;
        overflow: hidden !important;
        height: 100% !important;
    `
    document.getElementsByTagName('head')[0].appendChild(style)
  }
  componentDidUpdate () {
    this.checkForListener()
  }
  checkForListener = () => {
    if (this.addedIframeClickEvent && this.addedMessageClickEvent) return

    this.iFrame = document.getElementById(OLACHAT_IFRAME_ID)
    this.innerDoc = this.iFrame.contentDocument || this.iFrame.contentWindow.document

    if (this.innerDoc && !this.addedIframeClickEvent) {
      this.innerDoc.addEventListener('click', this.iFrameDispatcher)
      this.addedIframeClickEvent = true
    }
  }
  iFrameDispatcher = (e) => {
    if (e.defaultPrevented) return
    if (typeof (document) !== 'undefined') triggerMouseEvent(document, 'mousedown')
  };
  componentWillUnmount () {
    /* Remove event listener */
    if (this.innerDoc) this.innerDoc.removeEventListener('click', this.iFrameDispatcher)
    /* Remove style */
    var styleEl = document.getElementById('ola-styles')
    if (styleEl) styleEl.parentNode.removeChild(styleEl)
  }
  render () {
    let { isActive } = this.state
    let { iframeStyle, width, widthActive, height, heightActive, inline, zIndex, isDesktop } = this.props
    let frameStyles = {
      ...iframeStyle,
      ...isActive
        ? {
          top: 0,
          bottom: 0,
          right: 0,
          position: 'fixed',
          width: isDesktop ? widthActive : '100%',
          height: heightActive,
          zIndex
        }
        : {
          ...inline
            ? {}
            : {
              bottom: isDesktop ? 5 : 0,
              top: 'auto',
              right: 0,
              left: 'auto',
              width,
              height,
              zIndex,
              position: 'fixed'
            }
        }
    }
    return (
      <Frame
        style={frameStyles}
        head={this.props.head}
        id={OLACHAT_IFRAME_ID}
      >
        <Bot
          {...this.props}
          iFrame
          onBubbleClick={this.handleBubbleClick}
        />
      </Frame>
    )
  }
}

function mapStateToProps (state) {
  return {
    isDesktop: state.Device.isDesktop
  }
}

module.exports = connect(mapStateToProps)(Decorators.withLogger(BotFrame))
