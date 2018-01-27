import React from 'react'

export default function CardButton ({ title, type, url }) {
  return (
    <a className='ola-card-button' target='_blank' href={url}>
      {title}
    </a>
  )
}
