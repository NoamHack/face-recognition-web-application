import { Module } from '@nestjs/common';
import { UserMongoController } from './user-mongo.controller';
import { UserMongoService } from './user-mongo.service';

@Module({
  controllers: [UserMongoController],
  providers: [UserMongoService],

})
export class UserMongoModule {}
