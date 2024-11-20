import { Module } from '@nestjs/common';
import { SoliderMongoController } from './solider-mongo.controller';
import { SoliderMongoService } from './solider-mongo.service';

@Module({
  controllers: [SoliderMongoController],
  providers: [SoliderMongoService],

})
export class SoliderMongoModule {}
