import { Injectable, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { map, catchError, lastValueFrom } from 'rxjs';
import * as sharp from 'sharp';
import { open } from 'fs/promises';
import { join } from 'path';

interface Kage {
  name: string;
  related?: string;
  data: string;
}

@Injectable()
export class ImagesService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async getPng(name: string) {
    const svg = await this.getSvg(name);
    const pngBuffer = await this.svgToPng(svg, '#ffffff', 200);
    // console.log(process.cwd());
    const filePath = join(
      process.cwd(),
      'storage',
      'images',
      'png',
      name + '.png',
    );

    await this.saveFile(filePath, pngBuffer);

    return pngBuffer;
  }

  async saveFile(filePath: string, buffer: Buffer) {
    let fileHandle = null;
    try {
      fileHandle = await open(filePath, 'w');
      await fileHandle.writeFile(buffer);
    } finally {
      await fileHandle?.close();
    }
  }

  async getSvg(name: string) {
    const polygons = (await this.getPolygons(name)) || [];
    const target = polygons.shift(); // remove the first polygon
    const body = { target, polygons };

    const source = this.httpService
      .post('http://localhost:4000/api/gen', body)
      // .post('http://kage.lab.hi.u-tokyo.ac.jp/api/gen', body)
      .pipe(
        catchError(() => {
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
}
