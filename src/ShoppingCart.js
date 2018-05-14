import React from 'react'
import cx from 'classnames'
import { Decorators } from '@olasearch/core'
import ClipBoard from '@olasearch/icons/lib/clipboard'
import Trash from '@olasearch/icons/lib/trash-2'
import Plus from '@olasearch/icons/lib/plus-circle'
import Minus from '@olasearch/icons/lib/minus-circle'
import Edit from '@olasearch/icons/lib/arrow-right'
import Transition from 'react-transition-group/Transition'
import { connect } from 'react-redux'
import Button from './Button'
import { OLACHAT_IFRAME_ID, SUPPORTS_PASSIVE } from './Settings'

function EmptyCart ({ icon, title, subtitle }) {
  return (
    <div className='olachat-empty'>
      {icon && (
        <div className='olachat-empty-icon'>
          <img src={icon} />
        </div>
      )}
      <div className='olachat-empty-title'>{title}</div>
      <div className='olachat-empty-subtitle'>{subtitle}</div>
    </div>
  )
}
EmptyCart.defaultProps = {
  title: 'Your list is empty.',
  icon: null,
  subtitle: 'Use the chatbot to buy items.'
}

function CardField ({ label, value }) {
  const isArray = Array.isArray(value)
  return (
    <div className='olachat-module-field'>
      <div className='olachat-module-field-label'>{label}</div>
      {isArray ? (
        <div className='olachat-module-field-values'>
          {value.map((val, idx) => (
            <div key={idx} className='olachat-module-field-value ola-flex'>
              <span className='ola-flex-content'>{val}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className='olachat-module-field-value'>{value}</div>
      )}
    </div>
  )
}

class CardItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: props.isOpen
    }
  }
  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.isOpen === prevState.isOpen) {
      return null
    }
    return {
      isOpen: nextProps.isOpen
    }
  }
  toggle = () => this.setState({ isOpen: !this.state.isOpen })
  render () {
    const {
      title,
      subtitle,
      fields,
      buttons,
      onDelete,
      isEditing,
      deleteIcon: DeleteIcon,
      editIcon: EditIcon
    } = this.props
    const { isOpen } = this.state
    const classes = cx('olachat-module-group', {
      'olachat-module-isOpen': isOpen,
      'olachat-module-isEdit': isEditing
    })
    const deleteIcon = DeleteIcon ? (
      <DeleteIcon />
    ) : (
      <Trash stroke='grey' size='20' />
    )
    const editIcon = EditIcon ? <EditIcon /> : <Edit size='20' color='grey' />
    return (
      <div className={classes}>
        <div className='olachat-module-item ola-flex'>
          <button
            onClick={this.toggle}
            className='ola-btn olachat-module-expand'
          >
            {isEditing ? (
              editIcon
            ) : isOpen ? (
              <Minus size='20' color='grey' />
            ) : (
              <Plus size='20' color='grey' />
            )}
          </button>
          <div className='ola-flex-content' onClick={this.toggle}>
            <span className='olachat-module-item-title'>{title}</span>
            {subtitle && (
              <span className='olachat-module-item-subtitle'>{subtitle}</span>
            )}
          </div>
          {buttons.map((button, idx) => (
            <Button
              className='ola-btn olachat-module-remove'
              {...button}
              onClick={onDelete}
              key={idx}
            >
              {deleteIcon}
            </Button>
          ))}
        </div>
        {isOpen ? (
          <div className='olachat-module-attrs'>
            {fields.map((item, idx) => <CardField key={idx} {...item} />)}
          </div>
        ) : null}
      </div>
    )
  }
}

const duration = 200
const defaultStyle = {
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0
}
const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
}

class ShoppingCart extends React.Component {
  static defaultProps = {
    showClose: false
  }
  componentDidUpdate (prevProps) {
    if (
      this.props.isDesktop &&
      prevProps.cart !== this.props.cart &&
      this.bodyEl
    ) {
      /**
       * Always scroll to bottom if new items are added
       */
      this.bodyEl.scrollTop = this.bodyEl.scrollHeight
    }
  }
  registerRef = el => {
    this.bodyEl = el
  }
  componentDidMount () {
    if (this.props.config.stickySidebar && this.props.isDesktop) {
      this.iframe = document.getElementById(OLACHAT_IFRAME_ID)
      this.doc =
        document.documentElement || document.body.parentNode || document.body
      document.addEventListener(
        'scroll',
        this.handleSticky,
        SUPPORTS_PASSIVE ? { passive: true } : false
      )
    }
  }
  handleSticky = () => {
    const initialTop = 44
    window.requestAnimationFrame(() => {
      if (!this.moduleEl) return
      const iframeTop = this.iframe.offsetTop
      const moduleTop = this.moduleEl.offsetTop
      const scrollTop = this.doc.scrollTop
      this.moduleEl.style.marginTop =
        Math.max(0, scrollTop - iframeTop - initialTop) + 'px'
    })
  }
  handleEnter = () => {
    if (this.props.config.stickySidebar && this.props.isDesktop) { this.handleSticky() }
  }
  componentWillUnmount () {
    if (this.props.config.stickySidebar && this.props.isDesktop) {
      document.removeEventListener('scroll', this.handleSticky)
    }
  }
  registerModuleRef = el => {
    this.moduleEl = el
  }
  render () {
    const { cart, isVisible, theme, addMessage, config } = this.props
    if (!cart) return null
    const {
      chatBotCartEmptyTitle,
      chatBotCartEmptySubtitle,
      chatBotCartEmptyIcon,
      deleteIcon,
      editIcon
    } = config
    const { title, elements = [], buttons = [] } = cart
    const len = elements.length
    const isEmptyCart = len === 0
    return (
      <Transition
        in={isVisible}
        timeout={200}
        appear
        mountOnEnter
        unmountOnExit
        onEnter={this.handleEnter}
        onExit={this.handleUnMount}
      >
        {state => (
          <div
            className='olachat-module olachat-module-cart'
            ref={this.registerModuleRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          >
            <div className='olachat-module-title ola-flex'>
              <div className='ola-flex-content'>{title}</div>
            </div>
            <div className='olachat-module-body' ref={this.registerRef}>
              {isEmptyCart ? (
                <EmptyCart
                  title={chatBotCartEmptyTitle}
                  subtitle={chatBotCartEmptySubtitle}
                  icon={chatBotCartEmptyIcon}
                />
              ) : (
                elements.map((element, idx) => (
                  <CardItem
                    onDelete={addMessage}
                    key={idx}
                    isOpen={!element.subtitle}
                    isEditing={!element.subtitle}
                    deleteIcon={deleteIcon}
                    editIcon={editIcon}
                    {...element}
                  />
                ))
              )}
            </div>
            {isEmptyCart || !buttons.length ? null : (
              <div className='olachat-module-footer'>
                {buttons.map((button, idx) => (
                  <Button className='ola-btn ola-link' {...button} key={idx} />
                ))}
              </div>
            )}
          </div>
        )}
      </Transition>
    )
  }
}

function mapStateToProps (state) {
  return {
    cart: state.Conversation.cart
  }
}

export default connect(mapStateToProps)(Decorators.withConfig(ShoppingCart))
