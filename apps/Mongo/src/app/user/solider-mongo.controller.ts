import { Body, Controller, Post } from '@nestjs/common';
import { SoliderMongoService } from './solider-mongo.service';
import { SoliderDto } from './dto/solider.dto';
import { SoliderPicsDto } from './dto/solider-pics.dto';

@Controller('solider')
export class SoliderMongoController {
  constructor(private readonly soliderService: SoliderMongoService) {}

  @Post()
  async createSolider(@Body() soliderDto: SoliderDto) {
    return this.soliderService.createSolider(soliderDto);
  }

  @Post('pics')
  async createSoliderPics(@Body() soliderPicsDto: SoliderPicsDto) {
    return this.soliderService.createSoliderPics(soliderPicsDto);
  }
}
