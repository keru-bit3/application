import { CombatState, CombatAction, Player } from '../../shared/types';
import { COMBAT_CONFIG } from '../../shared/constants';

class CombatManager {
  private combats: Map<string, CombatState> = new Map();
  private playerCombat: Map<string, string> = new Map(); // playerId -> combatId

  initiateCombat(playerId1: string, playerId2: string): CombatState {
    const combatId = `${playerId1}_${playerId2}_${Date.now()}`;

    const combat: CombatState = {
      inCombat: true,
      opponent: playerId2,
      currentRound: 0,
      playerHealth: 100,
      opponentHealth: 100,
    };

    this.combats.set(combatId, combat);
    this.playerCombat.set(playerId1, combatId);
    this.playerCombat.set(playerId2, combatId);

    return combat;
  }

  executeAction(
    playerId: string,
    action: CombatAction,
    playerHealth: number,
    opponentHealth: number
  ): {
    damage: number;
    success: boolean;
  } {
    let result = { damage: 0, success: false };

    const accuracy = Math.random();

    if (accuracy > 0.1) {
      // 90% hit chance baseline
      result.success = true;

      switch (action.type) {
        case 'attack':
          result.damage = this.calculateDamage(action.damage || 10);
          break;

        case 'heal':
          result.damage = -(action.healing || COMBAT_CONFIG.BASE_HEAL_AMOUNT);
          break;

        case 'defend':
          result.damage = 0; // Defense is handled separately
          break;

        case 'flee':
          result.success = Math.random() < COMBAT_CONFIG.FLEE_SUCCESS_RATE;
          break;
      }
    }

    return result;
  }

  private calculateDamage(baseDamage: number): number {
    const variance = 0.2; // 20% damage variance
    const randomVariance = baseDamage * (1 - variance + Math.random() * variance * 2);

    // Critical chance
    const isCritical = Math.random() < COMBAT_CONFIG.CRITICAL_CHANCE;
    const multiplier = isCritical ? COMBAT_CONFIG.CRITICAL_MULTIPLIER : 1;

    return Math.round(randomVariance * multiplier);
  }

  endCombat(playerId: string): boolean {
    const combatId = this.playerCombat.get(playerId);
    if (!combatId) return false;

    this.playerCombat.delete(playerId);
    this.combats.delete(combatId);

    return true;
  }

  getPlayerCombat(playerId: string): CombatState | undefined {
    const combatId = this.playerCombat.get(playerId);
    if (!combatId) return undefined;
    return this.combats.get(combatId);
  }

  isPlayerInCombat(playerId: string): boolean {
    return this.playerCombat.has(playerId);
  }
}

export default CombatManager;
