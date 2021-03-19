type AwarenessCallbackChanges = {
  added: number[]
  updated: number[]
  removed: number[]
}

type AwarenessCallback = (
  changed: AwarenessCallbackChanges,
  origin: unknown
) => void

type AwarenessProtocol = {
  clientID: number
  getLocalState: () => Record<string, unknown> | null
  setLocalState: (localState: Record<string, unknown> | null) => void
  setLocalStateField: (field: string, value: unknown) => void
  getStates: () => Map<number, Record<string, unknown>>
  on(eventName: string, callback: AwarenessCallback): void
  off(eventName: string, callback: AwarenessCallback): void
  once(eventName: string, callback: AwarenessCallback): void
}

declare module 'y-protocols' {
  export const awareness: AwarenessProtocol
}
