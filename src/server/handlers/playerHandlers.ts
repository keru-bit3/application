import { Server, Socket } from 'socket.io';
import PlayerManager from '../managers/PlayerManager';
import { Vector2 } from '../../shared/types';

export function handleJoinGame(
  socket: Socket,
  io: Server,
  playerManager: PlayerManager,
  data: { username: string }
) {
  const player = playerManager.createPlayer(socket.id, data.username);

  socket.emit('playerJoined', {
    success: true,
    player,
    message: `Welcome to MMO RPG, ${data.username}!`,
  });

  io.emit('newPlayerJoined', {
    player,
    onlineCount: playerManager.getAllPlayers().length,
  });

  console.log(`📝 Player created: ${data.username} (${socket.id})`);
}

export function handleMovePlayer(
  socket: Socket,
  io: Server,
  playerManager: PlayerManager,
  data: { position: Vector2 }
) {
  const success = playerManager.updatePlayerPosition(socket.id, data.position);

  if (success) {
    const player = playerManager.getPlayer(socket.id);
    io.emit('playerMoved', {
      playerId: socket.id,
      position: player?.position,
    });
  }
}

export function handleUpdateStats(
  socket: Socket,
  io: Server,
  playerManager: PlayerManager,
  data: any
) {
  const player = playerManager.getPlayer(socket.id);
  if (!player) return;

  if (data.health !== undefined) {
    playerManager.updatePlayerHealth(socket.id, data.health);
  }

  if (data.mana !== undefined) {
    playerManager.updatePlayerMana(socket.id, data.mana);
  }

  if (data.experience !== undefined) {
    playerManager.addExperience(socket.id, data.experience);
  }

  socket.emit('statsUpdated', {
    health: player.health,
    mana: player.mana,
    experience: player.experience,
    level: player.level,
  });
}
