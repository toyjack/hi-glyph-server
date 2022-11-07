import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hi-Glyph API')
    .setDescription('The Hi-Glyph API description')
    .setVersion('1.0')
    .addTag('Hi-Glyph')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocument);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); //whitelist dtoにないものを全部除外する
  await app.listen(4001);
}
bootstrap();
