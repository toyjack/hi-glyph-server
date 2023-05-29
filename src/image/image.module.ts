import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ImagesController } from './image.controller';
import { ImagesService } from './image.service';

@Module({
  imports: [HttpModule],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
