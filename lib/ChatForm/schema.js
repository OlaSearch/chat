'use strict';

function validateFullName(text) {
  return text;
}

function validateNric(text) {
  return text;
}

function validateSubmit(text) {
  return text.toLowerCase() === 'yes';
}

module.exports = [{
  dialogue: 'Hello. Let me help you to fill this form'
}, {
  dialogue: 'Please enter your full name',
  validate: validateFullName,
  slots: ['name']
}, {
  dialogue: 'Please enter your NRIC or passport number',
  validate: validateNric,
  slots: ['nric']
}, {
  dialogue: 'Please enter your email',
  validate: function validate() {
    return true;
  },
  slots: ['email']
}, {
  dialogue: 'Please enter your mobile number',
  validate: function validate() {
    return true;
  },
  slots: ['mobile']
}, {
  dialogue: 'Shall I submit the form',
  dialogue_repeat: 'Please answer with a yes or no',
  validate: validateSubmit,
  slots: ['submit']
}, {
  dialogue: 'Thank you. We have submitted the form. Have a good day'
}];