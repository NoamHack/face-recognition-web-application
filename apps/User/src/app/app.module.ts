import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserHandlerService } from './user/user-handler.service';

@Module({
  imports: [UserHandlerService],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
