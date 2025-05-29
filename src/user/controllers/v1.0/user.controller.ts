// src/user/user.controller.ts
import { Controller, Post, Body, Put, UseGuards, Param, Get } from '@nestjs/common';
import { UserServiceV1 } from '@/user/services//v1.0/user.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { CreateUserDto } from '@/user/dto/v1.0/create-user.dto';
import { UpdateUserDto } from '@/user/dto/v1.0/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DocCreateUser, DocUpdateUser, DocFindAllUsers } from "@/user/docs/v1.0/user.docs"


@ApiTags('Usuarios 👥')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'user', version: '1.0' })
export class UserControllerV1 {
    constructor(private readonly userServiceV1: UserServiceV1) { }


    @Get()
    @DocFindAllUsers()
    findAll() {
        return this.userServiceV1.findAll();
    }

    @Post()
    @DocCreateUser()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userServiceV1.create(createUserDto);
    }

    @Put(':id')
    @DocUpdateUser()
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userServiceV1.update(Number(id), dto);
    }
}
