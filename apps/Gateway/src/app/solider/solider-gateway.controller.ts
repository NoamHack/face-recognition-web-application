import { Body, Controller, Post, Res } from '@nestjs/common';
import axios from 'axios';
import { SoliderDto } from './dto/solider.dto';
import { SoliderPicsDto } from './dto/solider-pics.dto';
import { VideoGateway } from '../realtime-video-handler/video.gateway';
import { SubscribeMessage } from '@nestjs/websockets';

@Controller('solider')
export class SoliderGatewayController {
  private mongoMicroserviceUrl = process.env.USER_MONGO_MICROSERVICE_URL;

  constructor(private readonly videoGateway: VideoGateway) {}

  @SubscribeMessage('soldier_created')
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

      // Emit socket message when soldier is created
      this.videoGateway.server.emit('soldier_created', {
        message: 'New soldier created',
        data: data,
      });

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
