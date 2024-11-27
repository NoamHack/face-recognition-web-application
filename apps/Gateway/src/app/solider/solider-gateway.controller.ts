import { Body, Controller, Post, Res } from '@nestjs/common';
import axios from 'axios';
import { SoliderDto } from './dto/solider.dto';
import { SoliderPicsDto } from './dto/solider-pics.dto';

@Controller('solider')
export class SoliderGatewayController {
  private mongoMicroserviceUrl = process.env.USER_MONGO_MICROSERVICE_URL;

  @Post()
  async createSolider(@Body() soliderDto: SoliderDto, @Res() response: any) {
    try {
      const { data } = await axios.post(
        `${this.mongoMicroserviceUrl}/solider`,
        soliderDto,
        {
          withCredentials: true,
        }
      );

      response.json({ message: 'Solider created successfully', data });
    } catch (err) {
      response
        .status(err.response?.status || 500)
        .json({ message: 'Failed to create solider', error: err.message });
    }
  }

  @Post('pics')
  async createSoliderPics(
    @Body() soliderPicsDto: SoliderPicsDto,
    @Res() response: any
  ) {
    try {
      const { data } = await axios.post(
        `${this.mongoMicroserviceUrl}/solider/pics`,
        soliderPicsDto,
        {
          withCredentials: true,
        }
      );

      response.json({ message: 'Solider Pics created successfully', data });
    } catch (err) {
      response
        .status(err.response?.status || 500)
        .json({ message: 'Failed to create solider pics', error: err.message });
    }
  }
}
