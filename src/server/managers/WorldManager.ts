import { WorldObject, NPC, Enemy } from '../../shared/types';
import { GAME_CONFIG } from '../../shared/constants';
import { v4 as uuidv4 } from 'uuid';

class WorldManager {
  private objects: Map<string, WorldObject> = new Map();

  constructor() {
    this.initializeWorld();
  }

  private initializeWorld(): void {
    // Add NPCs
    this.addNPC('town_blacksmith', 'Blacksmith', 100, 100, [
      'Welcome! I forge the finest weapons!',
      'Bring me ore and I\'ll make something special.',
    ]);

    this.addNPC('town_healer', 'Healer', 200, 100, [
      'Come, let me heal your wounds!',
      'Potions and remedies for all ailments.',
    ]);

    // Add some enemy spawn points
    this.addEnemy('goblin_1', 'Goblin', 500, 500, 5);
    this.addEnemy('goblin_2', 'Goblin', 600, 400, 5);
    this.addEnemy('orc_1', 'Orc Warrior', 700, 600, 10);
  }

  addNPC(id: string, name: string, x: number, y: number, dialogue: string[]): NPC {
    const npc: NPC = {
      id,
      name,
      position: { x, y },
      type: 'npc',
      interactive: true,
      dialogue,
    };
    this.objects.set(id, npc);
    return npc;
  }

  addEnemy(
    id: string,
    name: string,
    x: number,
    y: number,
    level: number
  ): Enemy {
    const enemy: Enemy = {
      id,
      name,
      position: { x, y },
      type: 'enemy',
      interactive: true,
      level,
      health: 50 * level,
      maxHealth: 50 * level,
      experience: 100 * level,
      loot: [],
      stats: {
        strength: 5 + level * 2,
        intelligence: 3 + level,
        vitality: 4 + level * 2,
        dexterity: 5 + level,
      },
    };
    this.objects.set(id, enemy);
    return enemy;
  }

  getObject(id: string): WorldObject | undefined {
    return this.objects.get(id);
  }

  getAllObjects(): WorldObject[] {
    return Array.from(this.objects.values());
  }

  getNearbyObjects(x: number, y: number, range: number = 300): WorldObject[] {
    return this.getAllObjects().filter((obj) => {
      const distance = Math.sqrt(
        Math.pow(obj.position.x - x, 2) + Math.pow(obj.position.y - y, 2)
      );
      return distance <= range;
    });
  }

  updateObjectHealth(objectId: string, health: number): boolean {
    const obj = this.objects.get(objectId);
    if (!obj || obj.maxHealth === undefined) return false;

    obj.health = Math.max(0, Math.min(health, obj.maxHealth));
    return true;
  }

  removeObject(objectId: string): boolean {
    return this.objects.delete(objectId);
  }
}

export default WorldManager;
