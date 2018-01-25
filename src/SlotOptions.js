import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateBotQueryTerm, clearBotQueryTerm } from './actions'
import { GeoLocation } from '@olasearch/core'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'
import { DISAMBIGUATION_INTENT_NAME } from './Settings'
import Navigation from '@olasearch/icons/lib/navigation'

class SlotOptions extends Component {
  handleClick = ({ label, value, intent }) => {
    /**
     * Check if current active intent is DISAMBIGUATION_INTENT_NAME
     */
    let args = { intent, value, label }
    if (intent === DISAMBIGUATION_INTENT_NAME) {
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
  onGeoSuccess = data => {
    if (!data) return
    this.props.clearBotQueryTerm()
    this.props.onSubmit({ intent: this.props.message.intent })
  }
  onIgnoreGeo = data => {
    this.props.clearBotQueryTerm()
    this.props.onSubmit({ intent: this.props.message.intent })
  }
  render () {
    let { options, isActive } = this.props
    /**
     * If message requires location and isActive
     */
    if (this.props.message.location && isActive && !this.props.location) {
      return (
        <div>
          <GeoLocation
            onSuccess={this.onGeoSuccess}
            icon={<Navigation />}
            className='ola-icon-btn'
          />
          <button onClick={this.onIgnoreGeo} className='ola-cancel-btn'>Ignore</button>
        </div>
      )
    }
    if (!options || !options.length) return null
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

    return (
      <div className='olachat-slots'>
        {this.props.reply && <div><div className='olachat-message-reply'>{this.props.reply}</div></div>}
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

export default connect(null, {
  updateQueryTerm: updateBotQueryTerm,
  clearBotQueryTerm
})(SlotOptions)
