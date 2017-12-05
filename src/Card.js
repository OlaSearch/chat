import React from 'react'
import cx from 'classnames'
import CardList from './CardList'
import AnswerWordMap from '@olasearch/core/lib/components/Answer/AnswerWordMap'
import AnswerMap from '@olasearch/core/lib/components/Answer/AnswerMap'
import { Fields } from '@olasearch/core'
// import AnswerChart from 'olasearch/lib/components/Answer/AnswerChart'

function Card({ card, templates }) {
  if (!card) return null
  if (!card.title) return null
  let { buttons = [], template } = card
  let klass = cx('ola-card', `ola-card-template-${template}`)

  function pickTemplate(template) {
    /* Check for user defined templates */
    if (templates && templates.hasOwnProperty(template)) {
      let Component = templates[template]
      return <Component {...card} />
    }
    switch (template) {
      case 'list':
        return <CardList {...card} />

      case 'wordmap':
        return <AnswerWordMap data={card.elements} maxLen={20} shuffle />

      case 'map':
        return <AnswerMap data={card.elements} />
      // case 'line_chart':
      //   return (
      //     <AnswerChart
      //       data={card}
      //     />
      //   )

      default:
        return (
          <div className="ola-card-inner">
            <Fields.Title
              result={card}
              field="title"
              openInNewWindow
              eventLabel={card['title']}
              eventCategory="card"
            />
            <Fields.TextField field="subtitle" result={card} />
            {buttons.map((button, idx) => (
              <Fields.Button
                {...button}
                result={card}
                eventLabel={card['title']}
                key={idx}
                openInNewWindow
                eventCategory="card"
              />
            ))}
          </div>
        )
    }
  }

  return <div className={klass}>{pickTemplate(template)}</div>
}

module.exports = Card
