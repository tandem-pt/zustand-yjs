<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

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
  - [Contributors ✨](#contributors-)

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

Zustand-yjs manage a store of `Y.Doc`, allowing you to connect and disconnect easily.

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

From this, you can use the docs with `Y.Array`, `Y.Map`. Other Y-types are coming.

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
2. `yarn install`
3. `cd example; yarn`
4. `yarn start`

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
2. Add tests

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

## Contribution

See the [CONTRIBUTE](CONTRIBUTING.md) file for contribution guidelines

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/felipenovaes"><img src="https://avatars.githubusercontent.com/u/8993062?v=4?s=100" width="100px;" alt=""/><br /><sub><b>felipenovaes</b></sub></a><br /><a href="https://github.com/tandem-pt/zustand-yjs/commits?author=felipenovaes" title="Code">💻</a></td>
    <td align="center"><a href="https://neftaly.com/"><img src="https://avatars.githubusercontent.com/u/1147806?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Neftaly Hernandez</b></sub></a><br /><a href="https://github.com/tandem-pt/zustand-yjs/commits?author=neftaly" title="Code">💻</a> <a href="https://github.com/tandem-pt/zustand-yjs/issues?q=author%3Aneftaly" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://www.alignaec.com"><img src="https://avatars.githubusercontent.com/u/34066664?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nicolas Schmidt</b></sub></a><br /><a href="#ideas-NGimbal" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/tandem-pt/zustand-yjs/pulls?q=is%3Apr+reviewed-by%3ANGimbal" title="Reviewed Pull Requests">👀</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
