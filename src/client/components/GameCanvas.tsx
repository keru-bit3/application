import { useEffect, useRef, useState } from 'react'
import { Socket } from 'socket.io-client'
import { Player, GameState } from '../../shared/types'
import { GAME_CONFIG } from '../../shared/constants'

interface GameCanvasProps {
  socket: Socket
  currentPlayer: Player
  gameState: GameState
}

export default function GameCanvas({ socket, currentPlayer, gameState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cameraX, setCameraX] = useState(currentPlayer.position.x)
  const [cameraY, setCameraY] = useState(currentPlayer.position.y)
  const keysPressed = useRef<{ [key: string]: boolean }>({})

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gameLoop = () => {
      // Handle player movement
      const moveSpeed = GAME_CONFIG.PLAYER_SPEED
      let moved = false

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) {
        socket.emit('movePlayer', {
          position: {
            x: currentPlayer.position.x,
            y: Math.max(0, currentPlayer.position.y - moveSpeed),
          },
        })
        moved = true
      }
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) {
        socket.emit('movePlayer', {
          position: {
            x: currentPlayer.position.x,
            y: Math.min(GAME_CONFIG.WORLD_HEIGHT, currentPlayer.position.y + moveSpeed),
          },
        })
        moved = true
      }
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) {
        socket.emit('movePlayer', {
          position: {
            x: Math.max(0, currentPlayer.position.x - moveSpeed),
            y: currentPlayer.position.y,
          },
        })
        moved = true
      }
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) {
        socket.emit('movePlayer', {
          position: {
            x: Math.min(GAME_CONFIG.WORLD_WIDTH, currentPlayer.position.x + moveSpeed),
            y: currentPlayer.position.y,
          },
        })
        moved = true
      }

      // Update camera
      setCameraX(currentPlayer.position.x)
      setCameraY(currentPlayer.position.y)

      // Clear canvas
      ctx.fillStyle = '#0d0d0d'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw world bounds
      ctx.strokeStyle = '#444'
      ctx.lineWidth = 2
      ctx.strokeRect(
        -cameraX + canvas.width / 2 - GAME_CONFIG.WORLD_WIDTH / 2,
        -cameraY + canvas.height / 2 - GAME_CONFIG.WORLD_HEIGHT / 2,
        GAME_CONFIG.WORLD_WIDTH,
        GAME_CONFIG.WORLD_HEIGHT
      )

      // Draw current player (center)
      ctx.fillStyle = '#667eea'
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 15, 0, Math.PI * 2)
      ctx.fill()

      // Draw player username
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(currentPlayer.username, canvas.width / 2, canvas.height / 2 - 25)

      // Draw health bar above player
      const healthBarWidth = 30
      const healthPercent = currentPlayer.health / currentPlayer.maxHealth
      ctx.fillStyle = '#ff6b6b'
      ctx.fillRect(
        canvas.width / 2 - healthBarWidth / 2,
        canvas.height / 2 - 40,
        healthBarWidth * healthPercent,
        5
      )
      ctx.strokeStyle = '#fff'
      ctx.strokeRect(canvas.width / 2 - healthBarWidth / 2, canvas.height / 2 - 40, healthBarWidth, 5)

      // Draw other players
      gameState.players.forEach((player) => {
        if (player.id === currentPlayer.id) return

        const screenX = -cameraX + canvas.width / 2 + (player.position.x - currentPlayer.position.x)
        const screenY = -cameraY + canvas.height / 2 + (player.position.y - currentPlayer.position.y)

        ctx.fillStyle = '#764ba2'
        ctx.beginPath()
        ctx.arc(screenX, screenY, 12, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(player.username, screenX, screenY - 20)
      })

      // Draw grid
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)'
      ctx.lineWidth = 1
      const gridSize = 50
      const gridStartX = -cameraX + canvas.width / 2 - ((cameraX % gridSize) || 0)
      const gridStartY = -cameraY + canvas.height / 2 - ((cameraY % gridSize) || 0)

      for (let x = gridStartX; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = gridStartY; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      requestAnimationFrame(gameLoop)
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight - 60 // Subtract header height
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    gameLoop()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [currentPlayer, gameState, cameraX, cameraY, socket])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
      }}
    />
  )
}
