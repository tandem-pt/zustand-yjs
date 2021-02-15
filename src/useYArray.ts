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
  const noBinding = (funcKey: keyof Y.Array<T>) => () => {
    throw new Error(`Y.Array#${funcKey} is not implemented`)
  }

  return {
    forEach: yArray.forEach
      ? yArray.forEach.bind(yArray)
      : noBinding('forEach'),
    map: yArray.map ? yArray.map.bind(yArray) : noBinding('map'),
    slice: yArray.slice ? yArray.slice.bind(yArray) : noBinding('slice'),
    get: yArray.get ? yArray.get.bind(yArray) : noBinding('get'),
    delete: yArray.delete ? yArray.delete.bind(yArray) : noBinding('delete'),
    unshift: yArray.unshift
      ? yArray.unshift.bind(yArray)
      : noBinding('unshift'),
    push: yArray.push ? yArray.push.bind(yArray) : noBinding('push'),
    insert: yArray.insert ? yArray.insert.bind(yArray) : noBinding('insert'),
    data,
  }
}
export default useYArray
