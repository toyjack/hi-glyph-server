import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '.prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(email: string, password: string) {
    const hash = await argon2.hash(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        hash,
      },
    });

    return user;
  }
}
