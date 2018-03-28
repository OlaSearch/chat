import React from 'react'
import Cross from '@olasearch/icons/lib/x'
import { darken } from './utils'

/**
 * Chatbot Header
 */
export default function Header ({ onHide, title, allowHide, theme }) {
  if (!title && !onHide) return null
  return (
    <div className='olachat-header'>
      <div className='olachat-header-title'>{title}</div>
      {allowHide && onHide ? (
        <button className='olachat-header-hide' onClick={onHide}>
          <Cross />
        </button>
      ) : null}
      <style jsx>{`
        .olachat-header {
          background-color: ${theme.chatHeaderBackground};
          color: ${theme.chatHeaderColor};
        }
        .olachat-header .olachat-header-hide:hover {
          background-color: ${theme.chatHeaderBackground};
        }
      `}</style>
    </div>
  )
}

Header.defaultProps = {
  allowHide: true
}
