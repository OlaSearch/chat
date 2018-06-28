import React from 'react'
import PropTypes from 'prop-types'
import Bot from './Bot'
import Frame from '@olasearch/react-frame-portal'
import { connect } from 'react-redux'
import { Decorators, Settings as OlaSettings } from '@olasearch/core'
import { setBotStatus } from './actions'
import {
  OLACHAT_IFRAME_CLASSNAME,
  OLACHAT_INVITE_IFRAME_CLASSNAME,
  BOT_ZINDEX,
  BOT_WIDTH_ACTIVE,
  BUBBLE_SPACING,
  BUBBLE_FULL_WIDTH_DESKTOP,
  BUBBLE_FULL_WIDTH_MOBILE,
  BUBBLE_FULL_HEIGHT
} from './Settings'
import InviteNotification from './InviteNotification'

const { STYLE_TAG_ID, MODAL_ROOT_CLASSNAME, BODY_STYLE_MODAL } = OlaSettings

/**
 * Iframe Bot holder
 * @example ./../styleguide/BotFrame.md
 */
class BotFrame extends React.Component {
  constructor (props) {
    super(props)
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
    inviteStyle: PropTypes.object,
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
    /**
     * If the bot is inline, always show it
     */
    if (this.props.inline && this.props.isDesktop) this.props.setBotStatus(true)

    /* Check if bot is active */
    if (this.props.isBotActive) {
      document.documentElement.classList.add(MODAL_ROOT_CLASSNAME)
    }

    this.appendStyles()
  }
  appendStyles () {
    /* Check if style tag is already added */
    if (this.props.isDesktop || document.getElementById(STYLE_TAG_ID)) return
    /* Add inline css */
    var style = document.createElement('style')
    style.id = STYLE_TAG_ID
    style.type = 'text/css'
    style.innerHTML = BODY_STYLE_MODAL
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
      inviteVisible,
      isBotActive,
      inviteStyle
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
          innerRef={this.registerRef}
          head={
            <React.Fragment>
              <meta
                name='viewport'
                content='width=device-width, initial-scale=1'
              />
              <link rel='stylesheet' href={this.props.cssUrl} />
              <link
                rel='preconnect'
                href='https://fonts.googleapis.com'
                crossOrigin='true'
              />
              <link
                rel='preconnect'
                href='https://fonts.gstatic.com'
                crossOrigin='true'
              />
            </React.Fragment>
          }
          className={OLACHAT_IFRAME_CLASSNAME}
          initialContent={this.props.initialContent}
          title='Ola Chat'
        >
          <React.Fragment>
            {css && <style>{css}</style>}
            <Bot {...this.props} showBubbleLabel={showBubbleLabel} iFrame />
          </React.Fragment>
        </Frame>
        {inviteVisible ? (
          <Frame
            style={{
              ...iframeStyle,
              position: 'fixed',
              zIndex,
              ...(isDesktop
                ? {
                  bottom: -5 /* There is a margin of 5px */,
                  right:
                      (showBubbleLabel ? width : widthMobile) + BUBBLE_SPACING
                }
                : {
                  bottom: 86,
                  right: 20
                }),
              ...inviteStyle,
              width: 300,
              height: 500 /* Adjust height later on */
            }}
            onLoad={() => {
              if (!this.inviteFrame) return
              /**
               * Set the height of iframe
               */
              this.inviteFrame.style.height =
                this.inviteFrame.contentWindow.document.body.scrollHeight + 'px'
            }}
            innerRef={el => {
              this.inviteFrame = el
            }}
            head={
              <React.Fragment>
                <meta
                  name='viewport'
                  content='width=device-width, initial-scale=1'
                />
                <link rel='stylesheet' href={this.props.cssUrl} />
              </React.Fragment>
            }
            className={OLACHAT_INVITE_IFRAME_CLASSNAME}
            initialContent={this.props.initialContent}
            title='Ola Chat'
          >
            <React.Fragment>
              {css && <style>{css}</style>}
              <InviteNotification {...this.props} iFrame />
            </React.Fragment>
          </Frame>
        ) : null}
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    isDesktop: state.Device.isDesktop,
    isBotActive: state.Conversation.isBotActive,
    inviteVisible: state.Conversation.inviteVisible
  }
}

export default connect(mapStateToProps, { setBotStatus })(
  Decorators.withLogger(BotFrame)
)
