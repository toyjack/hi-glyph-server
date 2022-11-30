import { Body, Controller, Post } from '@nestjs/common';
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
  @Post('/register')
  signupLocal(@Body() dto: AuthDto) {
    // return this.authService.register(dto);
    return this.userService.create(dto.email, dto.password);
  }

  @Post('/login')
  loginLocal(@Body() dto: AuthDto) {
    // return this.authService.login(dto);
    return this.authService.validateUser(dto.email, dto.password);
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
