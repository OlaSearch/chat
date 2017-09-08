import React from 'react'
import classNames from 'classnames'
import listensToClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'

class HelpMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }
  handleClickOutside = (event) => {
    this.setState({
      isOpen: false
    })
  };
  static defaultProps = {
    helpItems: []
  };
  toggle = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ isOpen: !this.state.isOpen })
  };
  render () {
    let klass = classNames('olachat-helpmenu', {
      'olachat-helpmenu-open': this.state.isOpen
    })
    let { helpItems } = this.props
    return (
      <div className={klass}>
        <button className='olachat-helpmenu-button' onClick={this.toggle} type='button'>
          <span>Help</span>
        </button>
        <div className='olachat-dp'>
          <div className='olachat-dp-title'>
            Menu
          </div>
          <div className='olachat-dp-body'>
            {helpItems.map(({ label, url }, idx) => {
              return <a href={url} key={idx} target='_blank'>{label}</a>
            })}
          </div>
        </div>
      </div>
    )
  }
}

const HelpMenuContainer = listensToClickOutside(HelpMenu)
const HelpMenuWrapper = (props, { config: { helpItems } }) => {
  if (helpItems && helpItems.length) return <HelpMenuContainer {...props} helpItems={helpItems} />
  return null
}
HelpMenuWrapper.contextTypes = {
  config: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}

module.exports = HelpMenuWrapper
