import React from 'react'
import cx from 'classnames'
import {
  AnswerList,
  AnswerWordMap,
  AnswerMap,
  AnswerCard
} from '@olasearch/core'

export default function Card ({ card, templates, results, location, theme }) {
  if (!card || !card.title) return null
  let { buttons = [], template } = card
  let classes = cx('ola-card', `ola-card-template-${template}`)
  function pickTemplate (template) {
    /* Check for user defined templates */
    if (templates && templates.hasOwnProperty(template)) {
      let Component = templates[template]
      return <Component {...card} />
    }

    switch (template) {
      case 'list':
        return <AnswerList card={card} />

      case 'wordmap':
        return <AnswerWordMap card={card} maxLen={20} shuffle />

      case 'image':
        return <AnswerCard card={card} />

      case 'map':
        return <AnswerMap data={card} results={results} />

      default:
        return <AnswerCard card={card} />
    }
  }

  return (
    <div className={classes}>
      {pickTemplate(template)}
      <style jsx>
        {`
          .ola-card :global(.ola-answer-title a) {
            color: ${theme.searchLinkColor};
          }
          .ola-card :global(.ola-answer-title a:hover),
          .ola-card :global(.ola-answer-title a:focus) {
            color: ${theme.searchLinkHoverColor};
          }
        `}
      </style>
    </div>
  )
}
