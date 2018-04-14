import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateBotQueryTerm } from './actions'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'
import { DISAMBIGUATION_INTENT_NAME, SLOT_STYLE_LIST } from './Settings'
import SlotMultiple from './SlotMultiple'
import cx from 'classnames'

/**
 * Slot options
 * @example ./../styleguide/SlotOptions.md
 */
class SlotOptions extends Component {
  handleClick = ({ label, value, intent: selectedIntent }) => {
    /**
     * Check if current active intent is DISAMBIGUATION_INTENT_NAME
     */
    let args = { intent: selectedIntent, value, label }
    if (this.props.intent === DISAMBIGUATION_INTENT_NAME) {
      /* Send for Intent training */
      this.props.log({
        eventLabel: selectedIntent,
        eventCategory: 'intent_training',
        eventType: 'O',
        payload: { bot: true }
      })
    }
    this.props.updateQueryTerm(label)
    this.props.onSubmit(args)
  }
  render () {
    const { slot, isActive } = this.props
    const { options, multiple, style } = slot
    if (!options || !options.length) return null
    if (multiple) {
      return (
        <CSSTransition timeout={300} classNames='slots'>
          <SlotMultiple
            slot={slot}
            isActive={isActive}
            onSubmit={this.props.onSubmit}
            intent={this.props.intent}
            updateQueryTerm={this.props.updateQueryTerm}
          />
        </CSSTransition>
      )
    }
    let replies = options.map(({ label, value, intent }, idx) => (
      <CSSTransition
        key={idx}
        timeout={{ enter: 300, exit: 300 }}
        classNames='slots'
      >
        <QuickReplyButton
          intent={intent}
          label={label}
          value={value}
          isActive={isActive}
          handleClick={this.handleClick}
        />
      </CSSTransition>
    ))

    const classes = cx('olachat-slots', {
      'olachat-slots-style-list': style === SLOT_STYLE_LIST
    })

    return (
      <div className={classes}>
        <TransitionGroup appear className='olachat-slots-list'>
          {replies}
        </TransitionGroup>
      </div>
    )
  }
}

function QuickReplyButton ({ label, value, intent, handleClick, isActive }) {
  function onClick () {
    handleClick({ label, value, intent })
  }
  return (
    <button
      className='olachat-slots-button'
      type='button'
      onClick={onClick}
      disabled={!isActive}
    >
      {label}
    </button>
  )
}

export default SlotOptions
