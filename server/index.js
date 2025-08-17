// server/index.js

// Core Dependencies
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// --- 1. Initialize App ---
const app = express();
const server = http.createServer(app);

// --- 2. Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};
connectDB();

// --- 3. Middlewares ---
// Enable CORS for all routes
app.use(cors());
// Body Parser Middleware to accept JSON
app.use(express.json());

// --- 4. API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
// ভবিষ্যতে আরও রুট এখানে যোগ হবে

// Health check endpoint (good practice)
app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- 5. Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    console.log(`💬 Message received from ${socket.id}:`, data);
    // Broadcast to all clients
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// --- 6. Start Server ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 SERVER IS RUNNING ON PORT ${PORT}`);
});