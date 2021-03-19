
import React, {useCallback} from 'react';
import useYStore from './useYStore';
import * as Y from 'yjs'
import {AwarenessData,
    AwarenessSetData} from './types'

const useYAwareness = <T extends Record<string, unknown>>(yDoc: Y.Doc): [AwarenessData<T>, AwarenessSetData<T>] => {
    const matches = useYStore(useCallback(
        (state) => state.yAwareness.filter(([guid]) => guid === yDoc.guid), [yDoc]
    ));
    if(matches.length === 0) return [[], () => { console.error('Awareness not registered. Use startAwareness method from your YDoc connect function.')}];
    const [_docGuid, awareness, changes] = matches[0];
    return [changes as T[], (newState: Partial<T>) => { 
        const previousState = awareness.getLocalState() as T;
        awareness.setLocalState({...previousState, ...newState})
    }] ;
}

export default useYAwareness;