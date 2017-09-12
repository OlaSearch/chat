import React from 'react'
import Bot from './Bot'
import Frame from 'react-frame-component'
import { connect } from 'react-redux'
import { Decorators } from 'olasearch'
import { triggerMouseEvent, closest } from './utils'

const OLACHAT_IFRAME_ID = 'olachat-iframe'
const OLACHAT_MESSAGE_ELEMENT = '.olachat-message-reply'

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
  }
  componentDidUpdate () {
    this.checkForListener()
  }
  checkForListener = () => {
    if (this.addedIframeClickEvent && this.addedMessageClickEvent) return

    this.iFrame = document.getElementById(OLACHAT_IFRAME_ID)
    this.innerDoc = this.iFrame.contentDocument || this.iFrame.contentWindow.document
    this.messagesEl = this.innerDoc.querySelector('.olachat-messages')

    if (this.messagesEl && !this.addedMessageClickEvent) {
      this.messagesEl.addEventListener('click', this.clickListener)
      this.addedMessageClickEvent = true
    }

    if (this.innerDoc && !this.addedIframeClickEvent) {
      this.innerDoc.addEventListener('click', this.iFrameDispatcher)
      this.addedIframeClickEvent = true
    }
  }
  iFrameDispatcher = (e) => {
    if (e.defaultPrevented) return
    if (typeof (document) !== 'undefined') triggerMouseEvent(document, 'mousedown')
  };
  clickListener = (e) => {
    if (!e.target || e.target.nodeName !== 'A' || !e.target.href) return
    /* Check if its outside the message */
    if (!closest(this.innerDoc, e.target, OLACHAT_MESSAGE_ELEMENT)) return
    e.preventDefault()
    /* Open link in new window */
    window.open(e.target.href)
    /* Log */
    this.props.log({
      eventLabel: e.target.text,
      eventCategory: 'message_link',
      eventType: 'C',
    })
  };
  componentWillUnmount () {
    /* Remove event listener */
    if (this.messagesEl) this.messagesEl.removeEventListener('click', this.clickListener)
    if (this.innerDoc) this.innerDoc.removeEventListener('click', this.iFrameDispatcher)
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
