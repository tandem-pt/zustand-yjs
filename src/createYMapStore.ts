import  * as Y from 'yjs';
import create from "zustand";

export type YMapStoreState<T> = {
  __y: Y.Map<T>,
  data: T
  set(key: string, value: any):  void,
  unMount:  () => void,
} ;

function createYMapStore<T>( map: Y.Map<T>) {
    const useStore = create<YMapStoreState<T>>((set, get) => ({
      __y: map,
      set: (key, value) => get().__y.set(key, value),
      unMount: () => {get().__y.unobserve(observer)},
      data: map.toJSON()
    })
    );

    const {setState, getState} = useStore;
    const observer: (event: Y.YMapEvent<T>, transaction: Y.Transaction) => void = ({target}, _transaction) => {
      setState(() => ({data: target.toJSON()}));
    };
    getState().__y.observe(observer)
    return useStore;
  }
  

  export default createYMapStore;