import React from 'react'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'

export default function Loader ({ theme }) {
  return (
    <TransitionGroup appear>
      <CSSTransition classNames='ola-fade' timeout={{ enter: 500, exit: 500 }}>
        <div className='typing-indicator'>
          <span />
          <span />
          <span />
        </div>
      </CSSTransition>
      <style jsx>
        {`
          .typing-indicator span {
            background-color: ${theme.primaryColor};
          }
        `}
      </style>
    </TransitionGroup>
  )
}
