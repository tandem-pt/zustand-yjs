import * as Y from 'yjs'
import useYStore from './useYStore'
import { MountFunction, YDocEnum } from './types'
import shallow from 'zustand/shallow'
import { useEffect, useMemo } from 'react'

const useYDoc = (name: string, mount: MountFunction) => {
  const [mountYDoc, unMountYDoc, yDocs] = useYStore(
    (state) => [state.mountYDoc, state.unMountYDoc, state.yDocs],
    shallow
  )
  const yDoc = useMemo(() => {
    const match = yDocs.find(([docGuid]) => docGuid === name)
    if (match) return match[YDocEnum.DOC]
    const yDoc = new Y.Doc()
    yDoc.guid = name
    mountYDoc(yDoc, mount)
    return yDoc
  }, [yDocs, name])

  useEffect(() => {
    return () => unMountYDoc(yDoc)
  }, [unMountYDoc, name])
  return yDoc
}

export default useYDoc
