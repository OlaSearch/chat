import React from 'react'
import { Decorators, Swipeable } from '@olasearch/core'
import { EMPTY_ARRAY } from './Settings'

/**
 * Quick replies
 * @example ./../styleguide/QuickReplies.md
 */
class QuickReplies extends React.PureComponent {
  handleClick = ({ label, intent, value, payload }) => {
    const args = intent ? { label, intent, value, ...payload } : {}
    this.props.updateQueryTerm(label)
    this.props.onSubmit(args)
    this.props.log({
      eventCategory: 'quick_reply',
      eventLabel: label,
      eventAction: 'click',
      eventType: 'C',
      result: { title: label } /* Used to quickly find title in admin panel */,
      payload: { bot: true }
    })
  }
  static defaultProps = {
    quickReplies: EMPTY_ARRAY
  }
  render () {
    const { quickReplies } = this.props
    if (!quickReplies.length) return null
    return (
      <Swipeable
        className='olachat-quickreplies-swipe'
        itemWidth='auto'
        showNavigation={false}
      >
        {quickReplies.map((item, idx) => (
          <QuickReplyButton
            key={idx}
            handleClick={this.handleClick}
            {...item}
          />
        ))}
      </Swipeable>
    )
  }
}

function QuickReplyButton (item) {
  const { label, handleClick } = item
  function onClick () {
    handleClick(item)
  }

  return (
    <button
      className='olachat-quickreplies-button'
      type='button'
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Decorators.withLogger(QuickReplies)
