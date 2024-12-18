import { Server, Socket } from 'socket.io';
import ChatMessage from './models/ChatMessage';
import { ChatMessage as ChatMessageType, User } from './types';

const users: Map<string, User> = new Map();

export function setupSocketHandlers(io: Server): void {
  io.on('connection', async (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    const username = socket.handshake.query.username as string;

    if (userId && username) {
      users.set(socket.id, { id: userId, username });
      console.log(`User connected: ${username} (${userId})`);
    }

    // Send existing messages to the newly connected user
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    socket.emit('chat history', messages);

    socket.on('chat message', async (msg: ChatMessageType) => {
      console.log('Message received:', msg);

      // Save the message to the database
      const chatMessage = new ChatMessage({
        text: msg.text,
        userId: msg.userId,
        username: msg.username,
        timestamp: msg.timestamp
      });
      await chatMessage.save();

      io.emit('chat message', msg);
      io.emit('notification', {
        type: 'message',
        message: `${msg.username}: ${msg.text}`,
        timestamp: Date.now(),
      });
    });

    socket.on('project submission', (project) => {
      io.emit('notification', {
        type: 'project',
        message: `New project submitted: ${project.title}`,
        timestamp: Date.now(),
      });
    });

    socket.on('comment', (comment) => {
      io.emit('notification', {
        type: 'comment',
        message: `New comment: ${comment.text}`,
        timestamp: Date.now(),
      });
    });

    socket.on('rating', (rating) => {
      io.emit('notification', {
        type: 'rating',
        message: `New rating: ${rating.value} stars`,
        timestamp: Date.now(),
      });
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