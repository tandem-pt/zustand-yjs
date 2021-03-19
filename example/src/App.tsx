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
function rainbow(step: number, numOfSteps = 1000) {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  let r = 0, g = 0, b = 0;
  let h = step / numOfSteps;
  let i = ~~(h * 6);
  let f = h * 6 - i;
  let q = 1 - f;
  switch(i % 6){
      case 0: r = 1; g = f; b = 0; break;
      case 1: r = q; g = 1; b = 0; break;
      case 2: r = 0; g = 1; b = f; break;
      case 3: r = 0; g = q; b = 1; break;
      case 4: r = f; g = 0; b = 1; break;
      case 5: r = 1; g = 0; b = q; break;
  }
  var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
  return (c);
}

const ID = +new Date()
type AwarenessState = {
  ID: number
  color: string
  elementIndex: number | null
}
const connectMembers = (
  yDoc: Y.Doc,
  startAwareness: StartAwarenessFunction
) => {
  console.log('connect ', yDoc.guid)
  const provider = new WebrtcProvider(yDoc.guid, yDoc)
  provider.awareness.setLocalState({
    ID,
    color: rainbow(ID % 999),
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

type AwarenessChipProps = {
  color: string;
}
const AwarenessChip = ({color}: AwarenessChipProps) => {
  return <span
  style={{
    background: color,
    border: '2px solid #313131',
    borderRadius: '50%',
    display: 'inline-block',
    margin: '0 2px',
    minHeight: '8px',
    minWidth: '8px',
  }}
  ></span>
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
          <AwarenessChip
          color={color}
            key={index} />
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
  const [, setAwarenessData] = useYAwareness<AwarenessState>(yDoc)
  useEffect(() => {
    setAwarenessData({ elementIndex: index })
    return () => {
      setAwarenessData({ elementIndex: null })
    }
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
  const [awarenessData] = useYAwareness<AwarenessState>(yDoc)
  const me = awarenessData.find(({ID: userId}) => userId === ID)

  return (
    <>
     {me && <div style={{color: me.color, textAlign: 'right'}}><AwarenessChip color={me.color} /> you are connected</div> }
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
