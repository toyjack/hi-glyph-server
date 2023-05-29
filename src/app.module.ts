import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiModule } from './api/api.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ImagesController } from './image/image.controller';
import { ImagesService } from './image/image.service';
import { ImagesModule } from './image/image.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ApiModule,
    AuthModule,
    HttpModule,
    PrismaModule,
    JwtModule,
    ImagesModule,
    UserModule,
  ],
  providers: [PrismaService, AuthService, ImagesService],
  controllers: [ImagesController],
})
export class AppModule {}
