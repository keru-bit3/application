import { useState } from 'react'

interface CharacterCreationProps {
  onCreateCharacter: (username: string) => void
}

export default function CharacterCreation({ onCreateCharacter }: CharacterCreationProps) {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    onCreateCharacter(username)
  }

  return (
    <div className="creation-screen">
      <form className="creation-form" onSubmit={handleSubmit}>
        <h1>Create Your Character</h1>

        <div className="form-group">
          <label htmlFor="username">Character Name</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              setError('')
            }}
            placeholder="Enter your character name"
            autoFocus
          />
        </div>

        {error && <div style={{ color: '#ff6b6b', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}

        <button type="submit" className="btn btn-primary">
          Create Character
        </button>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
          <p>Welcome to the MMO RPG world!</p>
          <p>Choose your name and begin your adventure.</p>
        </div>
      </form>
    </div>
  )
}
