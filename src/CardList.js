import React from 'react'
import CardButton from './CardButton'
import { stripHtml } from './utils'
import classNames from 'classnames'

const CardList = ({ title, elements, buttons }) => {
  return (
    <div className='ola-card-list'>
      <div className='ola-card-list-title'>{title}</div>
      <div className='ola-card-list-items'>
        {elements.map(({ title, subtitle, default_action: defaultAction, fields }, idx) => {
          return (
            <div className='ola-card-list-item' key={idx}>
              <div className='ola-card-list-inner'>
                <h3 className='ola-card-title'>
                  {defaultAction
                     ? <a target='_blank' href={defaultAction.url}>{title}</a>
                     : <span>{title}</span>
                  }
                </h3>
                {subtitle
                  ? <div className='ola-card-subtitle'>
                    {stripHtml(subtitle)}
                  </div>
                  : null
                }
                <div className='ola-answer-keyvalue'>
                  {fields
                    .map(({ label, value }, idx) => {
                      let klass = classNames('ola-answer-row', `ola-answer-row-${label}`)
                      return (
                        <div className={klass} key={idx}>
                          <div className='ola-answer-value'>
                            {value}
                          </div>
                        </div>
                      )
                    })}
                </div>
                {defaultAction
                  ? <div className='ola-card-action'>
                    <a href={defaultAction.url}>{defaultAction.url}</a>
                  </div>
                  : null
                }
              </div>
            </div>
          )
        })}
      </div>
      {buttons && buttons.length
        ? <div className='ola-card-list-buttons'>
          {buttons.map((button, idx) => <CardButton {...button} key={idx} />)}
        </div>
        : null
      }
    </div>
  )
}

module.exports = CardList
