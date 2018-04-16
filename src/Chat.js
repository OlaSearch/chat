import React from 'react'
import Header from './Header'
import Input from './Input'
import Messages from './Messages'
import { connect } from 'react-redux'
import {
  addMessage,
  updateBotQueryTerm,
  toggleSidebar,
  getShoppingCart
} from './actions'
import { Decorators } from '@olasearch/core'
import OfflineIndicator from './OfflineIndicator'
import Sidebar from './Sidebar'
import cx from 'classnames'

class Chat extends React.Component {
  static defaultProps = {
    flipped: true,
    title: 'Ola Bot',
    onLoad: () => new Promise((resolve, reject) => resolve())
  }
  componentDidMount () {
    /**
     * Check if the user has any messages
     */
    if (this.props.startOver || !this.props.messages.length) {
      this.props.addMessage({ intent: this.props.initialIntent, start: true })
    }
    /**
     * If its disabled
     */
    if (this.props.disabled) {
      this.props.addMessage({
        label: this.props.disabled,
        value: this.props.disabled,
        disableSubmit: true
      })
    }
    /**
     * Check for items in shopping cart
     */
    if (this.props.config.chatBotCart) {
      // this.props.getShoppingCart(this.props.config.chatBotCartIntent)
    }
  }
  addMessage = args => {
    /* Add message */
    return this.props.addMessage({
      ...args,
      callback: this.props.onMessage
    })
  }
  registerRef = el => {
    this.MessageContainer = el
  }
  render () {
    const {
      theme,
      isSidebarOpen,
      config: { chatBotFeedback, chatBotCart }
    } = this.props
    const showSidebar = isSidebarOpen && chatBotCart
    const classes = cx('olachat', { 'olachat-sidebar-visible': showSidebar })
    return (
      <div className={classes}>
        <div className='olachat-group'>
          <div className='olachat-main'>
            <Header
              onHide={this.props.onHide}
              title={this.props.title}
              theme={theme}
              debug={this.props.debug}
              isDesktop={this.props.isDesktop}
              {...this.props.headerProps}
            />
            <OfflineIndicator />
            <Messages
              messages={this.props.messages}
              flipped={this.props.flipped}
              ref={this.registerRef}
              onLoad={this.props.onLoad}
              avatarBot={this.props.avatarBot}
              avatarUser={this.props.avatarUser}
              addMessage={this.addMessage}
              botName={this.props.botName}
              userName={this.props.userName}
              log={this.props.log}
              setBotStatus={this.props.setBotStatus}
              updateQueryTerm={this.props.updateQueryTerm}
              location={this.props.location}
              newMessageId={this.props.newMessageId}
              theme={theme}
              enableFeedback={chatBotFeedback}
              chatBotMessageTimeout={this.props.config.chatBotMessageTimeout}
            />
            <Input
              onSubmit={this.addMessage}
              voiceAdapter={this.props.voiceAdapter}
              updateQueryTerm={this.props.updateQueryTerm}
              addContextField={this.props.addContextField}
              isTyping={this.props.isTyping}
              searchInput={this.props.searchInput}
              isPhone={this.props.isPhone}
              onRequestClose={this.props.onRequestClose}
              messages={this.props.messages}
              voiceInput={this.props.voiceInput}
              location={this.props.location}
              theme={theme}
              toggleSidebar={this.props.toggleSidebar}
              disabled={this.props.disabled}
              enableCart={chatBotCart}
              cart={this.props.cart}
            />
          </div>
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggle={this.props.toggleSidebar}
            isDesktop={this.props.isDesktop}
            addMessage={this.addMessage}
          />
        </div>
        <style jsx global>
          {`
            a {
              color: ${theme.chatLinkColor};
            }
            a:hover {
              color: ${theme.chatLinkHoverColor};
            }
            .olachat-bot {
              line-height: 1.5;
              color: #4a4a4a;
              font-family: ${theme.chatFontFamily};
            }
          `}
        </style>
        <style jsx>
          {`
            /* Background */
            .olachat {
              background: ${theme.chatBackground};
            }
            .olachat :global(.ola-link-load-more) {
              color: ${theme.primaryColor};
              background: transparent;
            }
            .olachat :global(.olachat-input-textarea),
            .olachat :global(.olachat-query-suggestion),
            .olachat :global(button) {
              font-family: ${theme.chatFontFamily};
            }
            .olachat :global(.olachat-input-textarea),
            .olachat :global(.olachat-query-suggestion) {
              font-size: ${theme.mediumFontSize};
            }
            .olachat :global(.ola-share-links) {
              display: block;
            }
            .olachat :global(.ola-link) {
              color: ${theme.primaryColor};
            }
            .olachat :global(.olachat-icon-button) {
              color: ${theme.primaryColor};
            }
            @media screen and (-ms-high-contrast: active),
              (-ms-high-contrast: none) {
              :global(img[src$='.svg']) {
                width: 100%;
              }
              :global(.olachat-body) {
                overflow: hidden;
              }
              :global(.olachat) {
                border: 1px #ccc solid;
              }
            }
          `}
        </style>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    messages: state.Conversation.messages,
    newMessageId: state.Conversation.newMessageId,
    isTyping: state.Conversation.isTyping,
    isPhone: state.Device.isPhone,
    isDesktop: state.Device.isDesktop,
    location: state.Context.location,
    isSidebarOpen: state.Conversation.isSidebarOpen,
    searchInput: state.QueryState.searchInput,
    cart: state.Conversation.cart
  }
}

export default connect(mapStateToProps, {
  addMessage,
  updateQueryTerm: updateBotQueryTerm,
  toggleSidebar,
  getShoppingCart
})(Decorators.withTheme(Decorators.withLogger(Decorators.withConfig(Chat))))
