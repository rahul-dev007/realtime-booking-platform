// server/index.js

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const mongoose = require('mongoose'); // <-- নতুন
require('dotenv').config(); // <-- নতুন

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};
connectDB(); // <-- ডাটাবেস কানেক্ট করো
// -------------------------

const app = express();
app.use(cors());
// Body Parser Middleware
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('send_message', (data) => {
    console.log("Message received:", data);
    io.emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ SERVER IS RUNNING ON PORT ${PORT}`);
});