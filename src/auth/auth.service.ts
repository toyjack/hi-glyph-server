import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { User } from '.prisma/client';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);

    if (!user) {
      return {
        msg: 'User not found',
      };
    }

    if (await argon2.verify(user.hash, password)) {
      return user;
    }

    return {
      msg: 'Invalid password',
    };
  }
  //

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async register(dto: AuthDto) {
    const hash = await this.hashData(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });
    delete newUser.hash;
    return newUser;
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.hash);

    if (!passwordMatches) {
      throw new ForbiddenException('Invalid credentials');
    }

    delete user.hash;

    return user;
  }
  logout() {}
  refreshTokens() {}
}
