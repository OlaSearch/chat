import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { SearchFooter, SearchResults } from '@olasearch/core'
import { loadMore, toggleSearchVisibility } from './actions'

const MAX_RESULTS_MOBILE = 1
const MAX_RESULTS_DESKTOP = 3

class SearchResultsMessage extends React.Component {
  static defaultProps = {
    results: []
  }
  toggleActive = () => {
    this.props.toggleSearchVisibility(this.props.message.id)
  }
  onLoadMore = () => {
    this.props.loadMore(this.props.message)
  }
  render () {  
    let {
      isPhone,
      dispatch,
      isActive,
      message,
      results,
      bookmarks,
      isLoading,
    } = this.props
    let { search, mc, showSearch } = message
    const maxResults = isPhone ? MAX_RESULTS_MOBILE : MAX_RESULTS_DESKTOP

    /* When showing CURRRENT message, do not stack */
    const isStacked = isActive ? false : !showSearch

    if (isStacked) {
      results = results.filter((item, idx) => idx < maxResults)
    }

    const klass = classNames('olachat-results', {
      'olachat-results-stack': isStacked
    })
    return (
      <div className={klass}>
        <div className='olachat-results-wrapper'>
          <div className='olachat-results-overlay' />
          <button
            type='button'
            onClick={this.toggleActive}
            className='olachat-results-seeall'
          >
            See all
          </button>

          <SearchResults
            results={results}
            bookmarks={bookmarks}
            dispatch={dispatch}
            openInNewWindow
            baseUrl={search && search.baseUrl}
          />

          {isActive ? (
            <SearchFooter
              totalResults={this.props.totalResults}
              currentPage={this.props.page}
              perPage={this.props.perPage}
              dispatch={dispatch}
              isPhone={isPhone}
              isLoading={this.props.isLoading}
              onLoadMore={this.onLoadMore}
              infiniteScroll
            />
          ) : null}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state, ownProps) {
  return {
    bookmarks: state.AppState.bookmarks,
    isPhone: state.Device.isPhone,
    perPage: state.Conversation.perPage,
    isLoading: ownProps.isActive ? state.Conversation.isLoading : false,
  }
}

export default connect(mapStateToProps, { loadMore, toggleSearchVisibility })(
  SearchResultsMessage
)
