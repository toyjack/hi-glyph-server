import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ApiService } from './api.service';
import { QueryDto } from './dto';

@ApiTags('Show Glyph')
@Controller('api/glyph')
export class GlyphController {
  constructor(private apiService: ApiService) {}

  @Get('/dkw/:dkw_num')
  @ApiParam({
    name: 'dkw_num',
    type: 'string',
    description: '大漢和辞書番号',
    required: true,
    example: '00001',
  })
  asyncGetDkwGlyph(@Param('dkw_num') dkw_num: string) {
    return this.apiService.getDkwGlyph(dkw_num);
  }

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
