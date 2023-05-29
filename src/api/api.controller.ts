import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Delete,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ApiService } from './api.service';
import { QueryDto, CreateDto, UpdateDto, KageEditor } from './dto';

// TODO: 字体の処理を別のコントローラーに追加

@Controller('api/glyphs')
export default class GlyphsController {
  constructor(private apiService: ApiService) {}

  @Get('/')
  async getGlyphs(@Param() queryDto: { skip?: number; take?: number }) {
    return await this.apiService.findAll(queryDto);
  }

  @Get('/:name')
  async getGlyph(@Param('name') name: string) {
    const result = await this.apiService.findOne(name);
    if (!result) {
      return { message: `Glyph ${name} not found` };
    }
    return result;
  }

  @Post('/')
  async createGlyph(@Body() createDto: CreateDto) {
    const result = await this.apiService.create(createDto);
    return result;
  }

  @Patch('/:name')
  async updateGlyph(@Param('name') name: string, @Body() updateDto: UpdateDto) {
    return { message: updateDto };
  }

  @Delete('/:name')
  async deleteGlyph(@Param('name') name: string) {
    return { message: `Hello, ${name}!` };
  }
}

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}
}
