import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import systemRoutes from './routes/systemRoutes.js';
import { getSystemStats, startMonitoring } from './utils/systemMonitor.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
app.use(cors());
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});


// Routes
app.use('/api/system', systemRoutes(io));

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  const interval = setInterval(async () => {
    const stats = await getSystemStats();
    socket.emit('systemUpdate', stats);
  }, 2000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`MonitorX Backend running on http://localhost:${PORT}`);
  startMonitoring();
});