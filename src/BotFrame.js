import React from 'react'
import PropTypes from 'prop-types'
import Bot from './Bot'
import Frame from 'react-frame-component'
import { connect } from 'react-redux'
import { Decorators, Settings as OlaSettings } from '@olasearch/core'
import { triggerMouseEvent } from './utils'
import {
  OLACHAT_IFRAME_ID,
  OLACHAT_INVITE_IFRAME_ID,
  BOT_ZINDEX,
  BOT_WIDTH_ACTIVE,
  BUBBLE_HEIGHT_MOBILE,
  BUBBLE_WIDTH_DESKTOP,
  BUBBLE_WIDTH_MOBILE,
  BUBBLE_SPACING,
  BUBBLE_FULL_WIDTH_DESKTOP,
  BUBBLE_FULL_WIDTH_MOBILE,
  BUBBLE_FULL_HEIGHT
} from './Settings'
import InviteNotification from './InviteNotification'

const { STYLE_TAG_ID, MODAL_ROOT_CLASSNAME } = OlaSettings

/**
 * Iframe Bot holder
 * @example ./../styleguide/BotFrame.md
 */
class BotFrame extends React.Component {
  constructor (props) {
    super(props)
    this.addedIframeClickEvent = false
    this.addedMessageClickEvent = false
  }
  static propTypes = {
    /**
     * Show the chatbot as part of page content
     */
    inline: PropTypes.bool,
    /** Additional CSS that can be injected into iframe */
    css: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    widthMobile: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    widthActive: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    heightActive: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    inlineHeightActive: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    /**
     * z-index of the chatbot
     */
    zIndex: PropTypes.number,
    iframeStyle: PropTypes.object,
    cssUrl: PropTypes.string,
    activeStyle: PropTypes.object,
    initialContent: PropTypes.string,
    /**
     * Header props
     */
    headerProps: PropTypes.shape({
      title: PropTypes.string
    }),
    /**
     * Avatar props
     */
    avatarProps: PropTypes.shape({
      avatarBot: PropTypes.string,
      avatarUser: PropTypes.string
    }),
    /**
     * Bubble props
     */
    bubbleProps: PropTypes.shape({
      label: PropTypes.string
    }),
    /**
     * Bot props
     */
    botProps: PropTypes.shape({
      botName: PropTypes.string,
      userName: PropTypes.string
    })
  }
  static defaultProps = {
    width: BUBBLE_FULL_WIDTH_DESKTOP,
    widthMobile: BUBBLE_FULL_WIDTH_MOBILE,
    widthActive: BOT_WIDTH_ACTIVE /* 410 */,
    height: BUBBLE_FULL_HEIGHT,
    inlineHeightActive: 600,
    heightActive: '100%' /* 620 */,
    /* Flag to add the chatbot as an inline element */
    inline: false,
    zIndex: BOT_ZINDEX,
    css: null,
    iframeStyle: {
      border: 'none',
      maxWidth: '100%'
    },
    cssUrl: 'https://cdn.olasearch.com/assets/css/olasearch.core.min.css',
    activeStyle: {},
    initialContent: `
      <!doctype html>
      <html class='olachat-html'>
        <head>
          <base target='_parent'>
        </head>
        <body class='olachat-body' style='overflow: hidden;'>
          <div class='frame-root'></div>
        </body>
      </html>
    `
  }
  componentDidMount () {
    /* On Mount */
    this.props.onMount &&
      this.props.onMount(
        document.getElementById(OLACHAT_IFRAME_ID).contentDocument
      )

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
  render () {
    const { isBotActive } = this.props
    const {
      iframeStyle,
      css,
      width,
      widthMobile,
      widthActive,
      height,
      heightActive,
      inlineHeightActive,
      inline,
      zIndex,
      isDesktop,
      activeStyle,
      bubbleProps,
      inviteVisible
    } = this.props

    /* Check if chatbot label is present */
    const hasLabel = bubbleProps && !!bubbleProps.label
    const showBubbleLabel = this.props.isDesktop
      ? hasLabel
      : inline ? hasLabel : false

    const frameStyles = {
      ...iframeStyle,
      ...(isBotActive
        ? {
          top: 'auto',
          bottom: 0,
          right: 0,
          position: inline && isDesktop ? 'relative' : 'fixed',
          width: isDesktop ? widthActive : '100%',
          height: inline && isDesktop ? inlineHeightActive : heightActive,
          maxHeight: '100%',
          zIndex,
          ...activeStyle
        }
        : {
          ...(inline
            ? {
              height: BUBBLE_FULL_HEIGHT,
              width: showBubbleLabel ? width : widthMobile
            }
            : {
              bottom: BUBBLE_SPACING,
              top: 'auto',
              right: BUBBLE_SPACING,
              left: 'auto',
              width: showBubbleLabel ? width : widthMobile,
              height,
              zIndex,
              position: 'fixed'
            })
        })
    }
    return (
      <React.Fragment>
        <Frame
          style={frameStyles}
          head={
            <div>
              <link rel='stylesheet' href={this.props.cssUrl} />
              {css && <style>{css}</style>}
              <meta
                name='viewport'
                content='width=device-width, initial-scale=1'
              />
            </div>
          }
          id={OLACHAT_IFRAME_ID}
          initialContent={this.props.initialContent}
          title='Ola Chat'
        >
          <Bot {...this.props} showBubbleLabel={showBubbleLabel} iFrame />
        </Frame>
        {inviteVisible ? (
          <Frame
            style={{
              ...iframeStyle,
              position: 'fixed',
              bottom: 86,
              right: 20,
              width: 300,
              height: 120
            }}
            head={
              <div>
                <link rel='stylesheet' href={this.props.cssUrl} />
                <meta
                  name='viewport'
                  content='width=device-width, initial-scale=1'
                />
              </div>
            }
            id={OLACHAT_INVITE_IFRAME_ID}
            initialContent={this.props.initialContent}
            title='Ola Chat'
          >
            <InviteNotification {...this.props} iFrame />
          </Frame>
        ) : null}
      </React.Fragment>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    isDesktop: state.Device.isDesktop,
    isBotActive: state.Conversation.isBotActive,
    inviteVisible: state.Conversation.inviteVisible
  }
}

export default connect(mapStateToProps)(Decorators.withLogger(BotFrame))
