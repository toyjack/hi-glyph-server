import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ApiModule, AuthModule, PrismaModule],
  providers: [PrismaService, AuthService],
})
export class AppModule {}
