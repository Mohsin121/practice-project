import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { Logger } from '@nestjs/common';

export class AuthenticatedSocketAdapter extends IoAdapter {
  private readonly logger = new Logger(AuthenticatedSocketAdapter.name);

  createIOServer(port: number, options?: ServerOptions) {
    const corsOptions = {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:5173',
        'null', // Allow file:// protocol for test client
      ],
      credentials: true,
    };

    const server = super.createIOServer(port, {
      ...options,
      cors: corsOptions,
    });

    server.use((socket: any, next) => {
      try {
        // Get token from auth or authorization header
        let token = socket.handshake.auth?.token;
        
        if (!token && socket.handshake.headers?.authorization) {
          token = socket.handshake.headers.authorization.replace('Bearer ', '');
        }

        if (!token) {
          this.logger.warn('Connection attempt without token');
          return next(new Error('Authentication token missing'));
        }

        // Verify JWT token
        const payload: any = jwt.verify(token, process.env.JWT_SECRET as string);
        
        // Attach user data directly to socket
        socket.userId = payload.sub;
        next();
      } catch (error) {
        this.logger.error('Socket authentication failed:', error.message);
        next(new Error('Invalid or expired token'));
      }
    });

    return server;
  }
}
