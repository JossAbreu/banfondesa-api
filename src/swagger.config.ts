// Configuración de Swagger
import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('BANFONDESA API 📚',)

  .setDescription(`Desarrollar e implementar una API REST utilizando NestJS, asegurando autenticación con JWT,
 documentación con Swagger y almacenamiento en una base de datos PostgreSQL. BY: Josue abreu de la rosa 
 
 
  NOTA:Para probar los enpoints de la API, primero debes autenticarte y obtener un token JWT.
  Luego, puedes usar ese token en los headers de tus solicitudes a los endpoints protegidos.`)
  .setContact('Banfondesa', 'https://banfondesa.com.do', 'info@banfondesa.com.do')
  .setVersion('1.0')
  .addServer('http://localhost:3000', 'Development Server')
  .addServer('https://banfondesa-api-production.up.railway.app', 'Production Server')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access-token',


  )
  .build();
