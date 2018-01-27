import React from 'react'
import Cross from '@olasearch/icons/lib/x'

export default function Header ({ onHide, title }) {
  if (!title && !onHide) return null
  return (
    <div className='olachat-header'>
      <p className='olachat-header-title'>{title}</p>
      {onHide ? (
        <button className='olachat-header-hide' onClick={onHide}>
          <Cross />
        </button>
      ) : null}
    </div>
  )
}
