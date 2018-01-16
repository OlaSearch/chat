import React, { Component } from 'react'
import { connect } from 'react-redux'
import { updateBotQueryTerm } from './actions'
import { Actions, GeoLocation } from '@olasearch/core'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import CSSTransition from 'react-transition-group/CSSTransition'
import { DISAMBIGUATION_INTENT_NAME } from './Settings'

class SlotOptions extends Component {
  handleClick = ({ label, value, intent: selectedIntent }) => {
    let { intent } = this.props
    let args =
      intent === DISAMBIGUATION_INTENT_NAME ? { intent: selectedIntent } : {}
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
    // if (!data) return
    // let latlng = `${data.coords.latitude}`
    // this.props.onSubmit()
  }
  render() {
    let { options, isActive } = this.props
    // return (
    //   <div><GeoLocation onSuccess={this.onGeoSuccess} /></div>
    // )
    if (!options || !options.length) return null
    let replies = options.map(({ label, value, intent }, idx) => (
      <CSSTransition
        key={idx}
        timeout={{ enter: 300, exit: 300 }}
        classNames="slots"
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
      <div className="olachat-slots">
        <TransitionGroup appear className="olachat-slots-list">
          {replies}
        </TransitionGroup>
      </div>
    )
  }
}

function QuickReplyButton({ label, value, intent, handleClick, isActive }) {
  function onClick() {
    handleClick({ label, value, intent })
  }
  return (
    <button
      className="olachat-slots-button"
      type="button"
      onClick={onClick}
      disabled={!isActive}
    >
      {label}
    </button>
  )
}

export default connect(null, {
  updateQueryTerm: updateBotQueryTerm
})(SlotOptions)
