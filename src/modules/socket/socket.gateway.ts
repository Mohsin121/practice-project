import { 
  SubscribeMessage,      // Decorator for handling events
  WebSocketGateway,      // Decorator to make this a socket gateway
  WebSocketServer,       // Decorator to inject server instance
  OnGatewayConnection,   // Interface (contract) for connection
  OnGatewayDisconnect,   // Interface (contract) for disconnect
  OnGatewayInit          // Interface (contract) for initialization
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketService } from './socket.service';
import type { AuthenticatedSocket } from './types/socket.types';
import { SOCKET_EVENTS } from './constants/socket-events';

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(SocketGateway.name);

  constructor(private readonly socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.setServer(server);
  }

  handleConnection(client: AuthenticatedSocket) {
    this.socketService.registerClient(client);
    
    // Notify client about successful connection
    client.emit('connected', {
      socketId: client.id,
      userId: client.userId,
      timestamp: new Date(),
    });
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`🔴 Client disconnected: ${client.id} (User: ${client.userId})`);
    this.socketService.removeClient(client.id);
  }

  @SubscribeMessage(SOCKET_EVENTS.PING)
  handlePing(client: AuthenticatedSocket, payload: any) {
    this.logger.debug(`Ping from ${client.userId}: ${payload}`);
    return { event: SOCKET_EVENTS.PONG, data: 'Pong!' };
  }

  @SubscribeMessage(SOCKET_EVENTS.JOIN_ROOM)
  handleJoinRoom(client: AuthenticatedSocket, payload: { room: string }) {
    try {
      this.socketService.joinRoom(client.id, payload.room);
      this.logger.log(`User ${client.userId} joined room: ${payload.room}`);
      
      // Notify room members
      client.to(payload.room).emit(SOCKET_EVENTS.USER_JOINED, {
        userId: client.userId,
        room: payload.room,
        timestamp: new Date(),
      });

      return { status: 'success', room: payload.room };
    } catch (error) {
      this.logger.error('Error joining room:', error.message);
      return { status: 'error', message: error.message };
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.LEAVE_ROOM)
  handleLeaveRoom(client: AuthenticatedSocket, payload: { room: string }) {
    try {
      this.socketService.leaveRoom(client.id, payload.room);
      this.logger.log(`User ${client.userId} left room: ${payload.room}`);
      
      // Notify room members
      client.to(payload.room).emit(SOCKET_EVENTS.USER_LEFT, {
        userId: client.userId,
        room: payload.room,
        timestamp: new Date(),
      });

      return { status: 'success', room: payload.room };
    } catch (error) {
      this.logger.error('Error leaving room:', error.message);
      return { status: 'error', message: error.message };
    }
  }
}
