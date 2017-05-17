import React from 'react'
import Voice from './Voice'
import { Settings, Actions } from 'olasearch'
import Textarea from 'react-flexi-textarea'
import QuerySuggestions from './QuerySuggestions'
import { connect } from 'react-redux'
import HelpMenu from './HelpMenu'
import listensToClickOutside from 'react-onclickoutside'

const supportsVoice = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      suggestions: [],
      submitting: false,
      suggestedIndex: null,
      suggestedTerm: null
    }
  }
  handleClickOutside = (event) => {
    this.closeSuggestion()
  };
  onChange = (event) => {
    let text = event.target.value
    this.setState({
      text
    })

    if (text) {
      /**
       * Auto suggest queries
       */
      let lastMsg = this.props.messages[this.props.messages.length - 1]
      let hasQuickReply = lastMsg && lastMsg.slot_options && lastMsg.slot_options.length

      if (!hasQuickReply || this.props.isTyping) {
        this.props.dispatch(Actions.AutoSuggest.executeFuzzyAutoSuggest(text))
          .then((values) => {
            if (!values) return this.closeSuggestion()

            this.setState({
              suggestions: values.slice(0, 5).map((item) => ({ term: item.term })),
              suggestedTerm: null,
              suggestedIndex: null
            })
          })
      } else {
        this.closeSuggestion()
      }
    } else {
      this.closeSuggestion()
    }

    this.props.onChange && this.props.onChange(text)
  };
  onVoiceChange = (text) => {
    this.setState({
      text
    })
  };
  clearText = () => {
    this.setState({
      text: ''
    })
  };
  onVoiceFinal = (text, cb) => {
    /* Set text to empty */
    if (typeof text === 'undefined') text = ''

    /* Update text */
    this.setState({
      text
    }, () => this.onSubmit(null, cb, 300, Settings.SEARCH_INPUTS.VOICE))
  };
  onFormSubmit = (event) => {
    /* Stop form submission */
    event && event.preventDefault()
    /* Check if suggestedTerm is active */
    if (this.state.suggestedTerm) {
      this.setState({
        text: this.state.suggestedTerm.term
      })
      this.closeSuggestion()
    }

    /* Stop submitting if text is empty */
    if (!this.state.text) {
      return this.Input.el.focus()
    }

    setTimeout(this.onSubmit, 0)
  };
  onSubmit = (event, callback, textClearingDelay = 0, searchInput = Settings.SEARCH_INPUTS.KEYBOARD) => {
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
      if (!this.props.isPhone) this.Input.el.focus()
    }, textClearingDelay)

    /* Submit the message */
    return this.props.onSubmit()
      .then((response) => {
        /* Callbacks */
        callback && typeof callback === 'function' && callback(response)
      })
  };
  closeSuggestion = () => {
    this.setState({
      suggestions: [],
      suggestedIndex: null,
      suggestedTerm: null
    })
  };
  onKeyDown = (event) => {
    let index = null
    switch (event.nativeEvent.which) {
      case 13: // Enter key
        this.closeSuggestion()
        if (!event.nativeEvent.shiftKey) {
          this.onFormSubmit(event)
        }
        break

      case 27: // Escape
        /* Check if suggestion is active */
        if (this.state.suggestedIndex || this.state.suggestions.length) {
          return this.closeSuggestion()
        }
        /* Close chatbot */
        if (!this.state.text) {
          this.props.onRequestClose && this.props.onRequestClose()
        } else {
          return this.clearText()
        }
        break

      case 38: // Up

        if (this.state.suggestedIndex === null) {
          index = this.state.suggestions.length - 1
        } else {
          let i = this.state.suggestedIndex - 1
          if (i < 0) {
            index = null
          } else {
            index = i
          }
        }
        this.setState({
          suggestedIndex: index,
          suggestedTerm: index === null ? null : this.state.suggestions[index]
        })
        break
      case 40: // Down
        if (this.state.suggestedIndex === null) {
          index = 0
        } else {
          let i = this.state.suggestedIndex + 1
          if (i >= this.state.suggestions.length) {
            index = null
          } else {
            index = i
          }
        }
        this.setState({
          suggestedIndex: index,
          suggestedTerm: index === null ? null : this.state.suggestions[index]
        })
        break
    }
  };
  registerRef = (el) => {
    this.Input = el
  };
  onSuggestionChange = (text) => {
    this.setState({ text, suggestedIndex: null, suggestedTerm: null, suggestions: [] }, () => {
      this.onFormSubmit()
    })
  };
  render () {
    let { isTyping } = this.props
    let { suggestions, suggestedIndex, suggestedTerm, text } = this.state
    let inputValue = suggestedTerm ? suggestedTerm.term : text
    return (
      <form className='olachat-footer' onSubmit={this.onFormSubmit}>
        <QuerySuggestions
          onChange={this.onSuggestionChange}
          suggestions={suggestions}
          activeIndex={suggestedIndex}
          queryTerm={text}
        />
        <HelpMenu />
        <div className='olachat-input'>
          {supportsVoice
           ? <div className='olachat-input-voice'>
             <Voice
               onResult={this.onVoiceChange}
               onFinalResult={this.onVoiceFinal}
               voiceAdapter={this.props.voiceAdapter}
              />
           </div>
            : null
          }
          <Textarea
            placeholder='Type here...'
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            value={inputValue}
            rows={1}
            cols={1}
            ref={this.registerRef}
            autoFocus={!this.props.isPhone}
          />
        </div>
        <button disabled={isTyping} className='olachat-submit'>
          <span>Send</span>
        </button>
      </form>
    )
  }
}

export default connect(null)(listensToClickOutside(Input))
