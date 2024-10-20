import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './realtime-video-handler/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
