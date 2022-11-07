import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ApiService } from './api.service';
import { QueryDto } from './dto';
@ApiTags('Hi-Glyph')
@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Get('/glyph/:name')
  @ApiParam({
    name: 'name',
    required: true,
    description: 'glyph name',
    type: String,
    example: 'u4e00',
  })
  getGlyph(@Param('name') name: string) {
    return this.apiService.getGlyph(name);
  }

  @Get('/glyphs')
  async getGlyphsByQuery(@Query() query: QueryDto) {
    // return query;
    return await this.apiService.getGlyphsByQuery(query);
  }
}
