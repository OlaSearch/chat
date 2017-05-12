import React from 'react'
import CardButton from './CardButton'
import { stripHtml } from './utils'

const CardList = ({ title, elements, buttons }) => {
  return (
    <div className='ola-card-list'>
      <div className='ola-card-list-title'>{title}</div>
      <div className='ola-card-list-items'>
        {elements.map(({ title, subtitle, default_action: defaultAction }, idx) => {
          let { url } = defaultAction
          return (
            <div className='ola-card-list-item' key={idx}>
              <h3 className='ola-card-title'>
                <a target='_blank' href={url}>{title}</a>
              </h3>
              <div className='ola-card-subtitle'>
                {stripHtml(subtitle)}
              </div>
            </div>
          )
        })}
      </div>
      <div className='ola-card-list-buttons'>
        {buttons.map((button, idx) => <CardButton {...button} key={idx} />)}
      </div>
    </div>
  )
}

module.exports = CardList
