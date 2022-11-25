import {
  Controller,
  Get,
  Param,
  Query,
  Header,
  Post,
  Body,
  Delete,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ApiService } from './api.service';
import { QueryDto, CreateDto, UpdateDto } from './dto';

@ApiTags('Show Glyph')
@Controller('api/glyph')
export class GlyphController {
  constructor(private apiService: ApiService) {}

  @Post('')
  async createGlyph(@Body() dto: CreateDto) {
    return this.apiService.createGlyph(dto);
  }

  @Patch(':glyphName')
  async updateGlyph(@Param('glyphName') name: string, @Body() dto: UpdateDto) {
    return await this.apiService.updateGlyph(name, dto);
  }

  @Delete('/:glyphName')
  async deleteGlyph(@Param('glyphName') name: string) {
    return await this.apiService.deleteGlyph(name);
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

  @Get(':glyphName/svg')
  @ApiParam({
    name: 'glyphName',
    required: true,
    description: 'GlyphWikiで登録されている字形名',
    type: String,
    example: 'u4e00',
  })
  async getSvg(@Param('glyphName') name: string) {
    const polygons = (await this.apiService.getPolygons(name)) || [];
    const target = polygons.shift(); // remove the first polygon
    const body = { target, polygons };

    return this.apiService.getGlyphSvg(body);
  }

  @Get(':glyphName.:ext')
  @Header('Content-Type', 'image/png')
  @Header('Content-Disposition', 'attachment; filename=test123.png')
  @ApiParam({
    name: 'glyphName',
    required: true,
    description: 'GlyphWikiで登録されている字形名',
    type: String,
    example: 'u4e00',
  })
  getPng(@Param() params) {
    // return this.apiService.getPngGlyph(name);
    console.log(params);
    return { params };
  }

  @Get('/dkw/:dkw_num')
  @ApiParam({
    name: 'dkw_num',
    type: 'string',
    description: '大漢和辞書番号でKage字形データを示す',
    required: true,
    example: '00001',
  })
  asyncGetDkwGlyph(@Param('dkw_num') dkw_num: string) {
    return this.apiService.getDkwGlyph(dkw_num);
  }

  @Get('/dkw/:dkw_num/svg')
  @ApiParam({
    name: 'dkw_num',
    type: 'string',
    description: '大漢和辞書番号でSVG字形画像を示す',
    required: true,
    example: '00001',
  })
  async GetDkwGlyphSvg(@Param('dkw_num') dkw_num: string) {
    const name = 'dkw-' + dkw_num;
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
