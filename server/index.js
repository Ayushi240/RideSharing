require('dotenv').config(); // ← must be first line

const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');
const http      = require('http');
const WebSocket = require('ws');

const app    = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/rides',    require('./routes/rides'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/chat',     require('./routes/chat'));

// WebSocket — Live GPS Tracking
const wss   = new WebSocket.Server({ server });
const rooms = {};

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    try {
      const { type, rideId, lat, lng } = JSON.parse(raw);
      if (type === 'join-ride') {
        if (!rooms[rideId]) rooms[rideId] = new Set();
        rooms[rideId].add(ws);
        ws.rideId = rideId;
      }
      if (type === 'send-location' && rooms[rideId]) {
        rooms[rideId].forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify({ lat, lng }));
        });
      }
    } catch (e) { console.error('WS error:', e); }
  });
  ws.on('close', () => {
    if (ws.rideId && rooms[ws.rideId]) rooms[ws.rideId].delete(ws);
  });
});

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 ShareGo server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('❌ DB connection error:', err));