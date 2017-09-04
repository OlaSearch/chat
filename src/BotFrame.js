import React from 'react'
import Bot from './Bot'
import Frame from 'react-frame-component'

class BotFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false
    }
  }
  handleBubbleClick = (isActive) => {
    this.setState({
      isActive
    })
  };
  static defaultProps = {
    width: 300,
    widthActive: 870,
    height: 60,
    heightActive: 'calc(100% - 40px)',
    iframeStyle: {
      position: 'fixed',
      right: 20,
      bottom: 20,
      zIndex: 99999,
      border: 'none',
      // padding: 3
    }
  }
  render () {
    let { isActive } = this.state
    let { iframeStyle, width, widthActive, height, heightActive } = this.props
    let frameStyles = {
      ...iframeStyle,
      ...isActive ? { height: heightActive, width: widthActive } : { height, width }
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

module.exports = BotFrame
