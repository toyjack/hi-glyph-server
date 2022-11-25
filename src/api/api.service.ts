import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { map, catchError, lastValueFrom } from 'rxjs';
import * as sharp from 'sharp';

import { CreateDto, QueryDto, UpdateDto } from './dto';
import { HttpService } from '@nestjs/axios';

interface Kage {
  name: string;
  related?: string;
  data: string;
}

@Injectable()
export class ApiService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async createGlyph(dto: CreateDto) {
    const glyphInDb = await this.prisma.glyphwiki.findUnique({
      where: {
        name: dto.name,
      },
    });
    if (glyphInDb) {
      return { message: 'glyph already exists' };
    }

    if (!dto.related) dto.related = '〓';
    const glyph = await this.prisma.glyphwiki.create({
      data: dto,
    });
    return glyph;
  }

  async updateGlyph(name: string, dto: UpdateDto) {
    const glyphInDb = await this.prisma.glyphwiki.findUnique({
      where: {
        name,
      },
    });
    if (!glyphInDb) {
      return { message: 'glyph not found' };
    }

    const updatedGlyph = await this.prisma.glyphwiki.update({
      where: {
        name,
      },
      data: dto,
    });

    return updatedGlyph;
  }

  async deleteGlyph(name: string) {
    const glyphInDb = await this.prisma.glyphwiki.findUnique({
      where: {
        name,
      },
    });
    if (!glyphInDb) {
      return { message: 'glyph does not exist' };
    }

    const glyph = await this.prisma.glyphwiki.delete({
      where: {
        name,
      },
    });
    return glyph;
  }

  async svgToPng(svg: string, bg = '#ffffff', size = 200) {
    const svgBuffer = Buffer.from(svg, 'utf8');
    // const metadata = await sharp(svgBuffer).metadata();
    // console.log(metadata);
    const pngBuffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .flatten({ background: bg }) // add background
      .toBuffer();

    return pngBuffer;
  }

  async getPngGlyph(name: string) {
    const polygons = (await this.getPolygons(name)) || [];
    const target = polygons.shift(); // remove the first polygon
    const body = { target, polygons };

    const svg = await this.getGlyphSvg(body);
    const pngBuffer = await this.svgToPng(svg, '#ffffff', 200);
    return pngBuffer;
  }

  async getGlyph(name: string) {
    const glyph = await this.prisma.glyphwiki.findUnique({
      where: {
        name,
      },
      select: {
        name: true,
        related: true,
        data: true,
      },
    });

    if (glyph) {
      return glyph;
    } else {
      return {};
    }
  }

  async getGlyphSvg(data) {
    const source = this.httpService
      .post('http://localhost:4000/api/gen', data)
      // .post('http://kage.lab.hi.u-tokyo.ac.jp/api/gen', data)
      .pipe(
        catchError((err) => {
          throw new ForbiddenException('API not available');
        }),
        map((res) => {
          return res.data;
        }),
      );

    return await lastValueFrom(source);
  }

  async getPolygons(name: string, results = []): Promise<Kage[]> {
    const glyph = await this.prisma.glyphwiki.findUnique({
      where: {
        name,
      },
      select: {
        name: true,
        related: true,
        data: true,
      },
    });

    if (glyph) {
      results.push({ name: glyph.name, data: glyph.data });
      const temp = glyph.data.split('$');

      for (const polygon of temp) {
        if (polygon.startsWith('99')) {
          const childName = polygon.split(':')[7];
          await this.getPolygons(childName, results);
        }
      }

      return results;
    }
  }

  async getGlyphsByQuery(query: QueryDto) {
    const skip = query.skip || 0;
    const take = query.take || 50;
    const userPrefix = query.user ? query.user + '_' : '';

    const glyphs = await this.prisma.glyphwiki.findMany({
      skip,
      take,
      where: {
        data: {
          contains: query.contains,
        },
        related: {
          contains: query.related,
        },
        name: {
          startsWith: userPrefix,
        },
      },
      select: {
        name: true,
        related: true,
        data: true,
      },
    });

    return {
      query,
      results: glyphs,
    };
  }
  async getDkwGlyph(dkw_num: string) {
    const dkwID = 'dkw-' + dkw_num;
    const glyph = await this.prisma.glyphwiki.findUnique({
      where: {
        name: dkwID,
      },
      select: {
        name: true,
        related: true,
        data: true,
      },
    });
    return { glyph };
  }
}
