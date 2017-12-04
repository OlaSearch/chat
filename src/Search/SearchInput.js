import React from 'react'
import Voice from './../Voice'

export default class SearchInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }
  handleChange = event => {
    this.setState({ text: event.target.value })
  }
  clearText = event => {
    this.setState({ text: '' })
  }
  handleSubmit = event => {
    event && event.preventDefault()
    this.props.onSubmit(this.state.text)
    this.clearText()
  }
  onVoiceChange = text => {
    this.setState({
      text
    })
  }
  onVoiceFinal = (text, cb, params) => {
    this.props.onSubmit(text, cb)
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="olachat-input">
          <div className="olachat-input-voice">
            <Voice
              onResult={this.onVoiceChange}
              onFinalResult={this.onVoiceFinal}
              voiceAdapter={this.props.voiceAdapter}
            />
          </div>
          <input
            type="text"
            placeholder="Search"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button type="submit" className="olachat-submit" />
        </div>
      </form>
    )
  }
}
