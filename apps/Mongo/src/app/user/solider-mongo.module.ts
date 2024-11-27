import { Module } from '@nestjs/common';
import { SoliderMongoController } from './solider-mongo.controller';
import { SoliderMongoService } from './solider-mongo.service';
import { Solider, SoliderSchema } from './schema/solider.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SoliderPics, SoliderPicsSchema } from './schema/solider-pics.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Solider.name, schema: SoliderSchema },
      { name: SoliderPics.name, schema: SoliderPicsSchema },
    ]),
  ],
  controllers: [SoliderMongoController],
  providers: [SoliderMongoService],
})
export class SoliderMongoModule {}
