// src/user/user.controller.ts
import { Controller, Post, Body, Put, UseGuards, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@UseGuards(JwtAuthGuard)
@Controller('v1.0/user')
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(Number(id), dto);
    }
}
