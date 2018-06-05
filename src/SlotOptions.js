import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateBotQueryTerm } from './actions'
import { DISAMBIGUATION_INTENT_NAME, SLOT_STYLE_LIST } from './Settings'
import SlotMultiple from './SlotMultiple'
import cx from 'classnames'

/**
 * Slot options
 * @example ./../styleguide/SlotOptions.md
 */
class SlotOptions extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }
  static defaultProps = {
    max: 5
  }
  handleOpen = () => {
    this.setState({
      isOpen: true
    })
  }
  handleClick = ({ label, value, intent: selectedIntent, payload }) => {
    /**
     * Check if current active intent is DISAMBIGUATION_INTENT_NAME
     */
    const args = { intent: selectedIntent, value, label, ...payload }
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
    /**
     * Log slot click event
     */
    this.props.log({
      eventCategory: 'slot',
      eventLabel: label,
      eventAction: 'click',
      eventType: 'C',
      result: { title: label } /* Used to quickly find title in admin panel */,
      payload: { bot: true }
    })
  }
  render () {
    const { slot, isActive, max } = this.props
    const { options, multiple, style } = slot
    if (!options || !options.length) return null
    const len = options.length
    const { isOpen } = this.state
    if (multiple) {
      return (
        <SlotMultiple
          slot={slot}
          isActive={isActive}
          onSubmit={this.props.onSubmit}
          intent={this.props.intent}
          updateQueryTerm={this.props.updateQueryTerm}
        />
      )
    }
    const replies = options
      .slice(
        0,
        style === SLOT_STYLE_LIST ? (isOpen ? undefined : max) : undefined
      )
      .map(({ label, value, intent }, idx) => (
        <QuickReplyButton
          key={idx}
          intent={intent}
          label={label}
          value={value}
          isActive={isActive}
          handleClick={this.handleClick}
        />
      ))

    const classes = cx('olachat-slots', {
      'olachat-slots-style-list': style === SLOT_STYLE_LIST
    })

    const showMoreButton = style === SLOT_STYLE_LIST && !isOpen && len > max

    return (
      <div className={classes}>
        <div className='olachat-slots-list'>
          {replies}
          {showMoreButton ? (
            <button
              className='olachat-slots-button olachat-slots-showmore'
              type='button'
              disabled={!isActive}
              onClick={this.handleOpen}
            >
              Show all
            </button>
          ) : null}
        </div>
      </div>
    )
  }
}

function QuickReplyButton ({
  label,
  value,
  intent,
  payload,
  handleClick,
  isActive
}) {
  function onClick () {
    handleClick({ label, value, intent, payload })
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
