import React from 'react'
import Bot from './Bot'
import Frame from 'react-frame-component'
import { connect } from 'react-redux'
import { Decorators, Settings as OlaSettings } from '@olasearch/core'
import { triggerMouseEvent } from './utils'
import { OLACHAT_IFRAME_ID } from './Settings'

const { STYLE_TAG_ID, MODAL_ROOT_CLASSNAME } = OlaSettings

class BotFrame extends React.Component {
  constructor (props) {
    super(props)
    this.addedIframeClickEvent = false
    this.addedMessageClickEvent = false
  }
  static defaultProps = {
    width: 320,
    widthMobile: 100,
    widthActive: 880,
    height: 85,
    heightActive: '100%',
    inline: false,
    zIndex: 99999999,
    iframeStyle: {
      border: 'none',
      maxWidth: '100%'
    },
    activeStyle: {},
    initialContent:
      '<!DOCTYPE html><html><head><base target="_parent"></head><body class="olachat-body"><div class="frame-root"></div></body></html>'
  }
  componentDidMount () {
    /* Check if bot is active */
    if (this.props.isBotActive) {
      document.documentElement.classList.add(MODAL_ROOT_CLASSNAME)
    }
    /* Check if style tag is already added */
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
  componentDidUpdate (prevProps) {
    if (prevProps.isBotActive !== this.props.isBotActive) {
      document.documentElement.classList.toggle(
        MODAL_ROOT_CLASSNAME,
        this.props.isBotActive
      )
    }
  }
  componentWillUnmount () {
    /* Remove style: DONOT REMOVE STYLE as it may be used by Ola Search */
    // var styleEl = document.getElementById('ola-styles')
    // if (styleEl) styleEl.parentNode.removeChild(styleEl)
  }
  render () {
    let { isBotActive } = this.props
    let {
      iframeStyle,
      width,
      widthMobile,
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
              width: isDesktop ? width : widthMobile,
              height,
              zIndex,
              position: 'fixed'
            })
        })
    }
    return (
      <Frame
        style={frameStyles}
        head={this.props.head}
        id={OLACHAT_IFRAME_ID}
        initialContent={this.props.initialContent}
        title='Ola Chat'
      >
        <Bot {...this.props} iFrame />
      </Frame>
    )
  }
}

function mapStateToProps (state) {
  return {
    isDesktop: state.Device.isDesktop,
    isBotActive: state.Conversation.isBotActive
  }
}

module.exports = connect(mapStateToProps)(Decorators.withLogger(BotFrame))
