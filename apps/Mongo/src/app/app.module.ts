import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserMongoModule } from './user/user-mongo.module';

@Module({
  imports: [UserMongoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
