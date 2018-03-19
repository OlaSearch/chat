#### Usage 

```js
const userMessage = {
  message: 'Hello there',
  userId: '12',
  timestamp: 1521457282161
};
const botMessage = {
  reply: 'Hello from bot',
  timestamp: 1521457282161
};
<>
  <Message
    message={userMessage}
    showTimestamp
  />
  <Message
    message={botMessage}
    avatarBot={olaconfig.botAvatar}
    showTimestamp
  />
</>
```