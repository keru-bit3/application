// Player Types
export interface Player {
  id: string;
  username: string;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stats: PlayerStats;
  position: Vector2;
  equipment: Equipment;
  inventory: InventoryItem[];
  party?: string[];
  status: 'idle' | 'moving' | 'combat' | 'dead';
  createdAt: Date;
}

export interface PlayerStats {
  strength: number;
  intelligence: number;
  vitality: number;
  dexterity: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

// Combat Types
export interface CombatAction {
  type: 'attack' | 'heal' | 'defend' | 'flee';
  damage?: number;
  healing?: number;
  accuracy: number;
}

export interface CombatState {
  inCombat: boolean;
  opponent?: string;
  currentRound: number;
  playerHealth: number;
  opponentHealth: number;
}

// Item Types
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type ItemType = 'weapon' | 'armor' | 'potion' | 'misc';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  stats?: Partial<PlayerStats>;
  consumable?: boolean;
  maxStack?: number;
}

export interface InventoryItem {
  item: Item;
  quantity: number;
  equipped?: boolean;
}

export interface Equipment {
  weapon?: Item;
  armor?: Item;
  accessory?: Item;
}

// World Types
export interface WorldObject {
  id: string;
  name: string;
  position: Vector2;
  type: 'npc' | 'enemy' | 'object' | 'spawner';
  interactive: boolean;
  health?: number;
  maxHealth?: number;
}

export interface NPC extends WorldObject {
  type: 'npc';
  dialogue: string[];
  quests?: string[];
  shop?: Item[];
}

export interface Enemy extends WorldObject {
  type: 'enemy';
  level: number;
  experience: number;
  loot: Item[];
  stats: PlayerStats;
}

// Server Message Types
export interface ServerMessage {
  event: string;
  data: any;
  timestamp: number;
}

export interface ClientMessage {
  event: string;
  data: any;
}

// Game State
export interface GameState {
  currentPlayer?: Player;
  players: Map<string, Player>;
  worldObjects: Map<string, WorldObject>;
  combatState?: CombatState;
  isConnected: boolean;
}
