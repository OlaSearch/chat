import React from 'react'
import Bot from './Bot'
import Frame from 'react-frame-component'
import { connect } from 'react-redux'
import { triggerMouseEvent } from './utils'

const OLACHAT_IFRAME_ID = 'olachat-iframe'
class BotFrame extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: props.debug
    }
    this.addedClickEvtListener = false
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
    zIndex: 9999,
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
    if (this.addedClickEvtListener) return
    this.iFrame = document.getElementById(OLACHAT_IFRAME_ID)
    this.innerDoc = this.iFrame.contentDocument || this.iFrame.contentWindow.document
    this.messagesEl = this.innerDoc.querySelector('.olachat-messages')

    this.addedClickEvtListener = true
    if (this.messagesEl) this.messagesEl.addEventListener('click', this.clickListener)
    if (this.innerDoc) this.innerDoc.addEventListener('click', this.iFrameDispatcher)
  }
  iFrameDispatcher = (e) => {
    if (e.defaultPrevented) return
    if (typeof (document) !== 'undefined') triggerMouseEvent(document, 'mousedown')
  };
  clickListener = (e) => {
    if (!e.target || e.target.nodeName !== 'A' || !e.target.href) return
    e.preventDefault()
    /* Open link in new window */
    window.open(e.target.href)
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
              bottom: 0,
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

module.exports = connect(mapStateToProps)(BotFrame)
