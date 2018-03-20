import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { GeoLocation } from '@olasearch/core'
import { connect } from 'react-redux'
import { ignoreLocation } from './actions'

/**
 * Ask for users geo location
 * @example ./../styleguide/Geo.md
 */
class Geo extends Component {
  static propTypes = {
    /**
     * Is the message currently active (latest message)
     */
    isActive: PropTypes.bool,
    /**
     * Does the message needs location
     */
    needsLocation: PropTypes.bool
  }
  onGeoSuccess = data => {
    if (!data) return
    this.props.onSubmit({
      intent: this.props.message.intent,
      hidden: true,
      query: this.props.message.message
    })
  }
  onIgnoreGeo = data => {
    this.props.ignoreLocation()
    /**
     * Send a empty query
     */
    this.props.onSubmit({
      intent: this.props.message.intent,
      hidden: true,
      query: this.props.message.message
    })
  }
  render () {
    let { isActive } = this.props
    /**
     * If message requires location and isActive
     */
    if (this.props.needsLocation) {
      return (
        <div>
          <GeoLocation
            onSuccess={this.onGeoSuccess}
            disabled={!isActive}
            showLabel
          />
          <button
            disabled={!isActive}
            onClick={this.onIgnoreGeo}
            className='ola-btn'
          >
            Ignore
          </button>
        </div>
      )
    }
    return null
  }
}

export default connect(null, { ignoreLocation })(Geo)
