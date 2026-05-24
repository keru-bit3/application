import express from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import PlayerManager from './managers/PlayerManager';
import WorldManager from './managers/WorldManager';
import CombatManager from './managers/CombatManager';
import ItemManager from './managers/ItemManager';

import * as playerHandlers from './handlers/playerHandlers';
import * as combatHandlers from './handlers/combatHandlers';
import * as worldHandlers from './handlers/worldHandlers';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3000;

// Managers
const playerManager = new PlayerManager();
const worldManager = new WorldManager();
const combatManager = new CombatManager();
const itemManager = new ItemManager();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.get('/api/players', (req, res) => {
  const players = playerManager.getAllPlayers();
  res.json(players);
});

// Socket.io Event Handlers
io.on('connection', (socket) => {
  console.log(`\n✅ Player connected: ${socket.id}`);

  // Player Events
  socket.on('joinGame', (data) =>
    playerHandlers.handleJoinGame(socket, io, playerManager, data)
  );
  socket.on('movePlayer', (data) =>
    playerHandlers.handleMovePlayer(socket, io, playerManager, data)
  );
  socket.on('updateStats', (data) =>
    playerHandlers.handleUpdateStats(socket, io, playerManager, data)
  );

  // Combat Events
  socket.on('initiateAttack', (data) =>
    combatHandlers.handleInitiateAttack(socket, io, combatManager, playerManager, data)
  );
  socket.on('combatAction', (data) =>
    combatHandlers.handleCombatAction(socket, io, combatManager, playerManager, data)
  );

  // World Events
  socket.on('interactObject', (data) =>
    worldHandlers.handleInteractObject(socket, io, worldManager, playerManager, data)
  );
  socket.on('getWorldObjects', () =>
    worldHandlers.handleGetWorldObjects(socket, worldManager)
  );

  // Disconnection
  socket.on('disconnect', () => {
    console.log(`\n❌ Player disconnected: ${socket.id}`);
    playerManager.removePlayer(socket.id);
    io.emit('playerDisconnected', { playerId: socket.id });
  });
});

// Game Tick Loop
setInterval(() => {
  const players = playerManager.getAllPlayers();
  io.emit('gameState', {
    players,
    timestamp: Date.now(),
  });
}, 1000 / 60); // 60 TPS

server.listen(PORT, () => {
  console.log(`\n🚀 MMO RPG Server running on port ${PORT}`);
  console.log(`📡 WebSocket ready for connections`);
  console.log(`🌍 World dimensions: 1000x1000`);
});

export { io, playerManager, worldManager, combatManager, itemManager };
