import { useCallback } from 'react'
import * as Y from 'yjs'
import create from 'zustand'

type ObserveFunc = (arg0: any, arg1: Y.Transaction) => void
type UnMountFunction = () => void | void
export type MountFunction = (doc: Y.Doc) => UnMountFunction

export enum YDocEnum {
  GUID = 0,
  DOC = 1,
  MOUNT = 2,
  UN_MOUNT = 3,
  USE_CNT = 4,
}
export enum ObserveEnum {
  TYPE = 0,
  OBSERVE = 1,
  USE_CNT = 2,
}
type YStore = {
  yDocs: [string, Y.Doc, MountFunction, UnMountFunction, number][] // guid, doc, connect function, unmount function, mounted uses
  observers: [Y.AbstractType<any>, ObserveFunc, number][] // type, observer, mounted uses
  data: [Y.AbstractType<any>, any][] // type, data
  listenType(type: Y.AbstractType<any>, listen: ObserveFunc): void
  unListenType(type: Y.AbstractType<any>): void
  unMountYDoc(yDoc: Y.Doc): void
  mountYDoc(yDoc: Y.Doc, mount: MountFunction): void
  update(type: Y.AbstractType<any>, data: any): void
}

const useYStore = create<YStore>((set, get) => {
  return {
    yDocs: [],
    observers: [],
    data: [],
    update(type, data) {
      const dataSet = get().data
      set({
        data: [...dataSet.filter(([t]) => t !== type), [type, data]],
      })
    },
    listenType(type, listen) {
      const observers = get().observers
      const match = observers.find(([observer]) => observer === type)
      if (match) {
        set({
          observers: [
            ...observers.filter((obs) => obs !== match),
            [
              match[ObserveEnum.TYPE],
              match[ObserveEnum.OBSERVE],
              match[ObserveEnum.USE_CNT] + 1,
            ],
          ],
        })
      } else {
        type.observe(listen)
        set({
          observers: [...observers, [type, listen, 1]],
        })
      }
    },
    unListenType(type) {
      const observers = get().observers
      const match = observers.find(([t]) => t === type)
      if (!match) {
        console.warn('Type ', type, " wasn't mounted")
        return
      }
      const observerCount = match[ObserveEnum.USE_CNT] - 1
      if (observerCount > 0) {
        set({
          observers: [
            ...observers.filter((obs) => obs !== match),
            [
              match[ObserveEnum.TYPE],
              match[ObserveEnum.OBSERVE],
              observerCount,
            ],
          ],
        })
      } else {
        type.unobserve(match[ObserveEnum.OBSERVE])
        set({
          observers: [...observers.filter((obs) => obs !== match)],
          data: [...get().data.filter(([t]) => t !== type)],
        })
      }
    },
    unMountYDoc(yDoc) {
      const yDocs = get().yDocs
      const match = yDocs.find(([, doc]) => doc === yDoc)
      if (!match) {
        console.warn('Can not unmount doc ', yDoc.guid, ' . Doc not found')
        return
      }
      const observerCount = match[YDocEnum.USE_CNT] - 1
      if (observerCount > 0) {
        set({
          yDocs: [
            ...yDocs.filter((yDoc) => yDoc !== match),
            [
              match[YDocEnum.GUID],
              match[YDocEnum.DOC],
              match[YDocEnum.MOUNT],
              match[YDocEnum.UN_MOUNT],
              observerCount,
            ],
          ],
        })
      } else {
        const unMount = match[YDocEnum.UN_MOUNT]
        if (unMount) unMount()
        set({ yDocs: yDocs.filter((yDoc) => yDoc !== match) })
      }
    },
    mountYDoc(yDoc, mount) {
      const yDocs = get().yDocs
      const match = yDocs.find(([name]) => name === yDoc.guid)
      if (match) {
        if (match[YDocEnum.MOUNT] !== mount) {
          console.warn(
            'A different connection function was already provided for ',
            name,
            '. This unMount function will be ignored'
          )
        }
        match[YDocEnum.USE_CNT]++
        set({
          yDocs: [...yDocs.filter(([name]) => name !== yDoc.guid), match],
        })
      } else {
        const unMount = mount(yDoc)
        set({ yDocs: [...yDocs, [yDoc.guid, yDoc, mount, unMount, 1]] })
      }
    },
  }
})

export default useYStore
