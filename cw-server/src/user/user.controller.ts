import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  search(@Query('query') query: string) {
    return this.userService.searchUsers(query);
  }

  @Post()
  addUser(@Body() dto: CreateUserDto) {
    return this.userService.addUser(dto);
  }

  @Get(':userId')
  getById(@Param('userId') userId: ObjectId) {
    return this.userService.getById(userId);
  }

  @Get('/email/:email')
  getByEmail(@Param('email') email: string) {
    return this.userService.findUserByEmail(email);
  }

  @Patch('/block/:userId')
  blockUser(@Param('userId') userId: ObjectId) {
    return this.userService.blockUser(userId);
  }

  @Patch('/change/:email/:username/:password/:newPassword')
  changeUser(
    @Param('email') email: string,
    @Param('username') username: string,
    @Param('password') password: string,
    @Param('newPassword') newPassword: string,
  ) {
    return this.userService.changeUser(email, username, password, newPassword);
  }
}
