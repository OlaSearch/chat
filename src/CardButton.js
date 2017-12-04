import React from 'react'

function CardButton({ title, type, url }) {
  return (
    <a className="ola-card-button" target="_blank" href={url}>
      {title}
    </a>
  )
}

module.exports = CardButton
