import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { SearchFooter, SearchResults, Decorators } from '@olasearch/core'
import { loadMore, toggleSearchVisibility } from './actions'

const MAX_RESULTS_MOBILE = 1
const MAX_RESULTS_DESKTOP = 3

/**
 * Show search results in a chatbot
 * @example ./../styleguide/SearchResultsMessage.md
 */
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
    const {
      isPhone,
      isDesktop,
      dispatch,
      isActive,
      message,
      bookmarks,
      isLoading
    } = this.props
    var { results } = this.props
    const { search /*, showSearch */ } = message
    const maxResults = isPhone ? MAX_RESULTS_MOBILE : MAX_RESULTS_DESKTOP

    /* When showing CURRRENT message, do not stack */
    const isStacked = false // isActive ? false : !showSearch

    if (isStacked) {
      results = results.filter((item, idx) => idx < maxResults)
    }

    const classes = classNames('olachat-results', {
      'olachat-results-stack': isStacked
    })
    return (
      <div className={classes}>
        <div className='olachat-results-wrapper'>
          {/* <div className='olachat-results-overlay' />
          <button
            type='button'
            onClick={this.toggleActive}
            className='olachat-results-seeall'
          >
            {translate('chat_see_all')}
          </button> */}

          <SearchResults
            results={results}
            bookmarks={bookmarks}
            dispatch={dispatch}
            baseUrl={search && search.baseUrl}
            passProps={{
              document: this.props.document
            }}
            logPayload={{
              bot: true,
              message
            }}
            swipe={!isDesktop}
            isLoading={isLoading}
            pagination={
              isDesktop ? null : (
                <SearchFooter
                  totalResults={this.props.totalResults}
                  currentPage={this.props.page}
                  perPage={this.props.perPage}
                  dispatch={dispatch}
                  isPhone={isPhone}
                  isLoading={isLoading}
                  onLoadMore={this.onLoadMore}
                  infiniteScroll
                  isShowMore
                  textBottom
                  key='footer'
                />
              )
            }
          />

          {isActive && isDesktop ? (
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
    isLoading: ownProps.isActive ? state.Conversation.isLoading : false
  }
}

export default connect(mapStateToProps, { loadMore, toggleSearchVisibility })(
  Decorators.withTranslate(SearchResultsMessage)
)
