import React from 'react'
import cx from 'classnames'
import { createMessageMarkup } from './utils'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

const defaultStyle = {
  transition: `all 200ms ease-in-out`,
  opacity: 0,
  transform: 'translate3d(0, 2px, 0)',
  maxHeight: 0
}

const transitionStyles = {
  entering: { opacity: 0, transform: 'translate3d(0, 2px, 0)', maxHeight: 0 },
  entered: { opacity: 1, transform: 'translate3d(0, 0px, 0)', maxHeight: 500 }
}

export default function ReplyText ({ text, isActive }) {
  if (!text) return null
  const isMultiple = Array.isArray(text)
  const len = isMultiple ? text.length : 0
  const classes = cx('olachat-message-reply-multiple', {
    'olachat-message-reply-single': len === 1
  })
  const content = isMultiple
    ? text.map((item, idx) => (
      <CSSTransition
        key={idx}
        timeout={{
          enter: 400 * idx
        }}
        classNames='message-anim'
        unmountOnExit
        mountOnEnter
      >
        {state => {
          const style =
              len === 1 || !isActive
                ? {}
                : {
                  ...defaultStyle,
                  ...transitionStyles[state]
                }
          return (
            <div key={idx} className={classes} style={style}>
              <div
                className='olachat-message-reply'
                dangerouslySetInnerHTML={createMessageMarkup(item)}
              />
            </div>
          )
        }}
      </CSSTransition>
    ))
    : text
  return (
    <React.Fragment>
      {isMultiple ? (
        <TransitionGroup appear className='olachat-message-reply-list'>
          {content}
        </TransitionGroup>
      ) : (
        <div
          className='olachat-message-reply'
          dangerouslySetInnerHTML={createMessageMarkup(content)}
        />
      )}
    </React.Fragment>
  )
}
