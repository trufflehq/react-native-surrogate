# react-native-surrogate

Allows designating a view as a surrogate, so when you render it elsewhere, it'll maintain its state. Useful for video players, webviews, etc.

Basically same concept as portals & heavily inspired by https://github.com/mfrachet/rn-native-portals

The main difference is portals are typically bottom-up where an element deeper in the tree is rendering to one higher up. This is for top-down, where we define a view higher up in the tree, and render it lower down. This is more similar to reverse-portals like https://www.npmjs.com/package/react-reverse-portal. It allows an element high up (that won't be unmounted) to render in views lower down in the tree.

There are some caveats. We're relocating the react-native view, but react-native still thinks it's in the original location. It means typically that view would still be given the size of the original location via UIManager.

To work around this, we detect the size of the view we want to show, and set the size of the original view to that size. This is a bit hacky, but it works.

`SomeFile.jsx`
```jsx
import React from 'react';
import { View, Text } from 'react-native';
import { ViewSurrogate } from 'react-native-surrogate';

export default function SomeFile() {
  return (
    <ViewSurrogate id="some-key">
      <Text>Some text</Text>
    </ViewSurrogate>
  );
}
```

`SomeOtherFile.jsx`
```jsx
import React from 'react';
import { View, Text } from 'react-native';
import { ViewRenderer } from 'react-native-surrogate';

export default function SomeOtherFile() {
  return (
    <ViewRenderer id="some-key" />
  );
}
```

## Getting started

`$ npm install react-native-surrogate --save`

### Mostly automatic installation

`$ react-native link react-native-surrogate`

## Usage
```javascript
import Surrogate from 'react-native-surrogate';

// TODO: What to do with the module?
Surrogate;
```
