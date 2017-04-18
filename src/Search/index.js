import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import mitt from 'mitt'
import classNames from 'classnames'
import google from './../adapters/google'
import SearchInput from './SearchInput'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import { utilities } from 'olasearch'
import TypingIndicator from './../TypingIndicator'
import Avatar from './../Avatar'
import { avatarBot } from './../utils'

const createMessage = (text, isBot) => {
  return {
    message: text,
    isBot,
    id: utilities.uuid()
  }
}

const generateReply = () => {
  var items = ['Sure, we found 10 new credit cards. Which one would you like?', 'Here you go']
  return items[0]
  return items[Math.floor(Math.random() * items.length)]
}

const results = [
  {
    title: 'Card activation &overseas card usage',
    desc: 'Enhanced card security measures implemented to better safeguard your Standard Chartered ATM, debit and credit cards.',
    thumbnail: 'https://www.sc.com/sg/search/images/1580x350_mas_masthead-375x175.jpg'
  },
  {
    title: 'Platinum Visa/MasterCard®Credit Card',
    desc: 'Earn one Rewards Point with every $1 charged and enjoy dining, enrichment, and health and wellness deals.',
    thumbnail: 'https://www.sc.com/sg/search/images/creditcards-platinum-visa-mastercard-375x175.jpg'
  },
  {
    title: 'Card activation &overseas card usage',
    desc: 'Enhanced card security measures implemented to better safeguard your Standard Chartered ATM, debit and credit cards.',
    thumbnail: 'https://www.sc.com/sg/search/images/1580x350_mas_masthead-375x175.jpg'
  },
  {
    title: 'Card activation &overseas card usage',
    desc: 'Enhanced card security measures implemented to better safeguard your Standard Chartered ATM, debit and credit cards.',
    thumbnail: 'https://www.sc.com/sg/search/images/1580x350_mas_masthead-375x175.jpg'
  }
]

/**
 * Same emitter is shared by context
 * @type {[type]}
 */
const emitter = mitt()

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isTyping: false,
    }

    /* Create a voiceAdapter */
    this.voiceAdapter = google({
      emitter,
    })

    /* Lazy load tokens */
    this.voiceAdapter.prefetchToken()
  }
  static defaultProps = {
    flipped: true
  };
  static childContextTypes = {
    emitter: PropTypes.object
  };
  getChildContext () {
    return {
      emitter
    }
  }
  addMessage = (text, isBot) => {
    this.setState({
      messages: [...this.state.messages, createMessage(text, isBot)]
    })
  }
  showTyping = () => {
    this.setState({
      isTyping: true
    })
  };
  hideTyping = () => {
    this.setState({
      isTyping: false
    })
  };
  handleSubmit = (text, callback) => {
    /* Exit early */
    if (!text) return

    /* Add new message */
    this.addMessage(text, false)

    setTimeout(() => this.showTyping(), 300)

    setTimeout(() => {
      this.hideTyping()
      let reply = generateReply()
      this.addMessage(reply, true)

      callback && callback({
        answer: {
          reply
        }
      })
    }, 2000)
  };
  render () {
    let { isTyping, messages } = this.state
    let { flipped } = this.props
    let showResults = messages.length > 1
    /* Reverse the messages */
    if (!flipped) {
      messages = messages.slice().reverse()
    }
    const msg = messages
                // .filter((item, idx) => idx < 2)
                .filter((item, idx) => messages.length - idx <= 2)
                .map(({ message, isBot, id }) => {
                  let klass = classNames('olachat-search-message', 'olachat-message', {
                    'olachat-search-message-bot': isBot
                  })
                  return (
                    <div key={id} className={klass}>
                      <Avatar
                        isBot={isBot}
                        avatarBot={avatarBot}
                      />
                      {message}
                    </div>
                  )
                })
    return (
      <div className='olachat-search'>
        <div className='olachat-search-header'>
          <SearchInput
            onSubmit={this.handleSubmit}
            voiceAdapter={this.voiceAdapter}
          />
          {msg.length
            ? <div className='olachat-search-container'>
              <div className='olachat-search-messages'>
                {isTyping ? flipped ? null : <TypingIndicator avatarBot={avatarBot} /> : null}
                <ReactCSSTransitionGroup
                  transitionName='messages'
                  transitionAppear
                  transitionAppearTimeout={300}
                  transitionEnterTimeout={500}
                  transitionLeave={false}
                  component='div'
                  className='olachat-messages-list'
                >
                  {msg}
                </ReactCSSTransitionGroup>
                {isTyping ? flipped ? <TypingIndicator avatarBot={avatarBot} /> : null : null}
              </div>
            </div>
            : null
          }
        </div>

        <div className='olachat-search-results'>
          {showResults && results.map((result, idx) => {
            let { title, desc, thumbnail } = result
            return (
              <div className='ola-snippet' key={idx}>
                <div><img src={thumbnail} /></div>
                <div>
                  <h3 className='ola-field-title'>
                    <a>{title}</a>
                  </h3>
                  <p>{desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return state
}

export default connect(mapStateToProps)(Search)
