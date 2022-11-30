import { Injectable, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { map, catchError, lastValueFrom } from 'rxjs';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

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
    private configService: ConfigService,
  ) {}

  async getPng(name: string) {
    const filePath = path.join(
      process.cwd(),
      'storage',
      'images',
      'png',
      name + '.png',
    );
    // look for the file in the cache
    let pngBuffer = null;
    if (await this.ifFileExists(filePath)) {
      try {
        pngBuffer = await fs.readFile(filePath);
        return pngBuffer;
      } catch (error) {
        console.log(error);
      }
    } else {
      // if not found, generate the file
      const svg = await this.getSvg(name);
      const pngBuffer = await this.svgToPng(svg, '#ffffff', 200);
      // then save it to the cache
      await this.saveFile(filePath, pngBuffer);
      return pngBuffer;
    }
  }

  async ifFileExists(filePath: string) {
    return !!(await fs.stat(filePath).catch(() => false));
  }

  async saveFile(filePath: string, buffer: Buffer) {
    let fileHandle = null;
    try {
      fileHandle = await fs.open(filePath, 'w');
      await fileHandle.writeFile(buffer);
    } finally {
      await fileHandle?.close();
    }
  }

  async getSvg(name: string) {
    const filePath = path.join(
      process.cwd(),
      'storage',
      'images',
      'svg',
      name + '.svg',
    );
    // look for the file in the cache
    if (await this.ifFileExists(filePath)) {
      //
      console.log('svg exitst');
      try {
        const svg = await fs.readFile(filePath);
        return svg.toString('utf-8');
      } catch (error) {
        console.log(error);
      }
    } else {
      const polygons = (await this.getPolygons(name)) || [];
      const target = polygons.shift(); // remove the first polygon
      const body = { target, polygons };
      const kageServerUrl = this.configService.get('KAGE_SERVER');
      const source = this.httpService.post(kageServerUrl, body).pipe(
        catchError(() => {
          throw new ForbiddenException('API not available');
        }),
        map((res) => res.data),
      );
      const svgHeader = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
  "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
`;
      const svg = svgHeader + (await lastValueFrom(source));
      await this.saveFile(filePath, Buffer.from(svg, 'utf8'));
      return svg;
    }
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
    } else return null;
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
