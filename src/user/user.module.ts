// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserServiceV1 } from './services/v1.0/user.service';
import { UserControllerV1 } from './controllers/v1.0/user.controller';
import { UpdateUserService } from '@/user/services/v1.0/update-user.service';
import { CrearUserService } from '@/user/services/v1.0/crear-user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserControllerV1],
    providers: [UserServiceV1, UpdateUserService, CrearUserService],
    exports: [UserServiceV1, TypeOrmModule],
})
export class UserModule { }
