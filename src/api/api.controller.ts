import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ApiService } from './api.service';
import { QueryDto } from './dto';

interface Kage {
  name: string;
  related?: string;
  data: string;
}

@ApiTags('Show Glyph')
@Controller('api/glyph')
export class GlyphController {
  constructor(private apiService: ApiService) {}

  @Get('/:glyphName')
  @ApiParam({
    name: 'glyphName',
    required: true,
    description: 'GlyphWikiで登録されている字形名',
    type: String,
    example: 'u4e00',
  })
  async getGlyph(@Param('glyphName') name: string) {
    return await this.apiService.getGlyph(name);
  }

  @Get('/:name/svg')
  @ApiParam({
    name: 'glyphName',
    required: true,
    description: 'GlyphWikiで登録されている字形名',
    type: String,
    example: 'u4e00',
  })
  async getSvg(@Param('name') name: string) {
    const polygons = (await this.apiService.getPolygons(name)) || [];
    const target = polygons.shift(); // remove the first polygon
    const body = { target, polygons };

    return this.apiService.getGlyphSvg(body);
  }
}
@ApiTags('Search Glyph')
@Controller('api/glyphs')
export class GlyphSearchController {
  constructor(private apiService: ApiService) {}
  @Get('/')
  async getGlyphsByQuery(@Query() query: QueryDto) {
    // return query;
    return await this.apiService.getGlyphsByQuery(query);
  }
}

@Controller('api')
export class ApiController {
  constructor(private apiService: ApiService) {}
}
