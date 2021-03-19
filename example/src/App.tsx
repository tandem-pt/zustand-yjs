import React, { useEffect, useMemo, useState } from 'react'
import './App.css'
import * as Y from 'yjs'
import {
  useYDoc,
  useYArray,
  useYMap,
  StartAwarenessFunction,
  useYAwareness,
} from 'zustand-yjs'
import { WebrtcProvider } from 'y-webrtc'
const colors = [
  '#DAF7A6',
  '#FF5733',
  '#8E44AD',
  '#5499C7',
  '#D35400',
  '#1C2833',
  '#943126',
  '#943126',
]

const ID = +new Date()
type AwarenessState = {
  ID: number
  color: string
  elementIndex: number
}
const connectMembers = (
  yDoc: Y.Doc,
  startAwareness: StartAwarenessFunction
) => {
  console.log('connect ', yDoc.guid)
  const provider = new WebrtcProvider(yDoc.guid, yDoc)
  provider.awareness.setLocalState({
    ID,
    color: colors[ID % (colors.length - 1)],
    elementIndex: null,
  })
  const stopAwareness = startAwareness(provider)
  return () => {
    console.log('disconnect', yDoc.guid)
    stopAwareness()
    provider.destroy()
  }
}

type Member = Y.Map<string>
type AwarenessProps = {
  yDoc: Y.Doc
  elementIndex?: number
}
const Awareness = ({ yDoc, elementIndex }: AwarenessProps) => {
  const [awarenessData] = useYAwareness<AwarenessState>(yDoc)
  const colors = useMemo<string[]>(() => {
    if (elementIndex !== null) {
      return awarenessData
        .filter((state) => state?.ID && state.elementIndex === elementIndex)
        .map(({ color }) => color)
    }
    return awarenessData.filter(({ ID }) => !!ID).map(({ color }) => color)
  }, [awarenessData, elementIndex])

  return (
    <>
      {colors.map((color, index) => {
        return (
          <span
            style={{
              background: color,
              border: '2px solid #313131',
              borderRadius: '50%',
              display: 'inline-block',
              margin: '0 2px',
              minHeight: '8px',
              minWidth: '8px',
            }}
            key={index}></span>
        )
      })}
    </>
  )
}
type EditMemberProps = {
  yDoc: Y.Doc
  yMember: Member
  handleDone: () => void
  index: number
}
const EditMember = ({ yDoc, yMember, index, handleDone }: EditMemberProps) => {
  const { set, data } = useYMap<string | number, { username: string }>(yMember)
  const [_awarenessData, setAwarenessData] = useYAwareness<AwarenessState>(yDoc)
  useEffect(() => {
    setAwarenessData({ elementIndex: index })
  }, [index, setAwarenessData])
  return (
    <form
      style={{ display: 'inline-block' }}
      onSubmit={(e) => {
        e.preventDefault()
        handleDone()
      }}>
      <input
        type="text"
        id="Member"
        name="Member"
        autoFocus
        value={data.username}
        style={{ width: 230, display: 'inline-block', marginRight: 8 }}
        onChange={({ target }) => {
          set('username', `${target.value}`)
        }}
      />
      <button type="submit">done</button>
    </form>
  )
}

type MemberDetailProps = React.PropsWithChildren<{
  member: Member
  onClick: () => void
}>
const MemberDetail = ({ member, onClick, children }: MemberDetailProps) => {
  const { get } = useYMap(member)
  return (
    <li onClick={onClick}>
      {children}
      {get('username')}
    </li>
  )
}
const Members = () => {
  const yDoc = useYDoc('root', connectMembers)
  const [editionIndex, setEditionIndex] = useState<number>(-1)
  const { data, delete: deleteItem } = useYArray<Member>(
    yDoc.getArray('members')
  )
  return (
    <>
      <code>
        <pre>{JSON.stringify({ data }, undefined, 2)}</pre>
      </code>
      <ul>
        {data.map((yMember: Member, index: number) => {
          if (editionIndex === index)
            return (
              <li key={index}>
                <Awareness yDoc={yDoc} elementIndex={index} />
                <EditMember
                  yDoc={yDoc}
                  yMember={yMember}
                  index={index}
                  handleDone={() => {
                    if (yMember.get('username') === '') {
                      deleteItem(editionIndex)
                    }
                    setEditionIndex(-1)
                  }}
                />
              </li>
            )
          return (
            <div key={index}>
              <MemberDetail
                member={yMember}
                onClick={() => setEditionIndex(index)}>
                <Awareness yDoc={yDoc} elementIndex={index} />
              </MemberDetail>
            </div>
          )
        })}
      </ul>
      {data.length > 0 && (
        <small>
          <em>Click on the member you want to edit</em>
        </small>
      )}
    </>
  )
}

const AddMember = () => {
  const yDoc = useYDoc('root', connectMembers)
  const { push, data } = useYArray<Member>(yDoc.getArray('members'))

  return (
    <button
      className="primary"
      onClick={() => {
        const newMember = new Y.Map<string>()
        console.log('JohnDoe #' + data.length)
        newMember.set('username', 'JohnDoe #' + data.length)
        push([newMember])
      }}>
      New Member
    </button>
  )
}

function App() {
  return (
    <div className="App">
      <AddMember />
      <Members />
    </div>
  )
}

export default App
