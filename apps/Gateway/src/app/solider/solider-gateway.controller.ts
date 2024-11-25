import { Body, Controller, Post, Res } from '@nestjs/common';
import process from 'node:process';
import axios from 'axios';
import { SoliderDto } from './dto/solider.dto';

@Controller('solider')
export class SoliderGatewayController {
  private mongoMicroserviceUrl = process.env.USER_MONGO_MICROSERVICE_URL;

  @Post()
  async createSolider(@Body() soliderDto: SoliderDto, @Res() response: any) {
    try {
      const { data } = (
        await axios.post(`${this.mongoMicroserviceUrl}/solider`, soliderDto, {
          withCredentials: true,
        })
      ).data;

      response.json({ message: 'Solider created successfully', data });
    } catch (err) {
      response
        .status(err.response?.status || 500)
        .json({ message: 'Failed to create solider', error: err.message });
    }
  }
}
