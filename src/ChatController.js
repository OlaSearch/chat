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
  hideBot,
  checkBotContext
} from './actions'

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
    /* Check for context on initial mount */
    this.triggerContextChange()

    /**
     * Trigger default action
     */
    this.triggerDefaultActions()
  }
  componentWillUnmount () {
    /* Hide invites */
    this.props.hideInvite()

    /* Mark old messages */
    this.props.markMessagesAsStale()

    /* Hide bot */
    if (this.props.startOver) this.props.hideBot()
  }
  componentDidUpdate (prevProps) {
    if (
      this.props.Context !== prevProps.Context ||
      this.props.config.contexts !== prevProps.config.contexts
    ) {
      this.triggerContextChange()
    }

    /**
     * Check if any default actions needs to be executed
     */
    if (
      this.props.isBotActive !== prevProps.isBotActive &&
      this.props.isBotActive
    ) {
      /**
       * Trigger default action
       */
      this.triggerDefaultActions()
    }
  }
  triggerContextChange = () => {
    /**
     * Check for active contexts
     */
    this.props.checkBotContext().then(response => {
      const { actions } = response
      for (let i = 0; i < actions.length; i++) {
        const { type, intent } = actions[i]
        if (type === CONTEXT_TYPE_INVITE) {
          /* Update the invite message */
          this.props.updateInvite(actions[i])

          /* We have a timeout here so as to wait for CSS urls in Iframe to resolve: Todo */
          setTimeout(this.props.showInvite, 500)
        }
        if (type === CONTEXT_TYPE_INTENT) {
          this.setState({
            initialIntent: intent
          })
        }
      }
    })
  }
  triggerDefaultActions () {
    /**
     * Here we send a request to the intent engine
     * 1. Note the initialIntent. Its is from config file (config.initialIntent)
     */
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
  markMessagesAsStale,
  checkBotContext
})(Decorators.withConfig(ChatController))
