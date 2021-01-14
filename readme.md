# Zustand-Yjs

> Disclaimer: This is a work in progress. Do not use this library in production,
> breaking change will happens before arriving to the first stable version.

Create zustand's store with Y.Array or Y.Doc types.

```javascript
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

## Roadmap

1. Add test
2. Support sub-documents
3. Add helpers for YXMLFragment

## License

See the [CONTRIBUTE](CONTRIBUTE.md) file for contribution guidelines

## Contribution

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
