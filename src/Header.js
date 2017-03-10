import React from 'react'

const Header = ({ onHide, title }) => {
  if (!title && !onHide) return null
  return (
    <div className='olachat-header'>
      <p className='olachat-header-title'>{title}</p>
      {onHide
        ? <button className='olachat-header-hide' onClick={onHide}>
          <span>Hide</span>
        </button>
        : null
      }
    </div>
  )
}

export default Header
