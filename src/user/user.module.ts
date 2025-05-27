// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UpdateUserService } from '@user/services/update-user.service';
import { CrearUserService } from '@user/services/crear-user.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService, UpdateUserService, CrearUserService],
    exports: [UserService, TypeOrmModule],
})
export class UserModule { }
