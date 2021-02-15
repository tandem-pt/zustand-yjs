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
  const noBinding = (funcKey: keyof Y.Map<T>) => () => {
    throw new Error(`Y.Map#${funcKey} is not implemented`)
  }
  return {
    keys: yMap.keys ? yMap.keys.bind(yMap) : noBinding('keys'),
    values: yMap.values ? yMap.values.bind(yMap) : noBinding('values'),
    entries: yMap.entries ? yMap.entries.bind(yMap) : noBinding('entries'),
    forEach: yMap.forEach ? yMap.forEach.bind(yMap) : noBinding('forEach'),
    delete: yMap.delete ? yMap.delete.bind(yMap) : noBinding('delete'),
    set: yMap.set ? yMap.set.bind(yMap) : noBinding('set'),
    get: yMap.get ? yMap.get.bind(yMap) : noBinding('get'),
    has: yMap.has ? yMap.has.bind(yMap) : noBinding('has'),
    data,
  }
}
export default useYMap
