List of public redux actions you can dispatch to control the chatbot

### Show the chatbot

```js static
import { ChatActions } from '@olasearch/chat'

store.dispatch(
  ChatActions.showBot()
)
```

### Hide the chatbot

```js static
import { ChatActions } from '@olasearch/chat'

store.dispatch(
  ChatActions.hideBot()
)
```

### Clear all messages

```js static
import { ChatActions } from '@olasearch/chat'

store.dispatch(
  ChatActions.clearMessages()
)
```

### Change user query 

```js static
import { ChatActions } from '@olasearch/chat'

store.dispatch(
  ChatActions.updateBotQueryTerm('hello how are you')
)
````

### Clear/Remove user query 

```js static
import { ChatActions } from '@olasearch/chat'

store.dispatch(
  ChatActions.clearBotQueryTerm()
)
````