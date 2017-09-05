import React from 'react'
import ReactDOM from 'react-dom'
import Bot from './Bot'
import Frame from 'react-frame-component'
import { connect } from 'react-redux'

class BotFrame extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: props.debug
    }
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
    let doc = ReactDOM.findDOMNode(this).contentDocument
    let messagesEl = doc.querySelector('.olachat-messages')
    if (!messagesEl) return
    messagesEl.addEventListener('click', (e) => {
      if (!e.target || e.target.nodeName !== 'A' || !e.target.href) return
      e.preventDefault()
      e.stopPropagation()
      /* Open link in new window */
      window.open(e.target.href)
    })
  }
  componentWillUnmount () {
    let doc = ReactDOM.findDOMNode(this).contentDocument
    let messagesEl = doc.querySelector('.olachat-messages')
    if (!messagesEl) return
    /* Remove event listener */
    messagesEl.removeEventListener('click')
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
