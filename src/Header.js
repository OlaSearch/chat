import React from 'react'
import Cross from '@olasearch/icons/lib/x'
import { ThemeConsumer } from '@olasearch/core'

export default function Header ({ onHide, title }) {
  if (!title && !onHide) return null
  return (
    <ThemeConsumer>
      {theme => (
        <div className='olachat-header'>
          <p className='olachat-header-title'>{title}</p>
          {onHide ? (
            <button className='olachat-header-hide' onClick={onHide}>
              <Cross />
            </button>
          ) : null}
          <style jsx>{`
            .olachat-header {
              background-color: ${theme.chatHeaderBackground};
              color: ${theme.chatHeaderColor};
            }
          `}</style>
        </div>
      )}
    </ThemeConsumer>
  )
}
