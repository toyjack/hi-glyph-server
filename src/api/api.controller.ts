import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiService } from './api.service';
import { QueryDto } from './dto';
@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}

  @Get('/glyph/:name')
  getGlyph(@Param('name') name: string) {
    return this.apiService.getGlyph(name);
  }

  @Get('/glyphs')
  async getGlyphsByQuery(@Query() query: QueryDto) {
    // return query;
    return await this.apiService.getGlyphsByQuery(query);
  }
}
