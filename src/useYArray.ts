import * as Y from 'yjs'
import useYStore from './useYStore'
import useYObserve from './useYObserve'
import { useMemo } from 'react'
type ArrayFunctions<T> = Pick<
  Y.Array<T>,
  'forEach' | 'map' | 'slice' | 'get' | 'delete' | 'unshift' | 'push' | 'insert'
>
type ArrayWrapper<T> = { data: T[] } & ArrayFunctions<T>

const useYArray = <T>(yArray: Y.Array<T>): ArrayWrapper<T> => {
  useYObserve<Y.Array<T>>(yArray, () => yArray.toArray())
  const dataSet = useYStore((state) => state.data)

  const data = useMemo(() => {
    const match = dataSet.find(([type]) => type === yArray)
    if (!match) return []
    return match[1] as T[]
  }, [yArray, dataSet])
  return {
    forEach: yArray.forEach.bind(yArray),
    map: yArray.map.bind(yArray),
    slice: yArray.slice.bind(yArray),
    get: yArray.get.bind(yArray),
    delete: yArray.delete.bind(yArray),
    unshift: yArray.unshift.bind(yArray),
    push: yArray.push.bind(yArray),
    insert: yArray.insert.bind(yArray),
    data,
  }
}
export default useYArray
