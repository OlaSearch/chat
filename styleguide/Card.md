#### Usage

```js
const card = {
  title: 'Result title',
  subtitle: 'Result subtitle',
  image: 'https://placeimg.com/800/300/any'
};
<Card
  card={card}
/>
```

With buttons
```js
const card = {
  title: 'Result title',
  subtitle: 'Result subtitle',
  image: 'https://placeimg.com/800/300/any',
  buttons: [
    {
      title: 'View webpage',
      type: 'web_url',
      url: '//olasearch.com'
    },
    {
      title: 'Contact us',
      type: 'web_url',
      url: '//olasearch.com'
    }
  ]
};
<Card
  card={card}
/>
```

#### Map


```js
const card = {
  "template": "map",
  "title": "Map of 49 award winners.",
  "elements": [
      {
          "location": "-27.4756124,153.0280484",
          "title": "Queensland University of Technology, Australia"
      },
      {
          "location": "50.7231963,-1.9063363",
          "title": "Liverpool Victoria, UK"
      }
  ]
};
<Card
  card={card}
/>
```

With results from search engine

```js
const card = {
  "template": "map",
  "title": "Map of 49 award winners.",
  "element_keys": {
      "location": "ola_location",
      "title": "schema_org_name_t"
  },
  source: 'results'
};
const results = [
  {
      "ola_location": "-27.4756124,153.0280484",
      "schema_org_name_t": "Queensland University of Technology, Australia"
  },
  {
      "ola_location": "50.7231963,-1.9063363",
      "schema_org_name_t": "Liverpool Victoria, UK"
  }
];
<Card
  card={card}
  results={results}
/>
```

Show user's current location

```js
const card = {
  "template": "map",
  "title": "Map of 49 award winners.",
  "element_keys": {
      "location": "ola_location",
      "title": "schema_org_name_t"
  },
  source: 'results'
};
const results = [
  {
      "ola_location": "-27.4756124,153.0280484",
      "schema_org_name_t": "Queensland University of Technology, Australia"
  },
  {
      "ola_location": "50.7231963,-1.9063363",
      "schema_org_name_t": "Liverpool Victoria, UK"
  }
];
const location = "-27.4756124,153.0280484";
<Card
  card={card}
  results={results}
  location={location}
/>

```

#### Carousel

```js
const card = {
  "template": "carousel",
  "title": "Media Contact",
  "images": [
    {
      src: 'https://placeimg.com/800/300/any',
      title: ''
    },
    {
      src: 'https://placeimg.com/800/300/any',
      title: ''
    },
    {
      src: 'https://placeimg.com/800/300/any',
      title: ''
    },
    {
      src: 'https://placeimg.com/800/300/any',
      title: ''
    },
    {
      src: 'https://placeimg.com/800/300/any',
      title: ''
    }
  ],
  "source": {
    "name": "Media Contacts",
    "url": "https://www.adb.org/news/contacts"
  }
};
<Card
  card={card}
/>
```

#### List

```js
const card = {
  "template": "list",
  "title": "Media Contact",
  "elements": [
    {
      "buttons": [
        {
          title: "Send email",
          type: 'email',
          url: 'vinay@olasearch.com'
        }
      ],
      "fields": [
        {
          "label": "Topic",
          "value": "Development Effectiveness and Results"
        },
        {
          "label": "Website",
          "value": "https://www.adb.org/site/development-effectiveness/contacts"
        }
      ],
      "subtitle": null,
      "title": "Planning and Results Management contacts"
    },
    {
      "buttons": [
        {
          title: "Send email",
          type: 'email',
          url: 'vinay@olasearch.com'
        }
      ],
      "fields": [
        {
          "label": "Topic",
          "value": "Development Effectiveness and Results"
        },
        {
          "label": "Website",
          "value": "https://www.adb.org/site/development-effectiveness/contacts"
        }
      ],
      "subtitle": null,
      "title": "Planning and Results Management contacts"
    },
    {
      "buttons": [
        {
          title: "Send email",
          type: 'email',
          url: 'vinay@olasearch.com'
        }
      ],
      "fields": [
        {
          "label": "Topic",
          "value": "Development Effectiveness and Results"
        },
        {
          "label": "Website",
          "value": "https://www.adb.org/site/development-effectiveness/contacts"
        }
      ],
      "subtitle": null,
      "title": "Planning and Results Management contacts"
    },
    {
      "buttons": [
        {
          title: "Send email",
          type: 'email',
          url: 'vinay@olasearch.com'
        }
      ],
      "fields": [
        {
          "label": "Topic",
          "value": "Development Effectiveness and Results"
        },
        {
          "label": "Website",
          "value": "https://www.adb.org/site/development-effectiveness/contacts"
        }
      ],
      "subtitle": null,
      "title": "Planning and Results Management contacts"
    }
  ],
  "source": {
    "name": "Media Contacts",
    "url": "https://www.adb.org/news/contacts"
  }
};
<Card
  card={card}
/>
```

#### Wordmap

```js
const card = {
  "template": "wordmap",
  "title": "Showing 78 topics.",
  "elements": [
      {
          "count": 27,
          "title": "User experience"
      },
      {
          "count": 21,
          "title": "SharePoint"
      },
      {
          "count": 18,
          "title": "Dashboards"
      }
  ]
};
<Card
  card={card}
/>
```

#### Article

```js

const card = {
    "template": "article",
    "url": "https://olasearch.com/articles/search-technology-more-than-just-a-search-engine",
    "image": "https://www.impossible.sg/wp-content/uploads/2018/04/Top-5-search-engine-alternatives-to-consider-beside-Google-and-Yahoo.jpg",
    "title": "Search experience.",
    "author": [
        {"name": "Maish Nichani", "url": "https://twitter.com/maish?lang=en"},
        {"name": "Viswanath Parameswaran", "url": "https://www.zoominfo.com/p/Viswanath-Parameswaran/699670463"}
        ],
    "date_published": "04 January 2017",
    "subtitle": "Search technology includes taxonomy management, text analytics, search analytics and more.",
    "content": "Search technology includes taxonomy management, text analytics, search analytics and more. These related technologies add meaning and intelligence and make the search experience more efficient and enjoyable.",
    "related": [
        {
            title: 'Search experience: Selecting the right technologies',
            url: 'https://olasearch.com/articles/search-technology-more-than-just-a-search-engine'
        },
        {
            title: 'Search experience: Defining search goals',
            url: 'https://olasearch.com/articles/defining-search-goals'
        }
    ],
    "buttons": [],
};

<Card
    card={card}
    />
```
