import { createYArrayStore } from 'zustand-yjs'
import * as Y from 'yjs'
import mainDoc from './organizationDoc'
type Members = {
  username?: string
  email: string
}
const yArray = mainDoc.getArray('members')

const memberCollection = yArray as Y.Array<Members>

export default createYArrayStore(memberCollection)
