import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  PayloadTooLargeException,
  UnauthorizedException,
} from '@nestjs/common';

import { compareSync } from 'bcryptjs';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ITokenPayload from './interfaces/token-payload.interface';
import { serialize } from 'cookie';
import RequestWithUser from './interfaces/request-with-user.interface';
import { LoginResponse } from './response/login.response';
import { AccessTokenResponse } from './response/access-token.response';
import { UserResponse } from 'src/user/response/user.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.userService.findUserByEmail(email);

    if (!user)
      throw new HttpException(
        'User with such email was not found',
        HttpStatus.NOT_FOUND,
      );

    const isCorrectPassword = compareSync(password, user.password);
    if (!isCorrectPassword)
      throw new HttpException('Wrong password', HttpStatus.UNAUTHORIZED);

    if (user.isBlocked) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    return {
      email: user.email,
      role: user.role,
      username: user.username,
      playlists: user.playlists,
      subscriptions: user.subscriptions,
    };
  }

  async registration(dto: CreateUserDto) {
    return await this.userService.addUser(dto);
  }

  async login(req: RequestWithUser): Promise<LoginResponse> {
    const payload: ITokenPayload = { email: req.user.email };
    const accessToken = this.getAccessToken(payload);
    return {
      accessToken,
      user: req.user,
    };
  }

  private getAccessToken(payload: ITokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }
}
