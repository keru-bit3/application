import { Server, Socket } from 'socket.io';
import WorldManager from '../managers/WorldManager';
import PlayerManager from '../managers/PlayerManager';

export function handleInteractObject(
  socket: Socket,
  io: Server,
  worldManager: WorldManager,
  playerManager: PlayerManager,
  data: { objectId: string }
) {
  const player = playerManager.getPlayer(socket.id);
  const worldObject = worldManager.getObject(data.objectId);

  if (!player || !worldObject) {
    socket.emit('error', { message: 'Cannot interact with object' });
    return;
  }

  if (!worldObject.interactive) {
    socket.emit('error', { message: 'This object cannot be interacted with' });
    return;
  }

  // Handle different object types
  switch (worldObject.type) {
    case 'npc':
      socket.emit('npcInteraction', {
        npc: worldObject,
        message: 'NPC interaction available',
      });
      break;

    case 'enemy':
      io.emit('enemyEncounter', {
        playerId: socket.id,
        enemy: worldObject,
      });
      break;

    case 'object':
      socket.emit('objectInteraction', {
        object: worldObject,
      });
      break;
  }

  console.log(`🔗 Player ${player.username} interacted with ${worldObject.name}`);
}

export function handleGetWorldObjects(
  socket: Socket,
  worldManager: WorldManager
) {
  const objects = worldManager.getAllObjects();
  socket.emit('worldObjects', {
    objects,
    count: objects.length,
  });
}
