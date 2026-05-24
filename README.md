# MMO RPG Game - Base Application

A multiplayer MMO RPG game application with real-time gameplay, character progression, and dungeon exploration.

## Features

✅ **Real-time Multiplayer** - WebSocket-based player synchronization  
✅ **Character System** - Create characters with customizable stats  
✅ **Combat System** - Turn-based battles with multiple abilities  
✅ **World Exploration** - Navigate an explorable game world  
✅ **NPC Interactions** - Quest givers and merchants  
✅ **Inventory System** - Equipment and item management  
✅ **Leveling & Progression** - Experience-based character growth  
✅ **Party System** - Group up with other players  

## Tech Stack

### Backend
- **Node.js** with Express
- **Socket.io** for real-time communication
- **MongoDB** for data persistence
- **TypeScript** for type safety

### Frontend
- **React** for UI
- **HTML5 Canvas** for game rendering
- **Socket.io Client** for real-time updates
- **TypeScript** for type safety

## Installation

### Prerequisites
- Node.js 16+
- MongoDB running locally or connection string
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/keru-bit3/application.git
   cd application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your MongoDB URI and preferences

4. **Start development servers**
   ```bash
   npm run dev
   ```
   - Server runs on http://localhost:3000
   - Client runs on http://localhost:5173

## Game Systems

### Character Stats
- **Health (HP)** - Life points
- **Mana** - Magic resource
- **Strength** - Physical damage
- **Intelligence** - Magic damage
- **Vitality** - Defense
- **Dexterity** - Attack speed

### Combat Actions
- **Attack** - Basic physical attack
- **Heal** - Restore health using mana
- **Defend** - Reduce incoming damage
- **Flee** - Escape from combat

### Items & Equipment
- **Weapons** - Increase physical damage
- **Armor** - Increase defense
- **Potions** - Consumable items
- **Rarity Levels** - Common, Uncommon, Rare, Epic, Legendary

### World Interactions
- **NPCs** - Talk to characters for quests and information
- **Objects** - Chests, doors, and environmental interactions
- **Spawning Zones** - Specific areas where monsters appear

## Project Structure

```
src/
├── client/
│   ├── components/
│   │   ├── GameCanvas.tsx
│   │   ├── CharacterCreation.tsx
│   │   ├── Dashboard.tsx
│   │   └── UI/
│   ├── hooks/
│   │   ├── useGameSocket.ts
│   │   └── useGameState.ts
│   ├── utils/
│   │   ├── renderer.ts
│   │   └── camera.ts
│   └── App.tsx
├── server/
│   ├── managers/
│   │   ├── PlayerManager.ts
│   │   ├── WorldManager.ts
│   │   ├── CombatManager.ts
│   │   └── ItemManager.ts
│   ├── models/
│   │   ├── Player.ts
│   │   ├── NPC.ts
│   │   ├── Item.ts
│   │   └── World.ts
│   ├── handlers/
│   │   ├── playerHandlers.ts
│   │   ├── combatHandlers.ts
│   │   └── worldHandlers.ts
│   └── index.ts
└── shared/
    ├── types.ts
    ├── constants.ts
    └── utils.ts
```

## API Events

### Server to Client
- `playerJoined` - New player joined the game
- `playerMoved` - Player position updated
- `combatStarted` - Battle initiated
- `combatAction` - Combat action performed
- `playerLeveledUp` - Character leveled up
- `inventoryUpdated` - Inventory changed

### Client to Server
- `joinGame` - Connect to the game
- `movePlayer` - Send player movement
- `attackEnemy` - Initiate combat
- `useItem` - Use an item from inventory
- `equipItem` - Equip equipment
- `interactNPC` - Talk to NPC

## Development

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

## Future Features

- [ ] Quest System with tracking
- [ ] Guild/Clan system
- [ ] Dungeon instances
- [ ] PvP arenas and rankings
- [ ] Trading system
- [ ] Seasonal content
- [ ] Mobile support
- [ ] Voice chat integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for your projects!

## Support

For issues and questions, please open a GitHub issue or contact the maintainers.

---

**Happy Gaming!** 🎮✨
