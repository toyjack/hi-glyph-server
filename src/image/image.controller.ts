import { Controller, Get, Param, Res } from '@nestjs/common';
import { ImagesService } from './image.service';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get(':fileName')
  // @Header('Content-Type', 'image/png')
  // @Header('Content-Disposition', 'attachment; filename=test123.png')
  async getImage(@Param('fileName') fileName: string, @Res() res) {
    const fileNameSplited = fileName.split('.');
    if (fileNameSplited.length < 2) {
      return 'Invalid file name';
    }
    const ext = fileNameSplited.pop();
    const name = fileNameSplited.join('.');

    switch (ext) {
      case 'png':
        const pngBuffer = await this.imagesService.getPng(name);
        return res.set('Content-Type', 'image/png').send(pngBuffer);
      case 'svg':
        const svgBuffer = await this.imagesService.getSvg(name);
        return res.set('Content-Type', 'image/svg+xml').send(svgBuffer);
      default:
        return 'Invalid file name';
    }
  }
}
