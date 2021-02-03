import * as Y from 'yjs'
import useYStore from './useYStore'
import useYObserve from './useYObserve'
import { useMemo } from 'react'

type MapFunctions<T> = Pick<
  Y.Map<T>,
  'set' | 'get' | 'has' | 'delete' | 'forEach' | 'entries' | 'values' | 'keys'
>
type MapWrapper<T, U extends Record<string, T>> = { data: U } & MapFunctions<T>

const useYMap = <T, U extends Record<string, T>>(
  yMap: Y.Map<T>
): MapWrapper<T, U> => {
  useYObserve<Y.Map<T>>(yMap, () => yMap.toJSON())
  const dataSet = useYStore((state) => state.data)

  const data = useMemo(() => {
    const match = dataSet.find(([type]) => type === yMap)
    if (!match) return {}
    return match[1]
  }, [yMap, dataSet]) as U

  return {
    set: yMap.set.bind(yMap),
    get: yMap.get.bind(yMap),
    has: yMap.has.bind(yMap),
    delete: yMap.delete.bind(yMap),
    forEach: yMap.forEach.bind(yMap),
    entries: yMap.entries.bind(yMap),
    values: yMap.values.bind(yMap),
    keys: yMap.keys.bind(yMap),
    data,
  }
}
export default useYMap
