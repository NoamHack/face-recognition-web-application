import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import * as process from 'node:process';
import { UserHandlerService } from './user-handler.service';

@Controller('user')
export class UserHandlerController {
  constructor(private readonly userService: UserHandlerService) {}
  private mongoMicroserviceUrl = process.env.USER_MONGO_MICROSERVICE_URL;

  @Post()
  async createUser(@Body() createUserDto: UserDto) {
    try {
      const data = await this.userService.create(createUserDto);

      return { message: 'User created successfully', data };
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // login(@Request() req): any {
  //   return { User: req.user, msg: 'User logged in' };
  // }
  //
  // @UseGuards(AuthenticatedGuard)
  // @Get('/protected')
  // getHello(@Request() req): string {
  //   return req.user;
  // }
  //
  // @Get('/department/:departmentNumber')
  // async getUsersByDepartment(
  //   @Param('departmentNumber') departmentNumber: string,
  //   @Res() response: any
  // ) {
  //   const users = await axios.get(
  //     `${this.mongoMicroserviceUrl}/department/${departmentNumber}`
  //   );
  //
  //   const usersData = users.data.map((user) => ({
  //     userName: user.userName,
  //     userEmail: user.userEmail,
  //     departmentNumber: user.departmentNumber,
  //   }));
  //
  //   return response.status(200).json({
  //     message: 'success',
  //     data: usersData,
  //   });
  // }
  //
  // @Get('/logout')
  // logout(@Request() req): any {
  //   req.session.destroy();
  //   return { message: 'User logged out' };
  // }
}
