import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class VideoGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    server.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('message', (data: string) => {
        // Receive and parse the JSON data
        const frameData = JSON.parse(data);
        // Broadcast the frame to web clients
        this.server.emit('video_frame', frameData);
      });
    });
  }
}
