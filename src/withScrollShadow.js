import React from 'react'
import css from 'dom-css'
import { Scrollbars } from 'react-custom-scrollbars'

module.exports = (WrappedComponent) => {
  class WithScrollShadow extends React.Component {
    static defaultProps = {
      height: 400,
      autoHide: true
    };
    handleScroll = (values) => {
      const { shadowTop, shadowBottom } = this.refs
      const { scrollTop, scrollHeight, clientHeight } = values;
      const shadowTopOpacity = 1 / 20 * Math.min(scrollTop, 20)
      const bottomScrollTop = scrollHeight - clientHeight
      const shadowBottomOpacity = 1 / 20 * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20))
      css(shadowTop, { opacity: shadowTopOpacity })
      css(shadowBottom, { opacity: shadowBottomOpacity })
    };
    render () {
      const shadowTopStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 10,
        background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 100%)',
      }
      const shadowBottomStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 10,
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 100%)',
      }
      const { projectId, projects, ...props} = this.props
      return (
        <div className='ScrollWrapper'>
          <Scrollbars
            onUpdate={this.handleScroll}
            autoHide={this.props.autoHide}
            hideTracksWhenNotNeeded
            {...props}
          >
            <WrappedComponent {...this.props} />
          </Scrollbars>
          <div
            ref='shadowTop'
            style={shadowTopStyle}
          />
          <div
            ref='shadowBottom'
            style={shadowBottomStyle}
          />
        </div>
      )
    }
  }
  return WithScrollShadow
}
