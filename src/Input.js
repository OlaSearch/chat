import React from 'react'
import cx from 'classnames'
import Voice from './Voice'
import { Settings, Actions, Decorators, utilities } from '@olasearch/core'
import Textarea from '@olasearch/textarea-elastic'
import QuerySuggestions from './QuerySuggestions'
import { connect } from 'react-redux'
import HelpMenu from './HelpMenu'
import listensToClickOutside from '@olasearch/react-onclickoutside'
import Send from '@olasearch/icons/lib/material-send'
import { GeoLocation } from '@olasearch/core'
import { getFacetSuggestions, getSuggestSlotType, createSlot } from './utils'

const supportsVoice =
  (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia) &&
  (window.SpeechRecognition || window.webkitSpeechRecognition)

/* Import from ola utilities */
const { getWordPosition, getAutoCompleteResults } = utilities

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      suggestions: [],
      suggestedIndex: null,
      suggestedTerm: null,
      isFocused: false,
      tokens: [],
      startToken: null,
      endToken: null
    }
  }
  static defaultProps = {
    suggestionsLimit: 5,
    closeOnEscape: true
  }
  handleClickOutside = () => {
    /* Check if its already closed */
    if (!this.state.suggestedTerm && !this.state.suggestions.length) return
    this.closeSuggestion()
  }
  componentDidUpdate (prevProps) {
    if (prevProps.messages !== this.props.messages) {
      const currentMessage = this.props.messages[this.props.messages.length - 1]
      /* Focus input: Expecting user input */
      if (currentMessage && currentMessage.slot) {
        if (this.props.isDesktop) setTimeout(this.Input.el.focus())
      }
    }
  }
  onChange = event => {
    const text = event && event.target ? event.target.value : event
    const { filterInAutoComplete } = this.props.config
    /* Get cursor position */
    const { word: partialWord, startToken, endToken } = getWordPosition(
      event.target
    )

    /* Update state */
    this.setState({ text, startToken, endToken })

    if (text) {
      /**
       * Auto suggest queries
       */
      const currentMessage = this.props.messages[this.props.messages.length - 1]
      const slotHasOptions =
        currentMessage &&
        currentMessage.slot_options &&
        currentMessage.slot_options.length
      const shouldRequestSlots =
        !slotHasOptions && currentMessage && currentMessage.slot
      const slotTypeToSuggest = shouldRequestSlots
        ? currentMessage.slot.suggest_type || currentMessage.slot.type
        : undefined
      const slotType = shouldRequestSlots
        ? getSuggestSlotType(slotTypeToSuggest)
        : undefined
      if (!slotHasOptions || this.props.isTyping) {
        this.props
          .dispatch(
            Actions.AutoSuggest.executeFuzzyAutoSuggest({
              q: text,
              limit: this.props.suggestionsLimit,
              contextField: slotType,
              config: this.props.config
            })
          )
          .then(values => {
            if (!values || values === null) return
            /* If no results */
            if (!values.length) {
              if (!filterInAutoComplete || slotType || !partialWord) {
                return this.closeSuggestion()
              }

              /**
               * Get facet suggestions
               * 1. Only if slot Type is not an input
               * 2. There is partial word
               * 3. And filterInAutocomplete is ON
               */
              this.props
                .dispatch(
                  Actions.Search.executeFacetSearch({
                    fullTerm: text,
                    term: partialWord,
                    startToken,
                    endToken,
                    fieldTypeMapping: this.props.config.fieldTypeMapping,
                    tokens: this.state.tokens
                  })
                )
                .then(response => {
                  const suggestions = getFacetSuggestions(response)

                  this.setState({
                    suggestions,
                    suggestedTerm: null,
                    suggestedIndex: null
                  })

                  if (!suggestions.length) return this.closeSuggestion()
                })
            } else {
              /* Clean up values */
              values = getAutoCompleteResults(values)

              this.setState({
                suggestions: values, // values.map(item => ({ term: item.term, payload })),
                suggestedTerm: null,
                suggestedIndex: null
              })
            }
          })
      } else {
        this.closeSuggestion()
      }
    } else {
      this.closeSuggestion()
    }

    this.props.onChange && this.props.onChange(text)
  }
  onVoiceChange = text => {
    this.setState({
      text
    })
  }
  clearText = () => {
    this.setState({
      text: ''
    })
  }
  onVoiceFinal = (text, cb) => {
    /* Set text to empty */
    if (typeof text === 'undefined') text = ''

    /* Update text */
    this.setState(
      {
        text
      },
      () => this.onSubmit(null, cb, 300, Settings.SEARCH_INPUTS.VOICE)
    )
  }
  updateCursor = start => {
    setTimeout(() => this.Input.el.setSelectionRange(start, start))
  }
  getFullTerm = () => {
    const { suggestedTerm } = this.state
    const { startToken, endToken } = this.state
    const { term, partial } = suggestedTerm
    const { text } = this.state
    const selection = partial
      ? text.substr(0, startToken) + term + text.substr(endToken)
      : term
    return selection
  }
  onFormSubmit = (event, payload) => {
    /* Stop form submission */
    event && event.preventDefault()
    /* Check if suggestedTerm is active */
    if (this.state.suggestedTerm) {
      this.setState({
        text: this.getFullTerm()
      })
    }
    /* Close any suggestions */
    this.closeSuggestion()

    /* Remove tokens */
    this.setState({
      tokens: []
    })

    /* Stop submitting if text is empty */
    if (!this.state.text || !this.state.text.trim()) {
      if (this.props.isDesktop) return this.Input.el.focus()
    }

    setTimeout(() => this.onSubmit(null, null, null, undefined, payload), 0)
  }
  onSubmit = (
    event,
    callback,
    textClearingDelay = 0,
    searchInput = Settings.SEARCH_INPUTS.KEYBOARD,
    payload
  ) => {
    /* Update query term */
    this.props.updateQueryTerm(this.state.text, searchInput)

    /**
     * Flow
     * 1. Immediate add to the messages redux atore
     * 2. Sync the message to the server
     * 3. Update sync status in redux store
     */

    // if (this.state.isTyping) return

    /* Clear the final text input after 100ms */
    /* To simulate delay */
    setTimeout(() => {
      this.setState({
        text: ''
      })

      /* Resize height */
      this.Input.autoGrow()

      /* Focus */
      if (this.props.isDesktop) this.Input.el.focus()
    }, textClearingDelay)

    /* Submit the message */
    return this.props.onSubmit(payload).then(response => {
      /* Callbacks */
      callback && typeof callback === 'function' && callback(response)
    })
  }
  closeSuggestion = () => {
    this.setState({
      suggestions: [],
      suggestedIndex: null,
      suggestedTerm: null
    })
  }
  updateFuzzyQueryTerm = index => {
    const item = index === null ? null : this.state.suggestions[index]
    this.setState(
      {
        suggestedIndex: index,
        suggestedTerm: item
      },
      () => {
        if (!item) return
        const { startToken } = this.state
        const { partial, term } = item
        if (partial) {
          const tokenIndex = startToken + term.length
          this.updateCursor(tokenIndex)
        }
        /* Grow the input */
        this.Input.autoGrow()
      }
    )
  }
  onKeyDown = event => {
    let index = null
    const { suggestedIndex, suggestions, text } = this.state
    switch (event.nativeEvent.which) {
      case 13: // Enter key
        /* Check if suggestion is active */
        if (suggestedIndex !== null) {
          const item = suggestions[suggestedIndex]
            ? suggestions[suggestedIndex]
            : null
          if (item) {
            this.onSuggestionChange(item)
            /* Stop enter key event */
            event.preventDefault()
            break
          }
        }
        this.closeSuggestion()
        if (!event.nativeEvent.shiftKey) {
          this.onFormSubmit(event)
        }
        break

      case 27: // Escape
        /* Check if suggestion is active */
        if (suggestedIndex || suggestions.length) {
          return this.closeSuggestion()
        }
        /* Close chatbot */
        if (!text) {
          /**
           * Only if the chatbot is not inline
           */
          if (!this.props.closeOnEscape) return
          !this.props.config.chatBotInline &&
            this.props.closeOnEscape &&
            this.props.onRequestClose &&
            this.props.onRequestClose()
        } else {
          return this.clearText()
        }
        break

      case 38: // Up
        if (suggestedIndex === null) {
          index = suggestions.length - 1
        } else {
          let i = suggestedIndex - 1
          if (i < 0) {
            index = null
          } else {
            index = i
          }
        }
        this.updateFuzzyQueryTerm(index)
        break
      case 40: // Down
        if (suggestedIndex === null) {
          index = 0
        } else {
          let i = suggestedIndex + 1
          if (i >= suggestions.length) {
            index = null
          } else {
            index = i
          }
        }
        this.updateFuzzyQueryTerm(index)
        break

      case 32: // Tab
      case 9: // Space
        const item = suggestions[suggestedIndex]
          ? suggestions[suggestedIndex]
          : null
        if (item) {
          this.onSuggestionChange(item)
        }
        break
    }
  }
  registerRef = el => {
    this.Input = el
  }
  /**
   * term: Selected query term
   * value: 12|Cynthia, value of the facet term
   * name: facet name
   * partial: boolean partial or full
   * startToken:
   * endToken
   */
  onSuggestionChange = item => {
    const { startToken, endToken } = this.state
    const {
      suggestion_raw: suggestionRaw,
      term: suggestionTerm,
      value,
      name,
      partial,
      taxo_label: slotLabel,
      id
    } = item

    /* Term to be sent back as query */
    const term = suggestionRaw || suggestionTerm
    const { text } = this.state

    var args = null
    var currentSlotName = null
    var currentIntent = null

    /**
     * If the current message requires slots
     */
    const currentMessage = this.props.messages[this.props.messages.length - 1]
    if (currentMessage && currentMessage.slot) {
      currentSlotName =
        currentMessage.slot.suggest_name || currentMessage.slot.name
      currentIntent = currentMessage.intent
      args = {
        slots: [
          createSlot({
            id,
            type: slotLabel,
            value: suggestionRaw,
            name: currentSlotName
          })
        ]
      }
    }

    const selection = partial
      ? text.substr(0, startToken) + term + text.substr(endToken)
      : term

    const cursorPosition = selection.length

    if (partial) {
      /* Update cursor */
      this.updateCursor(cursorPosition)
    }

    this.setState(
      {
        text: selection,
        tokens: partial
          ? [{ value, name }, ...this.state.tokens]
          : this.state.tokens,
        suggestions: [],
        suggestedTerm: null,
        suggestedIndex: null
      },
      () => {
        if (partial) {
          /**
           * Focus on the input
           */
          this.Input.el.focus()
        } else {
          this.onFormSubmit(null, args)
        }
      }
    )

    this.props.log({
      eventType: 'C',
      eventSource: 'suggest',
      eventCategory: 'autosuggest',
      query: text /* override query */,
      eventAction: 'click',
      suggestion: term,
      slot: currentSlotName,
      intent: currentIntent,
      payload: { bot: true }
    })
  }
  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.messages !== this.props.messages ||
      nextProps.isTyping !== this.props.isTyping ||
      nextProps.location !== this.props.location ||
      nextState.text !== this.state.text ||
      nextState.isFocused !== this.state.isFocused ||
      nextState.suggestedTerm !== this.state.suggestedTerm ||
      nextState.suggestedIndex !== this.state.suggestedIndex ||
      nextState.suggestions !== this.state.suggestions ||
      nextProps.theme !== this.props.theme ||
      nextProps.cart !== this.props.cart
    )
  }
  handleFocus = () => this.setState({ isFocused: true })
  handleBlur = () => this.setState({ isFocused: false })
  render () {
    const { isTyping, voiceInput, translate, theme } = this.props
    const {
      suggestions,
      suggestedIndex,
      suggestedTerm,
      text,
      isFocused,
      startToken,
      endToken
    } = this.state

    const inputValue = suggestedTerm
      ? suggestedTerm.partial
        ? text.substr(0, startToken) +
          suggestedTerm.term +
          text.substr(endToken)
        : suggestedTerm.term
      : text

    const classes = cx('olachat-footer', {
      'olachat-footer-focused': isFocused
    })
    return (
      <form className={classes} onSubmit={this.onFormSubmit}>
        <div className='olachat-footer-inner'>
          {suggestions.length && text ? (
            <QuerySuggestions
              onChange={this.onSuggestionChange}
              suggestions={suggestions}
              activeIndex={suggestedIndex}
              queryTerm={text}
            />
          ) : null}
          <HelpMenu
            onSubmit={this.props.onSubmit}
            updateQueryTerm={this.props.updateQueryTerm}
            theme={theme}
            enableCart={this.props.enableCart}
            toggleSidebar={this.props.toggleSidebar}
            cart={this.props.cart}
            document={this.props.document}
          />
          <div className='olachat-input'>
            <Textarea
              className='olachat-input-textarea'
              placeholder={translate('chat_type_a_message')}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              value={inputValue}
              rows={1}
              cols={20}
              ref={this.registerRef}
              autoFocus={this.props.isDesktop}
              initialHeight={50}
              disabled={this.props.disabled}
            />
          </div>
          {this.props.location ? (
            <GeoLocation refreshOnGeoChange={false} showLabel={false} />
          ) : null}
          {voiceInput && supportsVoice ? (
            <div className='olachat-input-voice'>
              <Voice
                onResult={this.onVoiceChange}
                onFinalResult={this.onVoiceFinal}
                voiceAdapter={this.props.voiceAdapter}
              />
            </div>
          ) : null}
          <button
            disabled={isTyping || !this.state.text || this.props.disabled}
            className='olachat-submit'
          >
            <Send />
          </button>
        </div>
        <style jsx>
          {`
            .olachat-submit {
              color: ${theme.primaryColor};
            }
            .olachat-submit :global(.ola-icon) {
              fill: ${theme.primaryColor};
            }
            .olachat-submit:disabled :global(.ola-icon) {
              fill: #888;
            }
            .olachat-submit :global(.ola-icon circle) {
              stroke: ${theme.primaryColor};
            }
            .olachat-submit:disabled :global(.ola-icon circle) {
              stroke: #888;
            }
            .olachat-footer :global(.ola-link-geo),
            .olachat-footer :global(.ola-link-geo:hover) {
              background: none;
              color: red;
            }
          `}
        </style>
      </form>
    )
  }
}

export default connect(null)(
  Decorators.withLogger(
    Decorators.withConfig(
      Decorators.withTranslate(listensToClickOutside(Input))
    )
  )
)
