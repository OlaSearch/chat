import React from 'react'
import cx from 'classnames'
import CardList from './CardList'
import CardButton from './CardButton'
import AnswerWordMap from 'olasearch/lib/components/Answer/AnswerWordMap'
import AnswerMap from 'olasearch/lib/components/Answer/AnswerMap'

const Card = ({ card }) => {
  if (!card) return null
  let { title, url, buttons, template } = card
  let klass = cx('ola-card', `ola-card-template-${template}`)

  function pickTemplate (template) {
    switch (template) {
      case 'list':
        return <CardList {...card} />

      case 'wordmap':
        return (
          <AnswerWordMap
            data={card.elements}
            maxLen={20}
            shuffle
          />
        )

      case 'map':
        return (
          <AnswerMap
            data={card.elements}
          />
        )

      default:
        return (
          <div className='ola-card-inner'>
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
