import React from 'react'
import Bot from './Bot'
import Frame from 'react-frame-component'
import { connect } from 'react-redux'
import { Decorators, Settings as OlaSettings } from 'olasearch'
import { triggerMouseEvent } from './utils'
import { OLACHAT_IFRAME_ID } from './Settings'

const { STYLE_TAG_ID, MODAL_ROOT_CLASSNAME } = OlaSettings

class BotFrame extends React.Component {
  constructor(props) {
    super(props)
    this.addedIframeClickEvent = false
    this.addedMessageClickEvent = false
  }
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
    },
    activeStyle: {}
  }
  componentDidMount() {
    this.checkForListener()

    if (document.getElementById(STYLE_TAG_ID) || this.props.isDesktop) return
    /* Add inline css */
    var style = document.createElement('style')
    style.id = STYLE_TAG_ID
    style.type = 'text/css'
    style.innerHTML = this.props.isDesktop
      ? ``
      : `
      .${MODAL_ROOT_CLASSNAME}, .${MODAL_ROOT_CLASSNAME} body{
        -webkit-overflow-scrolling : touch !important;
        overflow: hidden !important;
        height: 100% !important;
    `
    document.getElementsByTagName('head')[0].appendChild(style)
  }
  componentDidUpdate(prevProps) {
    this.checkForListener()
    if (prevProps.isBotActive !== this.props.isBotActive) {
      document.documentElement.classList.toggle(
        MODAL_ROOT_CLASSNAME,
        this.props.isBotActive
      )
    }
  }
  checkForListener = () => {
    if (this.addedIframeClickEvent && this.addedMessageClickEvent) return

    this.iFrame = document.getElementById(OLACHAT_IFRAME_ID)
    this.innerDoc =
      this.iFrame.contentDocument || this.iFrame.contentWindow.document

    if (this.innerDoc && !this.addedIframeClickEvent) {
      this.innerDoc.addEventListener('click', this.iFrameDispatcher)
      this.addedIframeClickEvent = true
    }
  }
  iFrameDispatcher = e => {
    if (e.defaultPrevented) return
    if (typeof document !== 'undefined')
      triggerMouseEvent(document, 'mousedown')
  }
  componentWillUnmount() {
    /* Remove event listener */
    if (this.innerDoc)
      this.innerDoc.removeEventListener('click', this.iFrameDispatcher)
    /* Remove style */
    var styleEl = document.getElementById('ola-styles')
    if (styleEl) styleEl.parentNode.removeChild(styleEl)
  }
  render() {
    let { isBotActive } = this.props
    let {
      iframeStyle,
      width,
      widthActive,
      height,
      heightActive,
      inline,
      zIndex,
      isDesktop,
      activeStyle
    } = this.props
    let frameStyles = {
      ...iframeStyle,
      ...(isBotActive
        ? {
            top: 0,
            bottom: 0,
            right: 0,
            position: 'fixed',
            width: isDesktop ? widthActive : '100%',
            height: heightActive,
            zIndex,
            ...activeStyle
          }
        : {
            ...(inline
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
                })
          })
    }
    return (
      <Frame style={frameStyles} head={this.props.head} id={OLACHAT_IFRAME_ID}>
        <Bot {...this.props} iFrame onBubbleClick={this.handleBubbleClick} />
      </Frame>
    )
  }
}

function mapStateToProps(state) {
  return {
    isDesktop: state.Device.isDesktop,
    isBotActive: state.Conversation.isBotActive
  }
}

module.exports = connect(mapStateToProps)(Decorators.withLogger(BotFrame))
