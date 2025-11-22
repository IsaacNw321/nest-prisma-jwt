import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private readonly app: INestApplicationContext,
    private readonly frontendUrl: string, 
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: { 
        origin: this.frontendUrl, 
        methods: ['GET', 'POST', 'PATCH', 'UPDATE', 'DELETE'],
        credentials: true,
      },
    });
    return server;
  }
}