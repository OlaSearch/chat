import React from 'react'
import classNames from 'classnames'
import listensToClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'

class HelpMenu extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      isOpen: false
    }
  }
  static contextTypes = {
    config: PropTypes.object
  };
  handleClickOutside = (event) => {
    this.setState({
      isOpen: false
    })
  };
  toggle = () => this.setState({ isOpen: !this.state.isOpen });
  render () {
    let klass = classNames('olachat-helpmenu', {
      'olachat-helpmenu-open': this.state.isOpen
    })
    let { helpItems } = this.context.config
    if (!helpItems || !helpItems.length) return null
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
              return <a href={url} key={idx}>{label}</a>
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default listensToClickOutside(HelpMenu)
