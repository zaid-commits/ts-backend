import { Server, Socket } from 'socket.io';
import { ChatMessage, User } from './types';

const users: Map<string, User> = new Map();

export function setupSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    const username = socket.handshake.query.username as string;

    if (userId && username) {
      users.set(socket.id, { id: userId, username });
      console.log(`User connected: ${username} (${userId})`);
    }

    socket.on('chat message', (msg: ChatMessage) => {
      console.log('Message received:', msg);
      io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      const user = users.get(socket.id);
      if (user) {
        console.log(`User disconnected: ${user.username} (${user.id})`);
        users.delete(socket.id);
      }
    });
  });
}