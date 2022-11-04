import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  signupLocal(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('/login')
  loginLocal(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post('/logout')
  logout() {
    return this.authService.logout();
  }

  @Post('/refresh')
  refreshTokens() {
    this.authService.refreshTokens();
  }
}
