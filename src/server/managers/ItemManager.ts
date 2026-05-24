import { Item, ItemRarity, ItemType, InventoryItem } from '../../shared/types';
import { v4 as uuidv4 } from 'uuid';
import { ITEM_RARITY_STATS } from '../../shared/constants';

class ItemManager {
  private items: Map<string, Item> = new Map();

  constructor() {
    this.initializeItems();
  }

  private initializeItems(): void {
    // Weapons
    this.createItem('iron_sword', 'Iron Sword', 'A sturdy iron blade', 'weapon', 'common', {
      strength: 5,
    });
    this.createItem('steel_sword', 'Steel Sword', 'A refined steel blade', 'weapon', 'uncommon', {
      strength: 8,
    });
    this.createItem(
      'legendary_sword',
      'Excalibur',
      'A legendary blade of immense power',
      'weapon',
      'legendary',
      { strength: 20, dexterity: 5 }
    );

    // Armor
    this.createItem('leather_armor', 'Leather Armor', 'Light leather protection', 'armor', 'common', {
      vitality: 3,
    });
    this.createItem('iron_armor', 'Iron Armor', 'Heavy iron plating', 'armor', 'uncommon', {
      vitality: 6,
    });

    // Potions
    this.createItem('health_potion', 'Health Potion', 'Restores 50 health', 'potion', 'common', undefined, true, 5);
    this.createItem('mana_potion', 'Mana Potion', 'Restores 30 mana', 'potion', 'common', undefined, true, 5);
  }

  createItem(
    id: string,
    name: string,
    description: string,
    type: ItemType,
    rarity: ItemRarity,
    stats?: any,
    consumable: boolean = false,
    maxStack: number = 1
  ): Item {
    const item: Item = {
      id,
      name,
      description,
      type,
      rarity,
      stats,
      consumable,
      maxStack,
    };

    this.items.set(id, item);
    return item;
  }

  getItem(id: string): Item | undefined {
    return this.items.get(id);
  }

  getAllItems(): Item[] {
    return Array.from(this.items.values());
  }

  getItemsByType(type: ItemType): Item[] {
    return this.getAllItems().filter((item) => item.type === type);
  }

  getItemsByRarity(rarity: ItemRarity): Item[] {
    return this.getAllItems().filter((item) => item.rarity === rarity);
  }

  generateRandomItem(minRarity: ItemRarity = 'common'): Item | undefined {
    const rarities: ItemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const raritiesAbove = rarities.slice(rarities.indexOf(minRarity));
    const randomRarity = raritiesAbove[Math.floor(Math.random() * raritiesAbove.length)];

    const itemsWithRarity = this.getItemsByRarity(randomRarity);
    return itemsWithRarity[Math.floor(Math.random() * itemsWithRarity.length)];
  }
}

export default ItemManager;
