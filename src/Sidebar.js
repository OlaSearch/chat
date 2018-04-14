import React from 'react'
import { Decorators } from '@olasearch/core'
import ShoppingCart from './ShoppingCart'
import Overlay from './Overlay'
import Transition from 'react-transition-group/Transition'

const items = [
  {
    title: 'Codeine phosphate',
    status: 'Approval required',
    attributes: [
      {
        title: 'Active ingredients',
        items: ['Codeine phosphate']
      }
    ]
  }
]

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

class Sidebar extends React.Component {
  render () {
    const { isSidebarOpen, toggle, theme, isDesktop, addMessage } = this.props
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
              <div className='olachat-sidebar-content'>
                <ShoppingCart
                  isVisible={isSidebarOpen}
                  theme={theme}
                  onClose={toggle}
                  showClose
                  addMessage={addMessage}
                />
              </div>
            </div>
          )}
        </Transition>
        <Overlay active={!isDesktop && isSidebarOpen} onDismiss={toggle} />
      </React.Fragment>
    )
  }
}

export default Decorators.withTheme(Sidebar)
