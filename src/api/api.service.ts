import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { map, catchError } from 'rxjs';

import { QueryDto } from './dto';
import { HttpService } from '@nestjs/axios';

interface Kage {
  name: string;
  related?: string;
  data: string;
}

interface GenBody {
  target: Kage;
  polygons: Kage[];
}

@Injectable()
export class ApiService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

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

  getGlyphSvg(data) {
    return this.httpService
      .post('http://13.231.24.228/api/gen', data)
      .pipe(
        map((res) => {
          return res.data;
        }),
        // map((bpi) => bpi?.USD),
        // map((usd) => {
        //   return usd?.rate;
        // }),
      )
      .pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
      );
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
}
