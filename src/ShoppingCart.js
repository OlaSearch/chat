import React from 'react'
import cx from 'classnames'
import { Decorators } from '@olasearch/core'
import ClipBoard from '@olasearch/icons/lib/clipboard'
import Trash from '@olasearch/icons/lib/trash-2'
import Close from '@olasearch/icons/lib/x'
import Plus from '@olasearch/icons/lib/plus-circle'
import Minus from '@olasearch/icons/lib/minus-circle'
import Transition from 'react-transition-group/Transition'
import { connect } from 'react-redux'
import Button from './Button'

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
  toggle = () => this.setState({ isOpen: !this.state.isOpen })
  render () {
    const { title, subtitle, fields, buttons, onDelete } = this.props
    const { isOpen } = this.state
    const classes = cx('olachat-module-group', {
      'olachat-module-isOpen': isOpen
    })
    return (
      <div className={classes}>
        <div className='olachat-module-item ola-flex'>
          <button
            onClick={this.toggle}
            className='ola-btn olachat-module-expand'
          >
            {isOpen ? (
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
              <Trash stroke='grey' size='20' />
            </Button>
          ))}
        </div>
        {isOpen ? (
          <div className='olachat-module-attrs'>
            {fields.map((item, idx) => {
              return <CardField key={idx} {...item} />
            })}
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

function ShoppingCart ({
  cart,
  isVisible,
  theme,
  onClose,
  showClose,
  addMessage,
  config
}) {
  if (!cart) return null
  const { cartConfig = {} } = config
  const {
    checkoutLinkComponent: Checkout,
    emptyTitle,
    emptySubtitle,
    emptyIcon
  } = cartConfig
  const { title, elements = [] } = cart
  const len = elements.length
  return (
    <div className='olachat-module-wrap'>
      <Transition
        in={isVisible}
        timeout={200}
        appear
        mountOnEnter
        unmountOnExit
      >
        {state => (
          <div
            className='olachat-module-flex'
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          >
            <div className='olachat-module olachat-module-cart'>
              <div className='olachat-module-title ola-flex'>
                <div className='ola-flex-icon'>
                  <ClipBoard />
                </div>
                <div className='ola-flex-content'>{title}</div>
                {showClose ? (
                  <button className='ola-btn' onClick={onClose}>
                    <Close />
                  </button>
                ) : null}
              </div>
              <div className='olachat-module-body'>
                {elements.length ? (
                  elements.map((element, idx) => (
                    <CardItem
                      onDelete={addMessage}
                      key={idx}
                      isOpen={idx === len - 1}
                      {...element}
                    />
                  ))
                ) : (
                  <EmptyCart
                    title={emptyTitle}
                    icon={emptyIcon}
                    subtitle={emptySubtitle}
                  />
                )}
              </div>
              {elements.length ? (
                <div className='olachat-module-footer'>
                  <Checkout />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Transition>
      <style jsx>
        {`
          .olachat-module-wrap :global(.olachat-module-item-title) {
            color: ${theme.primaryColor};
          }
        `}
      </style>
    </div>
  )
}

ShoppingCart.defaultProps = {
  showClose: false
}

function mapStateToProps (state) {
  return {
    cart: state.Conversation.cart
  }
}

export default connect(mapStateToProps)(Decorators.withConfig(ShoppingCart))
