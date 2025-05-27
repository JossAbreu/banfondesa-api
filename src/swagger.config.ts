// Configuración de Swagger
import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
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
      name: 'Authorization',
      in: 'header',
    },
    'access-token', // Este es el nombre del esquema (usado para referencias)

  )
  .build();
