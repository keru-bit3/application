import { Server, Socket } from 'socket.io';
import CombatManager from '../managers/CombatManager';
import PlayerManager from '../managers/PlayerManager';
import { CombatAction } from '../../shared/types';

export function handleInitiateAttack(
  socket: Socket,
  io: Server,
  combatManager: CombatManager,
  playerManager: PlayerManager,
  data: { targetId: string }
) {
  const attacker = playerManager.getPlayer(socket.id);
  const target = playerManager.getPlayer(data.targetId);

  if (!attacker || !target) {
    socket.emit('error', { message: 'Invalid target' });
    return;
  }

  const combat = combatManager.initiateCombat(socket.id, data.targetId);

  io.emit('combatStarted', {
    playerId: socket.id,
    targetId: data.targetId,
    combat,
  });

  console.log(`⚔️ Combat started: ${attacker.username} vs ${target.username}`);
}

export function handleCombatAction(
  socket: Socket,
  io: Server,
  combatManager: CombatManager,
  playerManager: PlayerManager,
  data: { action: CombatAction; targetId: string }
) {
  const attacker = playerManager.getPlayer(socket.id);
  const target = playerManager.getPlayer(data.targetId);

  if (!attacker || !target) return;

  const result = combatManager.executeAction(
    socket.id,
    data.action,
    attacker.health,
    target.health
  );

  // Apply damage
  if (result.damage > 0) {
    playerManager.updatePlayerHealth(data.targetId, target.health - result.damage);
  } else if (result.damage < 0) {
    playerManager.updatePlayerHealth(socket.id, attacker.health + Math.abs(result.damage));
  }

  io.emit('combatAction', {
    attacker: socket.id,
    target: data.targetId,
    action: data.action.type,
    damage: result.damage,
    success: result.success,
  });

  // Check if target is defeated
  if (target.health <= 0) {
    playerManager.addExperience(socket.id, 100);
    combatManager.endCombat(socket.id);
    combatManager.endCombat(data.targetId);

    io.emit('combatEnded', {
      winner: socket.id,
      loser: data.targetId,
    });
  }
}
