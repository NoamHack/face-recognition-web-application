import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeVideoHandlerModule } from './realtime-video-handler/realtime-video-handler.module';
import { UserGatewayModule } from './user/user-gateway.module';

@Module({
  imports: [RealtimeVideoHandlerModule, UserGatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
