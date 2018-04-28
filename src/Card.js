import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import {
  AnswerList,
  AnswerWordMap,
  AnswerMap,
  AnswerCard,
  AnswerCarousel,
  Decorators,
  Settings
} from '@olasearch/core'
import { withDocument } from '@olasearch/react-frame-portal'

const { BUTTON_TYPE } = Settings

/**
 * Cards
 * @example ./../styleguide/Card.md
 */
function Card ({
  card,
  templates,
  results,
  location,
  onSelect,
  theme,
  ...rest
}) {
  if (!card) return null
  const { buttons = [], template } = card
  const classes = cx('ola-card', `ola-card-template-${template}`)

  function handleClick ({ type, label, title, payload, url }) {
    /**
     * Label will be displayed in the bot
     */
    if (type === BUTTON_TYPE.POSTBACK) {
      return (
        onSelect &&
        onSelect({
          ...payload,
          label,
          query: label || title
        })
      )
    }
    if (type === BUTTON_TYPE.WEB) {
      return (window.location.href = url)
    }
    if (type === BUTTON_TYPE.EMAIL) {
      return (window.location.href = `mailto:${url}`)
    }
    onSelect && onSelect({ card })
  }

  function pickTemplate (template) {
    /* Check for user defined templates */
    if (templates && templates.hasOwnProperty(template)) {
      let Component = templates[template]
      return <Component {...card} />
    }

    switch (template) {
      case 'list':
        return (
          <AnswerList
            card={card}
            swipe
            onSelect={handleClick}
            document={this.props.document}
            {...rest}
          />
        )

      case 'wordmap':
        return (
          <AnswerWordMap
            card={card}
            maxLen={20}
            onSelect={handleClick}
            shuffle
            document={this.props.document}
            {...rest}
          />
        )

      case 'image':
        return (
          <AnswerCard
            card={card}
            onSelect={handleClick}
            document={this.props.document}
          />
        )

      case 'map':
        return (
          <AnswerMap
            card={card}
            results={results}
            location={location}
            {...rest}
          />
        )

      case 'carousel':
        return (
          <AnswerCarousel
            card={card}
            onSelect={handleClick}
            document={this.props.document}
            {...rest}
          />
        )

      default:
        return (
          <AnswerCard
            card={card}
            onSelect={handleClick}
            document={this.props.document}
            {...rest}
          />
        )
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
    image: PropTypes.string,
    images: PropTypes.array
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

export default Decorators.withTheme(withDocument(Card))
