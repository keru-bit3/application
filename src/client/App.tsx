import { useState, useEffect } from 'react'
import { Socket, io } from 'socket.io-client'
import CharacterCreation from './components/CharacterCreation'
import GameCanvas from './components/GameCanvas'
import Dashboard from './components/Dashboard'
import { Player, GameState } from '../shared/types'

function App() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    currentPlayer: undefined,
    players: new Map(),
    worldObjects: new Map(),
    isConnected: false,
  })

  // Initialize Socket.io connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
    })

    newSocket.on('playerJoined', (data) => {
      console.log('Player joined:', data.player)
      setCurrentPlayer(data.player)
      setGameStarted(true)
      setGameState((prev) => ({
        ...prev,
        currentPlayer: data.player,
      }))
    })

    newSocket.on('newPlayerJoined', (data) => {
      console.log('New player joined:', data.player.username)
      setGameState((prev) => {
        const newPlayers = new Map(prev.players)
        newPlayers.set(data.player.id, data.player)
        return {
          ...prev,
          players: newPlayers,
        }
      })
    })

    newSocket.on('gameState', (data) => {
      // Update game state with latest player positions
      setGameState((prev) => {
        const newPlayers = new Map<string, Player>()
        data.players.forEach((player: Player) => {
          newPlayers.set(player.id, player)
        })
        return {
          ...prev,
          players: newPlayers,
        }
      })
    })

    newSocket.on('playerMoved', (data) => {
      setGameState((prev) => {
        const player = prev.players.get(data.playerId)
        if (player) {
          player.position = data.position
        }
        return { ...prev }
      })
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const handleCreateCharacter = (username: string) => {
    if (socket && isConnected) {
      socket.emit('joinGame', { username })
    }
  }

  if (!isConnected) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a1a', color: '#fff' }}>
        <div>Connecting to server...</div>
      </div>
    )
  }

  if (!gameStarted || !currentPlayer) {
    return <CharacterCreation onCreateCharacter={handleCreateCharacter} />
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div>
          <h1>⚔️ MMO RPG Game</h1>
        </div>
        <div className="player-info">
          <div className="stat">
            <span>Player: {currentPlayer.username}</span>
          </div>
          <div className="stat">
            <span>Level: {currentPlayer.level}</span>
          </div>
          <div className="stat">
            <span>HP:</span>
            <div className="stat-bar">
              <div
                className="stat-bar-fill health-bar-fill"
                style={{
                  width: `${(currentPlayer.health / currentPlayer.maxHealth) * 100}%`,
                }}
              />
            </div>
            <span>{currentPlayer.health}/{currentPlayer.maxHealth}</span>
          </div>
          <div className="stat">
            <span>Mana:</span>
            <div className="stat-bar">
              <div
                className="stat-bar-fill mana-bar-fill"
                style={{
                  width: `${(currentPlayer.mana / currentPlayer.maxMana) * 100}%`,
                }}
              />
            </div>
            <span>{currentPlayer.mana}/{currentPlayer.maxMana}</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {socket && <GameCanvas socket={socket} currentPlayer={currentPlayer} gameState={gameState} />}
        <Dashboard currentPlayer={currentPlayer} players={Array.from(gameState.players.values())} />
      </div>
    </div>
  )
}

export default App
