import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoliderMongoModule } from './user/solider-mongo.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ MongooseModule.forRoot('mongodb://localhost:27017'),SoliderMongoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
