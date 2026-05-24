import { Player } from '../../shared/types'

interface DashboardProps {
  currentPlayer: Player
  players: Player[]
}

export default function Dashboard({ currentPlayer, players }: DashboardProps) {
  // Filter to show other players
  const otherPlayers = players.filter((p) => p.id !== currentPlayer.id)

  return (
    <div className="dashboard">
      <h2>🌐 Server Status</h2>
      <div>
        <strong>Online Players:</strong> {players.length}
      </div>

      <div className="online-players">
        <h3 style={{ marginTop: '15px', marginBottom: '10px', fontSize: '14px' }}>Players Nearby:</h3>
        {otherPlayers.length === 0 ? (
          <div style={{ fontSize: '12px', color: '#888' }}>No players nearby</div>
        ) : (
          otherPlayers.map((player) => (
            <div key={player.id} className="player-entry">
              <div>{player.username}</div>
              <div className="level">Lvl {player.level} • HP: {player.health}/{player.maxHealth}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.6' }}>
          <p><strong>Controls:</strong></p>
          <p>WASD - Move</p>
          <p>Arrow Keys - Move</p>
        </div>
      </div>
    </div>
  )
}
