import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import {
  AnswerList,
  AnswerWordMap,
  AnswerMap,
  AnswerCard,
  Decorators
} from '@olasearch/core'

/**
 * Cards
 * @example ./styleguide/Card.md
 */
function Card ({ card, templates, results, location, theme }) {
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
        return <AnswerMap card={card} results={results} location={location} />

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

Card.propTypes = {
  /**
   * Users current location
   */
  location: PropTypes.string,
  /**
   * Card to be displayed
   */
  card: PropTypes.shape({
    /**
     * Template of the card
     */
    template: PropTypes.string,
    title: PropTypes.string,
    buttons: PropTypes.array,
    subtitle: PropTypes.string,
    image: PropTypes.string
  }),
  /**
   * Search results
   */
  results: PropTypes.array,

  /**
   * Override card templates
   */
  templates: PropTypes.object
}

export default Decorators.withTheme(Card)
