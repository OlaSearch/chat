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
  }
  static contextTypes = {
    document: PropTypes.object,
    window: PropTypes.object
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
  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.theme !== this.props.theme ||
      nextProps.isCollapsed !== this.props.isCollapsed
    )
  }
  handleClickOutside = () => {
    this.props.hide()
  }
  render () {
    const klass = classNames('olachat-helpmenu', {
      'olachat-helpmenu-open': this.props.isCollapsed
    })
    const { translate, config } = this.props
    const { botLinks = [] } = config
    return (
      <div className={klass}>
        <button
          className='olachat-helpmenu-button'
          onClick={this.props.toggleDisplay}
          type='button'
        >
          <Menu />
        </button>
        <div className='olachat-dp'>
          <div className='olachat-dp-title'>{translate('chat_menu')}</div>
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
            <a onClick={this.handlePrint} className='olachat-menu-link'>
              <Print /> {translate('chat_print')}
            </a>
          </div>
        </div>
        <style jsx>
          {`
            .olachat-dp {
              font-size: ${this.props.theme.mediumFontSize};
            }
            .olachat-helpmenu-button {
              color: ${this.props.theme.primaryColor};
            }
            .olachat-menu-link,
            .olachat-menu-link:hover,
            .olachat-menu-link:focus,
            .olachat-menu-link:active {
              color: ${this.props.theme.primaryColor};
            }
            .olachat-menu-link:hover {
              background-color: #f5f5f5;
            }
          `}
        </style>
      </div>
    )
  }
}

const HelpMenuContainer = listensToClickOutside(HelpMenu, {
  getDocument (instance) {
    return instance.context.document || document
  }
})
const HelpMenuWrapper = props => {
  return <HelpMenuContainer {...props} />
}

export default Decorators.withToggle(
  Decorators.withConfig(
    Decorators.withTranslate(Decorators.withLogger(HelpMenuWrapper))
  )
)
