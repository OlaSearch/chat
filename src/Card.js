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
  let { title, url, buttons = [], template } = card
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
            <Fields.Title
              result={card}
              field='title'
              openInNewWindow
              eventLabel={card['title']}
              eventCategory='card'
            />
            <Fields.TextField field='subtitle' result={card} />
            {buttons.map((button, idx) => (
                <Fields.Button
                  {...button}
                  result={card}
                  eventLabel={card['title']}
                  key={idx}
                  openInNewWindow
                  eventCategory='card'
                />
              )
            )}
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
