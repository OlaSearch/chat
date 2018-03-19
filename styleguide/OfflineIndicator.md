#### Usage 

```js
const { ActionTypes } = require('@olasearch/core');
<>
  <OfflineIndicator
    connection='offline'
  />
  <button className='ola-btn' onClick={() => store.dispatch({ type: ActionTypes.UPDATE_CONNECTION, status: 'offline'}) }>Simulate offline</button>
</>
```