import React, { useState } from 'react'
import './App.css'
import useOrganization from './useOrganization'
import useMembers from './useMembers'
const Members = () => {
  const members = useMembers((state) => state?.data)
  return (
    <>
      <ul>
        {members.map((member, index) => (
          <li key={index}>
            {'<'}
            {member.username}
            {'>'}
            {member.email}
          </li>
        ))}
      </ul>
      <pre>{JSON.stringify(members)}</pre>
    </>
  )
}
const AddRow = () => {
  const push = useMembers((state) => state?.push)
  const [newEmail, setNewEmail] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault && evt.preventDefault()
    push([{ email: newEmail, username }])
    setNewEmail('')
    setUsername('')
    setTimeout(() => setMessage(''), 1900)
    return false
  }
  return (
    <div>
      <fieldset>
        <legend>Add a member</legend>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            onChange={({ target }) => setNewEmail('' + target.value)}
            value={newEmail}
          />
          <label>Username</label>
          <input
            type="text"
            onChange={({ target }) => setUsername('' + target.value)}
            value={username}
          />
          <br />
          <button type="submit" disabled={newEmail.length === 0}>
            Add member
          </button>
          {message && (
            <div style={{ border: '1px solid green', padding: 8, margin: 8 }}>
              {message}
            </div>
          )}
        </form>
      </fieldset>
    </div>
  )
}
let nameRender = 0
const Name = () => {
  const name = useOrganization((state) => state?.data.name)
  const set = useOrganization((state) => state?.set)
  return (
    <div>
      <label>Last name </label>
      <input
        value={name}
        onChange={({ target }) => set('name', '' + target.value)}
      />{' '}
      <pre style={{ display: 'inline' }}>{nameRender++} re-render</pre>{' '}
    </div>
  )
}

let firstnameRender = 0
const FirstName = () => {
  const name = useOrganization((state) => state?.data.firstName)
  const set = useOrganization((state) => state?.set)

  return (
    <div>
      <label>First name </label>
      <input
        value={name}
        onChange={({ target }) => set('firstName', '' + target.value)}
      />
      <pre style={{ display: 'inline' }}>{firstnameRender++} re-render</pre>{' '}
    </div>
  )
}
let fullNameRender = 0
const FullName = () => {
  const name = useOrganization((state) => state?.data.name)
  const firstName = useOrganization((state) => state?.data.firstName)

  return (
    <div>
      {name} {firstName} <pre>{fullNameRender++} re-render</pre> 
    </div>
  )
}
let AppRender = 0

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <strong>
          Example{' '}
          <pre style={{ display: 'inline' }}>{AppRender++} re-render</pre>
        </strong>
      </header>
      <fieldset>
        <legend>Y.Map manipulation</legend>
        <Name />
        <FirstName />
        <p>
          Result:
          <FullName />
        </p>
      </fieldset>
      <fieldset>
        <legend>Y.Array manipulation</legend>
        <AddRow />
        <Members />
      </fieldset>
    </div>
  )
}

export default App
