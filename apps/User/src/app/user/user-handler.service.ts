import { Injectable, NotFoundException } from '@nestjs/common';
import { generateRandomString } from 'ts-randomstring/lib';
import { sha256 } from 'js-sha256';
import { UserDto } from './dto/user.dto';
import axios from 'axios';
import process from 'node:process';

@Injectable()
export class UserHandlerService {
  private mongoMicroserviceUrl = process.env.USER_MONGO_MICROSERVICE_URL;

  async create(userDto: UserDto): Promise<any> {
    userDto.userEmail = userDto.userEmail.toLowerCase();
    userDto.userSalt = generateRandomString({ length: 4 });
    userDto.userPassword = sha256(userDto.userPassword + userDto.userSalt);

    return (await axios.post(`${this.mongoMicroserviceUrl}`, userDto)).data;
  }
}
