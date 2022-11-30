import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { User } from '.prisma/client';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOne(username);

    if (!user) {
      return null;
    }

    if (await argon2.verify(user.hash, password)) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      username: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
