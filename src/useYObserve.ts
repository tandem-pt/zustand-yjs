import { useEffect, useMemo } from 'react'
import * as Y from 'yjs'
import shallow from 'zustand/shallow'
import useYStore from './useYStore'

const useYObserve = <T extends Y.AbstractType<any>>(
  yType: T,
  serialize: () => any
): void => {
  const [listen, unListen, update] = useYStore(
    (state) => [state.listenType, state.unListenType, state.update],
    shallow
  )

  useEffect(() => {
    listen(yType, () => update(yType, serialize()))
    update(yType, serialize())
    return () => unListen(yType)
  }, [])
}

export default useYObserve
