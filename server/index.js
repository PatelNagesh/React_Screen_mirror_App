import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(cors());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

const activeRooms = new Map();

io.on('connection', socket => {
  console.log(`Socket connected ${socket.id}`);

  socket.on('join-session', ({ sessionId, role }) => {
    if (!sessionId) {
      return;
    }
    socket.join(sessionId);
    socket.data.role = role;
    const peers = activeRooms.get(sessionId) ?? new Set();
    peers.add(socket.id);
    activeRooms.set(sessionId, peers);

    socket.to(sessionId).emit('peer-joined', {
      socketId: socket.id,
      role,
    });
  });

  socket.on('signal', payload => {
    const { sessionId } = payload;
    if (!sessionId) {
      return;
    }
    socket.to(sessionId).emit('signal', payload);
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach(roomId => {
      if (roomId === socket.id) {
        return;
      }
      socket.to(roomId).emit('peer-left', { socketId: socket.id });
      const peers = activeRooms.get(roomId);
      if (peers) {
        peers.delete(socket.id);
        if (peers.size === 0) {
          activeRooms.delete(roomId);
        }
      }
    });
  });
});

const PORT = process.env.PORT ?? 4000;
httpServer.listen(PORT, () => {
  console.log(`Signaling server listening on port ${PORT}`);
});

