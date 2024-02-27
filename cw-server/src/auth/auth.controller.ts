import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthDto } from './dto/user-registration.dto';
import { AuthService } from './auth.service';
import RequestWithUser from './interfaces/request-with-user.interface';
import { LoginResponse } from './response/login.response';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return await this.authService.registration(dto);
  }
  @UseGuards(LocalAuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.ACCEPTED)
  @Post('login')
  async login(@Req() req: RequestWithUser): Promise<LoginResponse> {
    return this.authService.login(req);
  }
}
