import { Module } from '@nestjs/common';
import { UserHandlerController } from './user-handler.controller';
import { UserHandlerService } from './user-handler.service';

@Module({
  imports: [],
  providers: [UserHandlerService],
  controllers: [UserHandlerController],
  exports: [UserHandlerService],
})
export class UserHandlerModule {}
