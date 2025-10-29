import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { AuthenticatedSocket } from './types/socket.types';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  private server: Server;
  
  // Example: { "socket1": {userId: "user123"} }
  private clients = new Map<string, AuthenticatedSocket>(); 
  
  // Example: { "user123": ["socket1", "socket2"] }
  private userSockets = new Map<string, Set<string>>(); 

  setServer(server: Server) {
    this.server = server;
  }

  registerClient(client: AuthenticatedSocket) {
    // Store socket by socketId
    this.clients.set(client.id, client);

    // Track user's multiple connections (mobile + desktop)
    if (!this.userSockets.has(client.userId)) {
      this.userSockets.set(client.userId, new Set());
    }
    const userSocketSet = this.userSockets.get(client.userId);
    if (userSocketSet) {
      userSocketSet.add(client.id);
    }

    this.logger.debug(`🟢 User ${client.userId} connected with socket ${client.id}`);
  }

  removeClient(id: string) {
    const client = this.clients.get(id);
    
    if (client) {
      // Remove from user's socket set
      const userSocketIds = this.userSockets.get(client.userId);
      if (userSocketIds) {
        userSocketIds.delete(id);
        console.log('userSocketIds', userSocketIds);
        // Clean up if no more connections for this user
        if (userSocketIds.size === 0) {
          this.userSockets.delete(client.userId);
          this.logger.log(`User ${client.userId} is now offline`);
        }
      }
    }

    this.clients.delete(id);
    this.logger.debug(`Client removed: ${id}`);
  }

  // Room management
  joinRoom(socketId: string, room: string) {
    const socket = this.clients.get(socketId);
    if (socket) {
      socket.join(room);
      this.logger.debug(`Socket ${socketId} joined room ${room}`);
    }
  }

  leaveRoom(socketId: string, room: string) {
    const socket = this.clients.get(socketId);
    if (socket) {
      socket.leave(room);
      this.logger.debug(`Socket ${socketId} left room ${room}`);
    }
  }

  // Utility methods
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  getActiveUsersCount(): number {
    return this.userSockets.size;
  }

  getActiveConnectionsCount(): number {
    return this.clients.size;
  }

  getUserConnectionCount(userId: string): number {
    return this.userSockets.get(userId)?.size || 0;
  }
}
