import * as actions from './../../src/actions'
import ActionTypes from './../../src/ActionTypes'
import * as Settings from './../../src/Settings'

describe('Actions', () => {
  it('will dispatch an action if query term is updated', () => {
    expect(actions.updateBotQueryTerm('hello')).toEqual({"term": "hello", "type": ActionTypes.UPDATE_BOT_QUERY_TERM})
  })

  it('will dispatch to clear query', () => {
    expect(actions.clearBotQueryTerm()).toEqual({"type": ActionTypes.CLEAR_BOT_QUERY_TERM})
  })

  it('throw error if typing indicator doesnt have msgId', () => {
    expect(() => actions.showTypingIndicator()).toThrowError()
  })

  it('will show typing indicator', () => {
    expect(actions.showTypingIndicator(12)).toEqual({ msgId: 12, type: ActionTypes.SHOW_TYPING_INDICATOR })
  })

  it('will dispatch to hide typing indicator', () => {
    expect(actions.hideTypingIndicator()).toEqual({"type": ActionTypes.HIDE_TYPING_INDICATOR})
  })

  it('will dispatch to clear messages', () => {
    expect(actions.clearMessages()).toEqual({"type": ActionTypes.CLEAR_MESSAGES})
  })

  it('will dispatch feedback message id', () => {
    expect(actions.setFeedbackMessage(2)).toEqual({"type": ActionTypes.SET_FEEDBACK_MESSAGE_ID, messageId: 2})
  })

  it('will dispatch feedback rating', () => {
    expect(actions.setFeedbackRating(Settings.EMOJI_NEGATIVE)).toEqual({"type": ActionTypes.SET_FEEDBACK_RATING, rating: Settings.EMOJI_NEGATIVE})
    expect(actions.setFeedbackRating(Settings.EMOJI_POSITIVE)).toEqual({"type": ActionTypes.SET_FEEDBACK_RATING, rating: Settings.EMOJI_POSITIVE})
  })

  it('will dispatch show hide bot', () => {
    expect(() => actions.setBotStatus()).toThrowError()
    expect(actions.setBotStatus(true)).toEqual({ type: ActionTypes.SET_BOT_STATUS, status: true})
    expect(actions.setBotStatus(false)).toEqual({ type: ActionTypes.SET_BOT_STATUS, status: false})
  })

  it('will dispatch show hide bot search results', () => {
    expect(() => actions.toggleSearchVisibility()).toThrowError()
    expect(actions.toggleSearchVisibility(12)).toEqual({ type: ActionTypes.TOGGLE_SEARCH_VISIBILITY, messageId: 12})
    expect(actions.toggleSearchVisibility(12)).toEqual({ type: ActionTypes.TOGGLE_SEARCH_VISIBILITY, messageId: 12})
  })

  it('will dispatch action to ignore location', () => {
    expect(actions.ignoreLocation()).toBeDefined()
    expect(actions.ignoreLocation()).toEqual({ type: ActionTypes.IGNORE_LOCATION })
  })
})