import React from 'react'
import Cross from '@olasearch/icons/lib/x'
import { darken } from './utils'

/**
 * Chatbot Header
 */
export default function Header ({
  onHide,
  title,
  debug,
  isDesktop,
  inline,
  theme
}) {
  /**
   * Hide header if its inline and inside a
   */
  if (isDesktop && inline) return null
  if (!title && !debug) return null
  const showHideButton = debug || !isDesktop ? true : !!onHide
  return (
    <div className='olachat-header'>
      <div className='olachat-header-title'>{title}</div>
      {showHideButton ? (
        <button className='olachat-header-hide' onClick={onHide}>
          <Cross />
        </button>
      ) : null}
      <style jsx>{`
        .olachat-header {
          background-color: ${theme.chatHeaderBackground};
          color: ${theme.chatHeaderColor};
          font-size: ${theme.mediumFontSize};
        }
        .olachat-header .olachat-header-hide:hover {
          background-color: ${darken(theme.chatHeaderBackground, 10)};
        }
      `}</style>
    </div>
  )
}

Header.defaultProps = {
  debug: false
}
