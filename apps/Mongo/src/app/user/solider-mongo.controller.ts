import { Body, Controller, Post } from '@nestjs/common';
import { SoliderMongoService } from './solider-mongo.service';
import { SoliderDto } from './dto/solider.dto';

@Controller('solider')
export class SoliderMongoController {
  constructor(private readonly soliderService: SoliderMongoService) {}

  @Post()
  async createSolider(@Body() soliderDto: SoliderDto) {
    return this.soliderService.createSolider(soliderDto);
  }
}
