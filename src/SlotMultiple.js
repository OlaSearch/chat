import React from 'react'
import cx from 'classnames'
import { Checkbox } from '@olasearch/core'

class SlotMultiple extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: []
    }
  }
  onSelect = event => {
    let { selected } = this.state
    if (event.target.checked) {
      selected = [...selected, event.target.value]
    } else {
      selected = selected.filter(item => item !== event.target.value)
    }
    this.setState({
      selected
    })
  }
  handleSubmit = () => {
    const { selected } = this.state
    const { intent } = this.props
    const slots = selected.map(value => {
      return {
        name: this.props.slot.name,
        value
      }
    })
    const messageLabel = this.props.slot.options
      .filter(({ value }) => selected.indexOf(value) !== -1)
      .map(({ label }) => label)
      .join('\r\n')
    this.props.updateQueryTerm(messageLabel)
    this.props.onSubmit({ slots, intent })
  }
  render () {
    const { slot, isActive } = this.props
    const { selected } = this.state
    const { options } = slot
    const buttonClass = cx('olachat-btn-primary', {
      'ola-visibility-hidden': !selected.length
    })
    return (
      <div className='olachat-slots-multiple-group'>
        <div className='olachat-slots-multiple'>
          {options.map(({ label, value }, idx) => {
            const isChecked = selected.indexOf(value) !== -1
            return (
              <Checkbox
                key={idx}
                onChange={this.onSelect}
                value={value}
                checked={isChecked}
                disabled={!isActive}
                label={label}
                parentClassName='olachat-slots-multiple-item'
              />
            )
          })}
        </div>
        {isActive ? (
          <button
            className={buttonClass}
            type='button'
            onClick={this.handleSubmit}
            disabled={!selected.length}
          >
            Next
          </button>
        ) : null}
      </div>
    )
  }
}

export default SlotMultiple
