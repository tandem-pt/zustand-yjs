import * as Y from 'yjs';
import create from "zustand";

 export type YArrayStoreState<T> = {
  __y: Y.Array<T>,
  data: T[],
  push(value: any):  void,
  insert(number: number, value: any):  void,
  slice(number: number, value: any):  void,
  unMount:  () => void,
} ;

function createYArrayStore<T>( arr: Y.Array<T>) {

    const useStore = create<YArrayStoreState<T>>((set, get) => ({
      __y: arr,
      push: (value: T[]) => {
        get().__y.push(value)
      },
      insert: (index: number, value: T[]) => get().__y.insert(index, value),
      slice: (index: number, value: number) => get().__y.slice(index, value),
      unMount: () => {
        get().__y.unobserve(arrayObserver);
      },
      data: arr.toArray()
    })
    );

    const {setState, getState} = useStore;
    const arrayObserver: (event: Y.YArrayEvent<T>, transaction: Y.Transaction) => void = (event, _transaction) => {
      const target = event.target as Y.Array<T>;
      setState(() => ({data: target.toArray()}));
    };
    getState().__y.observe(arrayObserver);
    arr.observe(arrayObserver);
    return useStore;
  }
  

  export default createYArrayStore;