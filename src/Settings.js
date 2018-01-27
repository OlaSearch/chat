export const EMOJI_LIST = {
  '\\01f44d': 'emoji-thumbs-up',
  '\\01f44e': 'emoji-thumbs-down'
}
export const EMOJI_POSITIVE = '\\01f44d'
export const EMOJI_NEGATIVE = '\\01f44e'
export const FEEDBACK_INTENT = 'OLA.FeedbackIntent'
export const HELP_INTENT = 'OLA.HelpIntent'
export const PROFANITY_INTENT = 'OLA.ProfanityIntent'
export const UNFILFILLED_INTENT = 'OLA.UnfulfilledIntent'
export const WELCOME_INTENT = 'OLA.WelcomeIntent'
export const NONE_INTENT = 'OLA.NoneIntent'
export const DISAMBIGUATION_INTENT_NAME = 'OLA.DisambiguateIntent'
export const OLACHAT_IFRAME_ID = 'olachat-iframe'
export const OLACHAT_MESSAGE_ELEMENT = '.olachat-message-reply'
export const BUBBLE_WIDTH_DESKTOP = 280
export const BUBBLE_WIDTH_MOBILE = 60
export const BUBBLE_HEIGHT_MOBILE = 60
export const BUBBLE_SPACING = 10
export const BOT_WIDTH_ACTIVE  = 880
export const BOT_ZINDEX = 99999999
export const BUBBLE_FULL_WIDTH_DESKTOP = BUBBLE_WIDTH_DESKTOP + 2 * BUBBLE_SPACING /* [10 + 60 + 10] */
export const BUBBLE_FULL_WIDTH_MOBILE = BUBBLE_WIDTH_MOBILE + 2 * BUBBLE_SPACING /* [10 + 60 + 10] */
export const BUBBLE_FULL_HEIGHT = BUBBLE_HEIGHT_MOBILE + 2 * BUBBLE_SPACING

export const IGNORE_FEEDBACK_INTENTS = [
  FEEDBACK_INTENT,
  HELP_INTENT,
  PROFANITY_INTENT,
  UNFILFILLED_INTENT,
  WELCOME_INTENT,
  DISAMBIGUATION_INTENT_NAME
]
export const EMPTY_ARRAY = []
