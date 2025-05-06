import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import * as process from 'node:process';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class VideoGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected');
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected');
  }

  @SubscribeMessage('frame')
  handleFrame(client: any, frameBase64: string) {
    this.server.emit('frame', frameBase64);
  }

  @SubscribeMessage('prediction_result')
  handlePrediction(client: any, predictionData: any) {
    console.log('Received prediction:', predictionData);
    this.server.emit('prediction_result', predictionData);
  }

  @SubscribeMessage('start_video')
  handleStartVideo(client: any) {
    console.log('Starting video transmission');
    this.server.emit('start_video');
  }

  @SubscribeMessage('stop_video')
  handleStopVideo(client: any) {
    console.log('Stopping video transmission');
    this.server.emit('stop_video');
  }
}
