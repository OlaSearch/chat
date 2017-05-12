import React from 'react'

const CardButton = ({ title, type, url }) => {
  return (
    <a className='ola-card-button' target='_blank' href={url}>{title}</a>
  )
}

module.exports = CardButton
