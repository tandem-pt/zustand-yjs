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

Create a `Y.Doc` that will sync.

```js
const mainDoc = new Y.Doc()
// Connect then this doc to the provider you want (y-webrtc, y-websocket, etc)
```

From this, doc you can then create some stores that will hold Y.Array or Y.Map references.

```js
import { createYArrayStore } from 'zustand-yjs'
import * as Y from 'yjs'
type Members = {
  username?: string
  email: string
}
const yArray = mainDoc.getArray('members')
const memberCollection = yArray as Y.Array<Members>
const store = createYArrayStore(memberCollection)
```

Here you are, you have a reactive store!

```jsx
const MemberList = () => {
  const members = store((state) => state.data)
  return (
    <ul>
      {members.map(({ email }) => (
        <li key={email}>{email}</li>
      ))}
    </ul>
  )
}
```

Here a complete gist:

```js
import { createYArrayStore } from 'zustand-yjs'
import * as Y from 'yjs'
type Members = {
  username?: string
  email: string
}

const mainDoc = Y.Doc();
const yArray = mainDoc.getArray('members')
const memberCollection = yArray as Y.Array<Members>

const useMembers = createYArrayStore(memberCollection);

const Members = () => {
  const members = useMembers((state) => state?.data)
  return (
    <table>
        {members.map((member, index) => (
          <tr key={index}>
            <td>
                {member.username}
            </td>
            <td>
                {member.email}
            </td>
          </tr>
        ))}
    </table>
  )
}
```

## Special Thanks

- [Relm, svelt-yjs](https://github.com/relm-us/svelt-yjs/), this repo. started with this.
- [YJS](https://github.com/yjs/yjs) – CRDT framework that deserve love and support
- [Zustand](https://github.com/pmndrs/zustand) – A small, fast and scaleable bearbones state-management solution. Our build system is taken from there.

## Roadmap

1. Online demo
2. Add test
3. Support sub-documents
4. Add helpers for YXMLFragment

## License

See the [CONTRIBUTE](CONTRIBUTE.md) file for contribution guidelines

## Contribution

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
