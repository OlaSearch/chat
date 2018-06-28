import React from 'react'
import { Overlay, Decorators } from '@olasearch/core'
import Close from '@olasearch/icons/lib/x'
import ShoppingCart from './ShoppingCart'
import Transition from 'react-transition-group/Transition'

const duration = 200
const desktopStyles = {
  width: 0
}
const phoneStyles = {
  transform: 'translate3d(100%, 0, 0)',
  left: 'auto'
}
const desktopStylesActive = {
  width: 350
}
const phoneStylesActive = {
  transform: 'translate3d(0%, 0, 0)',
  left: 'auto'
}

function Sidebar (props) {
  const { isSidebarOpen, toggle, theme, isDesktop, addMessage } = props
  const defaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    opacity: 0,
    ...(isDesktop ? desktopStyles : phoneStyles),
    overflow: 'hidden'
  }
  const transitionStyles = {
    entering: {
      opacity: 0,
      width: 0,
      overflow: 'hidden',
      ...(isDesktop ? desktopStyles : phoneStyles)
    },
    entered: {
      opacity: 1,
      ...(isDesktop ? desktopStylesActive : phoneStylesActive),
      overflow: 'visible'
    }
  }
  return (
    <React.Fragment>
      <Transition
        in={isSidebarOpen}
        timeout={0}
        exit
        enter
        mountOnEnter
        unmountOnExit={false}
      >
        {state => (
          <div
            className='olachat-sidebar'
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          >
            <React.Fragment>
              <button
                className='ola-btn olachat-sidebar-close'
                onClick={toggle}
              >
                <span className='olachat-sidebar-close-text'>Hide</span>
                <Close />
              </button>
              <div className='olachat-sidebar-content'>
                <ShoppingCart
                  isVisible={isSidebarOpen}
                  theme={theme}
                  addMessage={addMessage}
                  isDesktop={isDesktop}
                />
              </div>
            </React.Fragment>
          </div>
        )}
      </Transition>
      <Overlay active={!isDesktop && isSidebarOpen} onDismiss={toggle} />
    </React.Fragment>
  )
}

export default Decorators.withTheme(Sidebar)
