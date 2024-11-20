import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserMongoService } from './user-mongo.service';

@Controller('user')
export class UserMongoController {
  constructor(private readonly userService: UserMongoService) {}

  @Post()
  async createUser(@Body() createUserDto: UserDto) {
    return this.userService.createUser(createUserDto);
  }
}
