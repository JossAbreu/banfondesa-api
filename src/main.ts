

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { configV1 } from '@/swagger/swagger.config.v1';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1.0',
  });


  // Generación del documento Swagger
  const document = SwaggerModule.createDocument(app, configV1);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });




  // Configuración de la validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );



  await app.listen(process.env.PORT || 3000);
}
bootstrap();