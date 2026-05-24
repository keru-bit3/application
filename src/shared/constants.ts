export const GAME_CONFIG = {
  WORLD_WIDTH: 1000,
  WORLD_HEIGHT: 1000,
  MAX_PLAYERS: 100,
  TICK_RATE: 60,
  PLAYER_SPEED: 5,
  BASE_EXPERIENCE_PER_LEVEL: 100,
};

export const PLAYER_STATS = {
  BASE_HEALTH: 100,
  BASE_MANA: 50,
  BASE_STRENGTH: 10,
  BASE_INTELLIGENCE: 10,
  BASE_VITALITY: 10,
  BASE_DEXTERITY: 10,
};

export const COMBAT_CONFIG = {
  BASE_ATTACK_DAMAGE: 10,
  BASE_HEAL_AMOUNT: 20,
  DEFEND_REDUCTION: 0.5,
  FLEE_SUCCESS_RATE: 0.6,
  HEAL_MANA_COST: 20,
  CRITICAL_CHANCE: 0.15,
  CRITICAL_MULTIPLIER: 1.5,
};

export const ITEM_RARITY_COLORS = {
  common: '#808080',
  uncommon: '#00FF00',
  rare: '#0066FF',
  epic: '#9933FF',
  legendary: '#FFAA00',
};

export const ITEM_RARITY_STATS = {
  common: 1,
  uncommon: 1.25,
  rare: 1.5,
  epic: 1.75,
  legendary: 2,
};
