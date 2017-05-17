import expect from 'expect'
import { addMessage } from './../../src/actions'

describe ('Adding a new message', () => {
  it('is a function', () => {
    expect(addMessage).toExist()
  })
})
