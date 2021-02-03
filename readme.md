<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Zustand-Yjs](#zustand-yjs)
  - [Getting started](#getting-started)
  - [API](#api)
    - [`useYDoc(guid: string, connect: (doc: Y.Doc) => () => void)`](#useydocguid-string-connect-doc-ydoc----void)
    - [`useYArray(doc: Y.Array)`](#useyarraydoc-yarray)
    - [`useYMap(doc: Y.Array)`](#useymapdoc-yarray)
  - [Run the example](#run-the-example)
  - [Special Thanks](#special-thanks)
  - [Roadmap](#roadmap)
  - [License](#license)
  - [Contribution](#contribution)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Zustand-Yjs

> Disclaimer: This is a work in progress. Do not use this library in production,
> breaking change will happens before arriving to the first stable version.

Create zustand's store with Y.Array or Y.Doc types.
We include typescript definitions.

## Getting started

Install yjs, zustand and zustand-yjs.

```
yarn add zustand-yjs yjs zustand
```

Create a `Y.Doc` that will sync through a connect function.
You can connect there any `y-*` provider.

```tsx
import * as Y from 'yjs'
import { useYDoc } from 'zustand-yjs'

const connectDoc = (doc: Y.Doc) => {
  console.log('connect to a provider with room', doc.guid)
  return () => console.log('disconnect', doc.guid)
}

const App = () => {
  const yDoc = useYDoc('myDocGuid', connectDoc)
  return <div></div>
}
```

From this, doc you can then create some stores that will hold Y.Array or Y.Map references.

```tsx
import * as Y from 'yjs'
import { useYDoc } from 'zustand-yjs'

const connectDoc = (doc: Y.Doc) => {
  console.log('connect to a provider with room', doc.guid)
  return () => console.log('disconnect', doc.guid)
}

const App = () => {
  const yDoc = useYDoc('myDocGuid', connectDoc)
  const { data, push } = useYArray<string>(yDoc.getArray('usernames'))
  return (
    <div>
      <button onClick={() => push([`username #${data.length}`])}>
        New Username
      </button>
      <ul>
        {data.map((username, index) => (
          <li key={index}>{username}</li>
        ))}
      </ul>
    </div>
  )
}
```

Here you are, you have a reactive store!

## API

### `useYDoc(guid: string, connect: (doc: Y.Doc) => () => void)`

**params**

- _`string`_ **guid**: The Y.Doc#guid
- _`(doc: Y.Doc) => () => void)`_ connect: The connect function triggered on the first mount of the Y.Doc. Should return an unconnect function triggered on unmount.
  - **params**
    - _Y.Doc_ `doc`: The mounted doc, with a `Y.Doc#guid`
  - **returns**
    - _() => void_ : disconnect function that will be called on unmount.

**returns**

- _`Y.Doc`_: The created Y.Doc

---

### `useYArray(doc: Y.Array)`

**params**

- _`Y.Array<T>`_ **doc**: A Y.Array to use inside your component

**returns**

- _`T[]`_ **data**: The current data of the Y.Array used
- **forEach**: See Y.Array#forEach
- **map**: See Y.Array#map
- **slice**: See Y.Array#slice
- **get**: See Y.Array#get
- **delete**: See Y.Array#delete
- **unshift**: See Y.Array#unshift
- **push**: See Y.Array#push
- **insert**: See Y.Array#insert

---

### `useYMap(doc: Y.Array)`

**params**

- _`Y.Map<T, U extends Record<string, T>>`_ **doc**: A Y.Map to use inside your component. `T` is the type of the record values, `U` is the type of the return data.

**returns**

- _`U`_ **data**: The current data of the Y.Map used
- **set**: See Y.Map#set
- **get**: See Y.Map#get
- **has**: See Y.Map#has
- **delete**: See Y.Map#delete
- **forEach**: See Y.Map#forEach
- **entries**: See Y.Map#entries
- **values**: See Y.Map#values
- **keys**: See Y.Map#keys

---

## Run the example

1. Clone the Repository
2. `cd example;yarn`
3. `yarn start`

The example doesn't mount any connector for Y.Doc (yet). So don't expect syncing.
To do some sync, you can edit `example/src/organizationDoc.ts` and add some provider to the main document.

- [y-websocket](https://github.com/yjs/y-websocket)
- [y-webrtc](https://github.com/yjs/y-webrtc)
- [y-indexeddb](https://github.com/yjs/y-indexeddb)

## Special Thanks

- [Relm, svelt-yjs](https://github.com/relm-us/svelt-yjs/), the repo we started with, many thanks for publishing.
- [YJS](https://github.com/yjs/yjs) – CRDT framework that deserve love and support
- [Zustand](https://github.com/pmndrs/zustand) – A small, fast and scaleable bearbones state-management solution. Our build system is taken from there.

## Roadmap

1. Online demo
2. Add test
3. Support sub-documents (`useYSubDoc`?)
4. Add hooks for YXMLFragment

## License

See the [CONTRIBUTE](CONTRIBUTE.md) file for contribution guidelines

## Contribution

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
