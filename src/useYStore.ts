import { useCallback } from 'react'
import create from 'zustand'
import { StartAwarenessFunction, YStore, YDocEnum, ObserveEnum } from './types'
import * as YProtocols from 'y-protocols'
const newStartAwareness: (
  setAwareness: (provider: typeof YProtocols, changes: unknown[]) => void
) => StartAwarenessFunction = (setAwareness) => {
  const startAwareness: StartAwarenessFunction = (provider) => {
    const awareness = provider.awareness
    const updateAwareness = () => {
      setAwareness(provider, Array.from(awareness.getStates().values()))
    }

    updateAwareness()

    awareness.on('update', updateAwareness)
    return () => {
      awareness.off('update', updateAwareness)
    }
  }
  return startAwareness
}

const useYStore = create<YStore>((set, get) => {
  return {
    yDocs: [],
    yAwareness: [],
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
      const yAwareness = get().yAwareness
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
        set({
          yDocs: yDocs.filter((yDoc) => yDoc !== match),
          yAwareness: yAwareness.filter(([yDocName]) => yDocName !== match[0]),
        })
      }
    },
    mountYDoc(yDoc, mount) {
      const yDocs = get().yDocs
      const yAwareness = get().yAwareness
      const match = yDocs.find(([name]) => name === yDoc.guid)
      if (match) {
        if (match[YDocEnum.MOUNT] !== mount) {
          console.warn(
            'A different connection function was already provided for ',
            match[YDocEnum.GUID],
            '. This unMount function will be ignored'
          )
        }
        match[YDocEnum.USE_CNT]++
        set({
          yDocs: [...yDocs.filter(([name]) => name !== yDoc.guid), match],
        })
      } else {
        const unMount = mount(
          yDoc,
          newStartAwareness((protocol, changes) => {
            set({
              yAwareness: [
                ...yAwareness,
                [yDoc.guid, protocol.awareness, changes],
              ],
            })
          })
        )
        set({ yDocs: [...yDocs, [yDoc.guid, yDoc, mount, unMount, 1]] })
      }
    },
  }
})

export default useYStore
