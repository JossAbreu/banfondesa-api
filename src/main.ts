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
    .setTitle('BANFONDESA API 📚')
    .setDescription(`Desarrollar e implementar una API REST utilizando NestJS, asegurando autenticación con JWT,
     documentación con Swagger y almacenamiento en una base de datos PostgreSQL. BY: Josue abreu de la rosa`)
    .setContact('Banfondesa', 'https://banfondesa.com.do', 'info@banfondesa.com.do')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer <access_token>"',

      })

    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();