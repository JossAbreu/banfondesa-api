import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LoanModule } from '@loan/loan.module';
import { ClientsModule } from '@client/clients.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production',

      }),
    }),

    AuthModule,
    UserModule,
    ClientsModule,
    LoanModule,
  ],
})
export class AppModule {
  constructor(private config: ConfigService) {
    this.logDatabaseConfig();
  }

  private logDatabaseConfig() {
    console.log({
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT'),
      user: this.config.get('DB_USER'),
      password: this.config.get('DB_PASSWORD'),
      name: this.config.get('DB_NAME'),
    });
  }
}
