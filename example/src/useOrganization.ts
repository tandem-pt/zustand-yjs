import { createYMapStore } from 'zustand-yjs'
import * as Y from 'yjs'
import mainDoc from './organizationDoc'
console.log(ZustandYjs)
type OrganizationType = {
  name?: string
  firstName: string
}
const orgY = mainDoc.getMap('organization') as Y.Map<OrganizationType>

export default createYMapStore<OrganizationType>(orgY)
