import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import {
  ApiController,
  GlyphController,
  GlyphSearchController,
} from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [HttpModule],
  controllers: [ApiController, GlyphController, GlyphSearchController],
  providers: [ApiService],
})
export class ApiModule {}
