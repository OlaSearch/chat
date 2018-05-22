import React from 'react'
import { connect } from 'react-redux'
import { Decorators } from '@olasearch/core'
import { CONTEXT_TYPE_INVITE, CONTEXT_TYPE_INTENT } from './Settings'
import {
  addMessage,
  updateBotQueryTerm,
  showInvite,
  hideInvite,
  updateInvite,
  getShoppingCart,
  markMessagesAsStale,
  hideBot
} from './actions'

function escapePaths (str) {
  return str.replace(/([/])/gi, '\\$1')
}

function getActiveContext (contexts, ContextState) {
  if (!contexts) return null
  var activeContext = null
  for (let i = 0; i < contexts.length; i++) {
    const { name, triggers, actions } = contexts[i]
    var isMatched = true
    for (let j = 0; j < triggers.length; j++) {
      const { variable, value } = triggers[j]
      const reg = new RegExp(escapePaths(value))
      const contextValue = ContextState[variable]
      if (contextValue !== value && !reg.test(contextValue)) isMatched = false
    }
    if (isMatched) {
      activeContext = {
        name,
        actions
      }
      break
    }
  }
  return activeContext
}

/**
 * Decides
 * 1. when to send an initial intent message to the bot
 * 2. when to show the invite
 * 3. when to trigger intents on context change
 */
class ChatController extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      initialIntent: this.props.initialIntent,
      activeContextName: null
    }
  }
  componentDidMount () {
    this.triggerContext()
    this.triggerContextAction()
  }
  componentWillUnmount () {
    this.props.hideInvite()
    this.props.markMessagesAsStale()
    if (this.props.startOver) this.props.hideBot()
  }
  componentDidUpdate (prevProps) {
    if (
      this.props.Context !== prevProps.Context ||
      this.props.config.contexts !== prevProps.config.contexts
    ) {
      this.triggerContext()
    }
    if (
      this.props.isBotActive !== prevProps.isBotActive &&
      this.props.isBotActive
    ) {
      /**
       * Trigger a context action
       */
      this.triggerContextAction()
    }
  }
  triggerContext = () => {
    const activeContext = getActiveContext(
      this.props.config.contexts,
      this.props.Context
    )
    if (activeContext) {
      const { name, actions } = activeContext
      /* If the active context is the same */
      if (this.state.activeContextName === name) return

      for (let i = 0; i < actions.length; i++) {
        const { type, intent } = actions[i]
        if (type === CONTEXT_TYPE_INVITE) {
          /* Update the invite message */
          this.props.updateInvite(actions[i])
          setTimeout(this.props.showInvite, 500)
        }
        if (type === CONTEXT_TYPE_INTENT) {
          this.setState({
            initialIntent: intent
          })
        }
      }
      this.setState({
        activeContextName: name
      })
    }
  }
  triggerContextAction (prevProps) {
    /* Only send a message if the bot is active */
    if (!this.props.isBotActive) return
    if (this.props.startOver || !this.props.messages.length) {
      /* Check for context */
      const initialIntent = this.state.initialIntent || this.props.initialIntent
      this.props.addMessage({
        intent: initialIntent,
        start: true,
        callback: this.props.getCart,
        chatBotMessageTimeout: this.props.config.chatBotMessageTimeout
      })
    }

    /* Disable chatbot.. More todo */
    if (this.props.disabled) {
      this.props.addMessage({
        label: this.props.disabled,
        value: this.props.disabled,
        disableSubmit: true
      })
    }

    /* Check for shopping cart */
    if (this.props.config.chatBotCart) {
      this.props.getShoppingCart({
        intent: this.props.config.chatBotCartIntent
      })
    }
  }
  render () {
    return null
  }
}

function mapStateToProps (state) {
  return {
    Context: state.Context,
    messages: state.Conversation.messages,
    isBotActive: state.Conversation.isBotActive,
    inviteVisible: state.Conversation.inviteVisible,
    inviteUserDismissed: state.Conversation.inviteUserDismissed
  }
}

export default connect(mapStateToProps, {
  addMessage,
  showInvite,
  updateInvite,
  hideInvite,
  hideBot,
  getShoppingCart,
  markMessagesAsStale
})(Decorators.withConfig(ChatController))
