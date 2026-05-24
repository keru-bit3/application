import { Player, PlayerStats, Vector2 } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';
import { PLAYER_STATS, GAME_CONFIG } from '../../shared/constants';

class PlayerManager {
  private players: Map<string, Player> = new Map();

  createPlayer(
    socketId: string,
    username: string,
    stats?: Partial<PlayerStats>
  ): Player {
    const baseStats: PlayerStats = {
      strength: PLAYER_STATS.BASE_STRENGTH,
      intelligence: PLAYER_STATS.BASE_INTELLIGENCE,
      vitality: PLAYER_STATS.BASE_VITALITY,
      dexterity: PLAYER_STATS.BASE_DEXTERITY,
      ...stats,
    };

    const player: Player = {
      id: socketId,
      username,
      level: 1,
      experience: 0,
      health: PLAYER_STATS.BASE_HEALTH,
      maxHealth: PLAYER_STATS.BASE_HEALTH,
      mana: PLAYER_STATS.BASE_MANA,
      maxMana: PLAYER_STATS.BASE_MANA,
      stats: baseStats,
      position: {
        x: Math.random() * GAME_CONFIG.WORLD_WIDTH,
        y: Math.random() * GAME_CONFIG.WORLD_HEIGHT,
      },
      equipment: {},
      inventory: [],
      status: 'idle',
      createdAt: new Date(),
    };

    this.players.set(socketId, player);
    return player;
  }

  getPlayer(socketId: string): Player | undefined {
    return this.players.get(socketId);
  }

  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  updatePlayerPosition(socketId: string, position: Vector2): boolean {
    const player = this.players.get(socketId);
    if (!player) return false;

    // Clamp position to world bounds
    player.position.x = Math.max(
      0,
      Math.min(position.x, GAME_CONFIG.WORLD_WIDTH)
    );
    player.position.y = Math.max(
      0,
      Math.min(position.y, GAME_CONFIG.WORLD_HEIGHT)
    );

    return true;
  }

  updatePlayerHealth(socketId: string, health: number): boolean {
    const player = this.players.get(socketId);
    if (!player) return false;

    player.health = Math.max(0, Math.min(health, player.maxHealth));
    return true;
  }

  updatePlayerMana(socketId: string, mana: number): boolean {
    const player = this.players.get(socketId);
    if (!player) return false;

    player.mana = Math.max(0, Math.min(mana, player.maxMana));
    return true;
  }

  addExperience(socketId: string, amount: number): boolean {
    const player = this.players.get(socketId);
    if (!player) return false;

    player.experience += amount;

    // Check for level up
    const experienceRequired = player.level * 100;
    if (player.experience >= experienceRequired) {
      this.levelUp(socketId);
    }

    return true;
  }

  levelUp(socketId: string): boolean {
    const player = this.players.get(socketId);
    if (!player) return false;

    player.level++;
    player.experience = 0;

    // Increase stats
    player.stats.strength += 2;
    player.stats.intelligence += 2;
    player.stats.vitality += 2;
    player.stats.dexterity += 2;

    // Increase health and mana
    player.maxHealth += 20;
    player.maxMana += 10;
    player.health = player.maxHealth;
    player.mana = player.maxMana;

    return true;
  }

  removePlayer(socketId: string): boolean {
    return this.players.delete(socketId);
  }

  getNearbyPlayers(socketId: string, range: number = 300): Player[] {
    const player = this.players.get(socketId);
    if (!player) return [];

    return this.getAllPlayers().filter((p) => {
      if (p.id === socketId) return false;
      const distance = Math.sqrt(
        Math.pow(p.position.x - player.position.x, 2) +
          Math.pow(p.position.y - player.position.y, 2)
      );
      return distance <= range;
    });
  }
}

export default PlayerManager;
