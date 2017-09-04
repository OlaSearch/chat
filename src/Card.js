import React from 'react'
import cx from 'classnames'
import CardList from './CardList'
import CardButton from './CardButton'
import AnswerWordMap from 'olasearch/lib/components/Answer/AnswerWordMap'
import AnswerMap from 'olasearch/lib/components/Answer/AnswerMap'
import { Fields } from 'olasearch'
// import AnswerChart from 'olasearch/lib/components/Answer/AnswerChart'

const Card = ({ card, templates }) => {
  if (!card) return null
  if (!card.title) return null
  let { title, subtitle, url, buttons=[], template } = card
  let klass = cx('ola-card', `ola-card-template-${template}`)

  function pickTemplate (template) {
    /* Check for user defined templates */
    if (templates && templates.hasOwnProperty(template)) {
      let Component = templates[template]
      return <Component {...card} />
    }
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
      // case 'line_chart':
      //   return (
      //     <AnswerChart
      //       data={card}
      //     />
      //   )

      default:
        return (
          <div className='ola-card-inner'>
            <h3 className='ola-card-title'><a target='_blank' href={url}>{title}</a></h3>
            <Fields.TextField field='subtitle' result={card} />
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
