import React from 'react'
import cx from 'classnames'

const Card = ({ card }) => {
  if (!card) return null
  let { title, url, buttons, template } = card
  let klass = cx('ola-card', `ola-card-template-${template}`)
  return (
    <div className={klass}>
      <h3 className='ola-card-title'><a target='_blank' href={url}>{title}</a></h3>
    </div>
  )
}

module.exports = Card
