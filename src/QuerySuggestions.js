import React from 'react'
import PropTypes from 'prop-types'
import { Settings, utilities } from '@olasearch/core'

const { RE_ESCAPE } = Settings
const { createHTMLMarkup } = utilities

/**
 * Display as you type suggestions
 * @example ./../styleguide/QuerySuggestions.md
 */
function QuerySuggestions ({
  suggestions,
  onChange,
  activeIndex,
  queryTerm,
  style
}) {
  return (
    <div className='olachat-query-suggestions' style={style}>
      {suggestions.map((item, idx) => {
        return (
          <QuerySuggestionItem
            key={idx}
            onChange={onChange}
            item={item}
            isActive={idx === activeIndex}
            queryTerm={queryTerm}
          />
        )
      })}
    </div>
  )
}

function QuerySuggestionItem ({ queryTerm, item, onChange, isActive }) {
  const { partial } = item
  /* Fallback to term if display is empty */
  const term = item.suggestion_display || item.term
  function handleChange () {
    onChange && onChange(item)
  }
  const pattern = queryTerm
    .replace(/\<|\>/gi, '')
    .replace(RE_ESCAPE, '\\$1')
    .trim()
    .split(/\s/)
    .join('(?!>))|((?<!<|(</))') /* Pattern */
  const regEx = pattern
    ? new RegExp('((?<!<|(</))' + pattern + '(?!>))', 'gi')
    : null // https://regex101.com/r/gIma8k/1
  /* Create term */
  const value = partial
    ? `...${term}`
    : pattern ? term.replace(regEx, '<strong>$1</strong>') : term
  const classes = 'olachat-query-suggestion' + (isActive ? ' is-active' : '')
  return (
    <div className='olachat-query-suggestion-item'>
      <button
        type='button'
        className={classes}
        onClick={handleChange}
        dangerouslySetInnerHTML={createHTMLMarkup(value)}
      />
    </div>
  )
}

QuerySuggestions.propTypes = {
  suggestions: PropTypes.array,
  onChange: PropTypes.func,
  activeIndex: PropTypes.number,
  queryTerm: PropTypes.string
}

QuerySuggestions.defaultProps = {}

export default QuerySuggestions
