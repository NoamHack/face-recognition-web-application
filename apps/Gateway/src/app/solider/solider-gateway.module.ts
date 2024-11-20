import { Module } from '@nestjs/common';
import { SoliderGatewayController } from './solider-gateway.controller';

@Module({
  controllers: [SoliderGatewayController],
})
export class SoliderGatewayModule {}
