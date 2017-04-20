import React from 'react'
import cx from 'classnames'
import CardList from './CardList'
import CardButton from './CardButton'

const Card = ({ card }) => {
  if (!card) return null
  let { title, url, buttons, template } = card
  let klass = cx('ola-card', `ola-card-template-${template}`)

  function pickTemplate (template) {
    switch (template) {
      case 'list':
        return <CardList {...card} />

      default:
        return (
          <div>
            <h3 className='ola-card-title'><a target='_blank' href={url}>{title}</a></h3>
            {buttons.map((button, idx) => <CardButton {...button} key={idx} />)}
          </div>
        )
    }
  }

  return (
    <div className={klass}>
      {pickTemplate(template)}
    </div>
  )
}

module.exports = Card
