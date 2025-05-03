import { Module } from '@nestjs/common';
import { SoliderGatewayController } from './solider-gateway.controller';
import { VideoGateway } from '../realtime-video-handler/video.gateway';

@Module({
  controllers: [SoliderGatewayController],
  providers: [VideoGateway],
})
export class SoliderGatewayModule {}
