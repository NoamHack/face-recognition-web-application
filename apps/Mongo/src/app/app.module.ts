import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoliderMongoModule } from './user/solider-mongo.module';

@Module({
  imports: [SoliderMongoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
