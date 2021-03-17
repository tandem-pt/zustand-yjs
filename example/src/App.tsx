import React, { useState } from 'react'
import './App.css'
import * as Y from 'yjs'
import { useYDoc, useYArray, useYMap } from 'zustand-yjs'
import { WebrtcProvider } from 'y-webrtc'
const connectMembers = (yDoc: Y.Doc) => {
  console.log('connect ', yDoc.guid)
  const provider = new WebrtcProvider(yDoc.guid, yDoc)
  return () => {
    console.log('disconnect', yDoc.guid)
    provider.destroy()
  }
}

type Member = Y.Map<string>

type EditMemberProps = { yMember: Member; handleDone: () => void }
const EditMember = ({ yMember, handleDone }: EditMemberProps) => {
  const { set, data } = useYMap<string | number, { username: string }>(yMember)
  return (
    <form
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
        onChange={({ target }) => set('username', `${target.value}`)}
      />
      <button type="submit">done</button>
    </form>
  )
}

type MemberDetailProps = {
  member: Member
  onClick: () => void
}
const MemberDetail = ({ member, onClick }: MemberDetailProps) => {
  const { get } = useYMap(member)
  return <li onClick={onClick}>{get('username')}</li>
}
const Members = () => {
  const yDoc = useYDoc('root', connectMembers)
  const [editionIndex, setEditionIndex] = useState<number>(-1)
  const { data } = useYArray<Member>(yDoc.getArray('members'))
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
                <EditMember
                  yMember={yMember}
                  handleDone={() => setEditionIndex(-1)}
                />
              </li>
            )
          return (
            <MemberDetail
              member={yMember}
              key={index}
              onClick={() => setEditionIndex(index)}
            />
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
