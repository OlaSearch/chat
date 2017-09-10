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
  toggle = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ isOpen: !this.state.isOpen })
  };
  handleClick = (e) => {
    if (!event) return
    if (event.target.href) return
    e.preventDefault()
    this.handleClickOutside()
    this.props.updateQueryTerm(e.target.text)
    this.props.onSubmit()
  }
  render () {
    let klass = classNames('olachat-helpmenu', {
      'olachat-helpmenu-open': this.state.isOpen
    })
    let { botMenu } = this.props
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
            {botMenu.map(({ label, url }, idx) => {
              return <a className='olachat-menu-link' href={url} key={idx} target='_blank' onClick={this.handleClick}>{label}</a>
            })}
          </div>
        </div>
      </div>
    )
  }
}

const HelpMenuContainer = listensToClickOutside(HelpMenu)
const HelpMenuWrapper = (props, { config: { botMenu } }) => {
  return <HelpMenuContainer botMenu={botMenu} {...props}  />
}
HelpMenuWrapper.contextTypes = {
  config: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}
HelpMenuWrapper.defaultProps = {
  botMenu: [
    {
      label: 'Help'
    }
  ]
}


module.exports = HelpMenuWrapper
