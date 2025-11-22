import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";


@WebSocketGateway() 
export class MyWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect 
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) { 
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, data: { roomId: string }) {
    client.join(data.roomId);
    console.log(`Client ${client.id} joined room: ${data.roomId}`);
  }
  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: any): Promise<void> {
    const messageToBroadcast = {
      body: payload.body,
      fromId: payload.fromId,
      createdAt: new Date().toISOString(),
    };
    this.server.to(payload.chatId).emit('message', messageToBroadcast);
  }
}