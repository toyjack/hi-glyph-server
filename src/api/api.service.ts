import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryDto } from './dto';

@Injectable()
export class ApiService {
  constructor(private prisma: PrismaService) {}

  getGlyph(name: string) {
    const glyph = this.prisma.glyphwiki.findUnique({
      where: {
        name,
      },
      select: {
        name: true,
        related: true,
        data: true,
      },
    });

    return glyph;
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
