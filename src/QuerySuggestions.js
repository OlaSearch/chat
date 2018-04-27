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
  const { term, partial } = item
  function handleChange (e) {
    onChange && onChange(item)
  }
  let pattern =
    '(' +
    queryTerm
      .replace(RE_ESCAPE, '\\$1')
      .split(/\s/)
      .join('|') +
    ')'
  /* Create term */
  let value = partial
    ? `...${term}`
    : term.replace(new RegExp(pattern, 'gi'), '<strong>$1</strong>')
  let klass = 'olachat-query-suggestion' + (isActive ? ' is-active' : '')
  return (
    <div className='olachat-query-suggestion-item'>
      <button
        type='button'
        className={klass}
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
