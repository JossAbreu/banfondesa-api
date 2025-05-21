// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo general de la API
  app.setGlobalPrefix('api');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Banfondesa API')
    .setDescription('Gestión de préstamos')
    .setVersion('1.0')
    .addBearerAuth() // Añade soporte para JWT en Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no definidas en DTOs
      forbidNonWhitelisted: true, // lanza error si se recibe una propiedad no permitida
      transform: true, // convierte tipos (por ejemplo string a number si aplica)
    }),
  );

  await app.listen(3000);
}
bootstrap();