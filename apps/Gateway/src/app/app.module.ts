import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RealtimeVideoHandlerModule } from './realtime-video-handler/realtime-video-handler.module';

@Module({
  imports: [RealtimeVideoHandlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
