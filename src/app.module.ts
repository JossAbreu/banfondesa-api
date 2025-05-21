// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
// importa aquí otros módulos como UserModule, LoanModule, etc.
import { UserModule } from './user/user.module'; // Asegúrate de importar el módulo de usuario
import { LoanModule } from '@loan/loan.module'; // Asegúrate de importar el módulo de usuario


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Developer646588.',
      database: 'bafondesaDB',
      autoLoadEntities: true, // automáticamente carga las entidades
      synchronize: true, // ¡solo en desarrollo! crea/modifica tablas
    }),
    AuthModule,
    UserModule,
    LoanModule,
  ],
})
export class AppModule { }
