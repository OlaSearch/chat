import React from 'react'
import classNames from 'classnames'
import listensToClickOutside from '@olasearch/react-onclickoutside'
import PropTypes from 'prop-types'
import { Decorators } from '@olasearch/core'
import { OLACHAT_IFRAME_ID } from './Settings'
import Menu from '@olasearch/icons/lib/menu'
import Print from '@olasearch/icons/lib/printer'

class HelpMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }
  }
  static contextTypes = {
    document: PropTypes.object,
    window: PropTypes.object
  }
  handleClickOutside = event => {
    if (!this.state.isOpen) return
    this.setState({
      isOpen: false
    })
  }
  toggleMenu = event => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({ isOpen: !this.state.isOpen })
  }
  handleClick = event => {
    if (event.target.href && event.target.href !== '') {
      return this.props.log({
        eventType: 'C',
        eventCategory: 'menu',
        eventLabel: event.target.text,
        result: { title: event.target.text },
        payload: { bot: true }
      })
    }
    event.preventDefault()
    this.handleClickOutside()
    this.props.updateQueryTerm(event.target.text)
    this.props.onSubmit()
  }
  handlePrint = () => {
    if (this.context.window) {
      this.context.window.print()
    } else {
      window.print()
    }
  }
  static defaultProps = {
    botLinks: []
  }
  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextState !== this.state
    )
  }
  render () {
    let klass = classNames('olachat-helpmenu', {
      'olachat-helpmenu-open': this.state.isOpen
    })
    let { botLinks, translate } = this.props
    return (
      <div className={klass}>
        <button
          className='olachat-helpmenu-button'
          onClick={this.toggleMenu}
          type='button'
        >
          <Menu />
        </button>
        <div className='olachat-dp'>
          <div className='olachat-dp-title'>{translate('menu')}</div>
          <div className='olachat-dp-body'>
            {botLinks.map(({ title, url }, idx) => {
              return (
                <a
                  className='olachat-menu-link'
                  href={url || null}
                  key={idx}
                  target='_blank'
                  onClick={this.handleClick}
                >
                  {title}
                </a>
              )
            })}
            <a onClick={this.handlePrint}>
              <Print /> {translate('print')}
            </a>
          </div>
        </div>
      </div>
    )
  }
}

const HelpMenuContainer = listensToClickOutside(HelpMenu, {
  getDocument (instance) {
    return instance.context.document || document
  }
})
const HelpMenuWrapper = (props, { config: { botLinks } }) => {
  return <HelpMenuContainer {...props} botLinks={botLinks} />
}
HelpMenuWrapper.contextTypes = {
  config: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
}

module.exports = Decorators.injectTranslate(Decorators.withLogger(HelpMenuWrapper))
