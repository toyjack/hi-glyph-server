import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
@ApiExcludeController()
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.userService.create(dto.email, dto.password);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  loginLocal(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }

  @Post('logout')
  logout() {
    // return this.authService.logout();
  }

  @Post('refresh')
  refreshTokens() {
    // this.authService.refreshTokens();
  }
}
