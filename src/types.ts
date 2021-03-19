import * as Y from 'yjs'
import * as YProtocols from 'y-protocols'

export type ObserveFunc = (arg0: any, arg1: Y.Transaction) => void
export type StopAwarenessFunction = () => void
export type StartAwarenessFunction = (
  provider: typeof YProtocols
) => StopAwarenessFunction
export type UnMountFunction = () => void | void
export type MountFunction = (
  doc: Y.Doc,
  startAwareness: StartAwarenessFunction
) => UnMountFunction

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

export type YStore = {
  yDocs: [string, Y.Doc, MountFunction, UnMountFunction, number][] // guid, doc, connect function, unmount function, mounted uses
  yAwareness: [string, typeof YProtocols.awareness, unknown[]][]
  observers: [Y.AbstractType<any>, ObserveFunc, number][] // type, observer, mounted uses
  data: [Y.AbstractType<any>, any][] // type, data
  listenType(type: Y.AbstractType<any>, listen: ObserveFunc): void
  unListenType(type: Y.AbstractType<any>): void
  unMountYDoc(yDoc: Y.Doc): void
  mountYDoc(yDoc: Y.Doc, mount: MountFunction): void
  update(type: Y.AbstractType<any>, data: any): void
}

export type AwarenessData<T> = T[]
export type AwarenessSetData<T> = (newState: Partial<T>) => void
