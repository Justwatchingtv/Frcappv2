
import { WebSocket, WebSocketServer } from 'ws';
import type { Server } from 'http';
import { db } from '@db';
import { posts } from '@db/schema';

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', async (data: string) => {
      try {
        const message = JSON.parse(data);
        
        // Save message to database
        const [post] = await db
          .insert(posts)
          .values({
            userId: message.userId,
            content: message.content,
            ticker: message.ticker || null,
          })
          .returning();

        // Broadcast message to all clients
        const broadcastMessage = JSON.stringify({
          type: 'message',
          data: post,
        });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(broadcastMessage);
          }
        });
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({ error: 'Failed to process message' }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}
