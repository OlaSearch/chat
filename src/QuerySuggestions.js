import React from 'react'
import { Settings, utilities } from '@olasearch/core'
// import ArrowDownRight from '@olasearch/icons/lib/arrow-down-right'

const { RE_ESCAPE } = Settings
const { createHTMLMarkup } = utilities
class QuerySuggestions extends React.Component {
  registerRef = el => {
    this.el = el
  }
  componentDidMount () {
    /* Add click listener */
    // this.el.addEventListener('click', e => {
    //   e.preventDefault()
    // })
  }
  render () {
    let { suggestions, onChange, activeIndex, queryTerm } = this.props
    return (
      <div className='olachat-query-suggestions' ref={this.registerRef}>
        {suggestions.map((item, idx) => {
          return (
            <QuerySuggestionItem
              key={idx}
              onChange={onChange}
              term={item.term}
              isActive={idx === activeIndex}
              queryTerm={queryTerm}
            />
          )
        })}
      </div>
    )
  }
}

function QuerySuggestionItem ({ queryTerm, term, onChange, isActive }) {
  function handleChange (e) {
    onChange && onChange(term)
  }
  let pattern =
    '(^' +
    queryTerm
      .replace(RE_ESCAPE, '\\$1')
      .split(/\s/)
      .join('|') +
    ')'
  /* Create term */
  let value = term.replace(new RegExp(pattern, 'gi'), '<strong>$1</strong>')
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

module.exports = QuerySuggestions
