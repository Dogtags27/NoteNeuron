import dotenv from 'dotenv';

dotenv.config();

connectDB();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import connectDB from './src/config/db.js';

// Connect to DB
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Attach socket.io to the server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Handle socket events
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('join-sheet', (sheetId) => {
    socket.join(sheetId);
    console.log(`User joined sheet room: ${sheetId}`);
  });

  socket.on('sheet-update', ({ sheetId, data }) => {
    socket.to(sheetId).emit('receive-update', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
