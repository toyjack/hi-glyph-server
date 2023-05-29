import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import GlyphsController, { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [HttpModule],
  controllers: [ApiController, GlyphsController],
  providers: [ApiService],
})
export class ApiModule {}
