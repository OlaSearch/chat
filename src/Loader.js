import React from 'react'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

/**
 * Loading indicator
 * @example ./../styleguide/Loader.md
 */
export default function Loader () {
  return (
    <TransitionGroup appear>
      <CSSTransition classNames='ola-fade' timeout={{ enter: 500, exit: 500 }}>
        <div className='typing-indicator'>
          <span />
          <span />
          <span />
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}
