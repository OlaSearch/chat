import React from 'react'
import Header from './Header'
import Input from './Input'
import Messages from './Messages'
import Bookmarks from './Bookmarks'
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
import { withDocument } from '@olasearch/react-frame-portal'

class Chat extends React.Component {
  static defaultProps = {
    flipped: true,
    title: 'Ola Bot',
    onLoad: () => new Promise(resolve => resolve())
  }
  addMessage = args => {
    /* Add message */
    return this.props.addMessage({
      ...args,
      chatBotMessageTimeout: this.props.config.chatBotMessageTimeout,
      callback: this.props.getCart
    })
  }
  render () {
    const {
      theme,
      isSidebarOpen,
      config: {
        chatBotFeedback,
        chatBotCart,
        chatBotMessageActions,
        chatBotMessageTimeout,
        intentsFeedbackDisabled
      }
    } = this.props
    const showSidebar = isSidebarOpen
    const classes = cx('olachat', { 'olachat-sidebar-visible': showSidebar })
    return (
      <div className={classes}>
        <OfflineIndicator />
        <div className='olachat-group'>
          <div className='olachat-main'>
            <Header
              onHide={this.props.onHide}
              title={this.props.title}
              theme={theme}
              debug={this.props.debug}
              inline={this.props.config.chatBotInline}
              isDesktop={this.props.isDesktop}
              {...this.props.headerProps}
            />
            {chatBotMessageActions && (
              <Bookmarks document={this.props.document} />
            )}
            <Messages
              messages={this.props.messages}
              flipped={this.props.flipped}
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
              isDesktop={this.props.isDesktop}
              enableFeedback={chatBotFeedback}
              chatBotMessageTimeout={chatBotMessageTimeout}
              chatBotMessageActions={chatBotMessageActions}
              intentsFeedbackDisabled={intentsFeedbackDisabled}
              document={this.props.document}
              window={this.props.window}
            />
            <Input
              onSubmit={this.addMessage}
              voiceAdapter={this.props.voiceAdapter}
              updateQueryTerm={this.props.updateQueryTerm}
              addContextField={this.props.addContextField}
              isTyping={this.props.isTyping}
              searchInput={this.props.searchInput}
              isPhone={this.props.isPhone}
              isDesktop={this.props.isDesktop}
              onRequestClose={this.props.onRequestClose}
              messages={this.props.messages}
              voiceInput={this.props.voiceInput}
              location={this.props.location}
              theme={theme}
              toggleSidebar={this.props.toggleSidebar}
              disabled={this.props.disabled}
              enableCart={chatBotCart}
              cart={this.props.cart}
              closeOnEscape={this.props.closeOnEscape}
              document={this.props.document}
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
            .olachat :global(.ola-link-load-more),
            .olachat :global(.ola-link-load-more:hover),
            .olachat :global(.ola-link-load-more:active),
            .olachat :global(.ola-link-load-more:focus) {
              color: ${theme.primaryColor};
              background: transparent;
            }
            .olachat :global(.olachat-input-textarea),
            .olachat :global(.olachat-query-suggestion),
            .olachat :global(button) {
              font-family: ${theme.chatFontFamily};
            }
            // prettier-ignore
            :global(.olachat-bot-desktop) .olachat :global(.olachat-input-textarea),
            :global(.olachat-bot-desktop) .olachat :global(.olachat-query-suggestion) {
              font-size: ${theme.chatInputFontSize};
            }
            // prettier-ignore
            .olachat :global(.ola-faux-checkbox-checked .ola-checkbox-icon) {
              background-color: ${theme.primaryColor};
              border-color: ${theme.primaryColor};
            }
            .olachat :global(.ola-faux-checkbox-checked.ola-faux-checkbox-disabled .ola-checkbox-icon) {
              background-color: #cbd0d1;
            }
            .olachat :global(.ola-faux-checkbox-disabled .ola-checkbox-icon) {
              border-color: #cbd0d1;
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
            :global(.olachat-module-item-title) {
              color: ${theme.primaryColor};
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
    href: state.Context.href,
    newMessageId: state.Conversation.newMessageId,
    isTyping: state.Conversation.isTyping,
    isPhone: state.Device.isPhone,
    isDesktop: state.Device.isDesktop,
    location: state.Context.location,
    isSidebarOpen: state.Conversation.isSidebarOpen,
    intentsFeedbackDisabled: state.Conversation.intentsFeedbackDisabled,
    searchInput: state.QueryState.searchInput,
    cart: state.Conversation.cart
  }
}

export default connect(mapStateToProps, {
  addMessage,
  updateQueryTerm: updateBotQueryTerm,
  toggleSidebar,
  getShoppingCart
})(
  Decorators.withTheme(
    Decorators.withLogger(Decorators.withConfig(withDocument(Chat)))
  )
)
