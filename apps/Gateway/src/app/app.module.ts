import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeVideoHandlerModule } from './realtime-video-handler/realtime-video-handler.module';
import { SoliderGatewayModule } from './solider/solider-gateway.module';

@Module({
  imports: [RealtimeVideoHandlerModule, SoliderGatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
