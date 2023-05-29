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

@ApiTags('Show Glyph')
@Controller('api/glyph')
export class GlyphController {
  constructor(private apiService: ApiService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('submit_glyph')
  async submitGlyph(@Body() body: KageEditor) {
    return this.apiService.submitGlyph(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createGlyph(@Body() dto: CreateDto) {
    return this.apiService.createGlyph(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':glyphName')
  async updateGlyph(@Param('glyphName') name: string, @Body() dto: UpdateDto) {
    return await this.apiService.updateGlyph(name, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':glyphName')
  async deleteGlyph(@Param('glyphName') name: string) {
    return await this.apiService.deleteGlyph(name);
  }

  @Get(':glyphName')
  @ApiParam({
    name: 'glyphName',
    required: true,
    description: 'GlyphWikiで登録されている字形名',
    type: String,
    example: 'sandbox',
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
    example: 'sandbox',
  })
  async getSvg(@Param('glyphName') name: string) {
    const polygons = (await this.apiService.getPolygons(name)) || [];
    const target = polygons.shift(); // remove the first polygon
    const body = { target, polygons };

    return this.apiService.getGlyphSvg(body);
  }

  @Get(':glyphName/png')
  @ApiParam({
    name: 'glyphName',
    required: true,
    description: 'GlyphWikiで登録されている字形名',
    type: String,
    example: 'sandbox',
  })
  async getPng(@Param('glyphName') name: string, @Res() res) {
    res
      .set('Content-Type', 'image/png')
      .send(await this.apiService.getPngGlyph(name));
  }

  @Get('dkw/:dkw_num')
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

  @Get('dkw/:dkw_num/svg')
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
