
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LoanModule } from '@loan/loan.module';
import { ClientsModule } from '@client/clients.module';
import { ConfigModule } from '@nestjs/config';
import { env } from 'process';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: env.NODE_ENV !== 'production', // No usar synchronize en producción
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    AuthModule,
    UserModule,
    ClientsModule,
    LoanModule,

  ],

})
export class AppModule {

  //lanzar console.log con la configuración de la base de datos
  constructor() {
    this.logDatabaseConfig();
  }

  private logDatabaseConfig() {
    console.log({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    });
  }
}