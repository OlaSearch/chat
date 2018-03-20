import React, { Component } from 'react'
import { connect } from 'react-redux'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'
import { updateBotQueryTerm } from './actions'

/**
 * Suggest Did you mean topics to user
 * @example ./../styleguide/TopicSuggestions.md
 */
export default function TopicSuggestions ({
  options,
  onSubmit,
  updateQueryTerm,
  isActive
}) {
  const replies = options.map(({ label }, idx) => {
    return (
      <CSSTransition
        key={idx}
        timeout={{ enter: 300, exit: 300 }}
        classNames='slots'
      >
        <button
          className='olachat-slots-button'
          type='button'
          onClick={() => {
            updateQueryTerm(label)
            onSubmit()
          }}
          disabled={!isActive}
        >
          {label}
        </button>
      </CSSTransition>
    )
  })
  return (
    <div className='olachat-slots'>
      <div className='olachat-message-reply olachat-message-reply-suggestion'>
        Did you mean
      </div>
      <TransitionGroup appear className='olachat-slots-list'>
        {replies}
      </TransitionGroup>
    </div>
  )
}
