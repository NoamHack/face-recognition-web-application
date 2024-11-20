import { Body, Controller, Post, Res } from '@nestjs/common';
import process from 'node:process';
import { UserDto } from './dto/user.dto';
import axios from 'axios';

@Controller('user-gateway')
export class UserGatewayController {
  private userMicroserviceUrl = process.env.USER_USER_MICROSERVICE_URL;
  private mongoMicroserviceUrl = process.env.USER_MONGO_MICROSERVICE_URL;

  @Post()
  async createUser(@Body() createUserDto: UserDto, @Res() response: any) {
    try {
      const { data } = (
        await axios.post(`${this.userMicroserviceUrl}`, createUserDto, {
          withCredentials: true,
        })
      ).data;

      response.json({ message: 'User created successfully', data });
    } catch (err) {
      response
        .status(err.response?.status || 500)
        .json({ message: 'Failed to create user', error: err.message });
    }
  }
}
