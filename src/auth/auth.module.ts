//src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthServiceV1 } from '@auth/services/v1.0/auth.service';
import { UserModule } from '@user/user.module';
import { UserBaseService } from '@user/services/user.base.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthControllerV1 } from '@auth/controllers/v1.0/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthServiceV1, UserBaseService, JwtStrategy],
  controllers: [AuthControllerV1],
})
export class AuthModule {

}
