#### Usage

```js
const results = [
  {
    title: 'Harlow',
    image: 'https://placeimg.com/800/300/any'
  },
  {
    title: 'Stephen Hawking',
    image: 'https://placeimg.com/800/300/any'
  }
];
const message = {
  search: {
    title: "Here are some results i found"
  }
};
<SearchResultsMessage
  results={results}
  message={message}
  isActive
/>
```