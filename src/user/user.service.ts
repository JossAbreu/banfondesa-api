// src/user/user.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {


        const existingUser = await this.userRepo.findOne({
            where: { username: createUserDto.username },
        });

        // Verifica si el usuario ya existe
        if (existingUser) {
            throw new BadRequestException('Usuario ya existe');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepo.create({
            username: createUserDto.username,
            password: hashedPassword,
        });
        return this.userRepo.save(user);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        // Validar si se quiere actualizar el nombre de usuario a uno ya existente
        if (updateUserDto.username) {
            const existing = await this.userRepo.findOne({
                where: { username: updateUserDto.username },
            });


            // Si ya existe ese username y pertenece a otro usuario
            if (existing && existing.id !== user.id) {
                throw new BadRequestException('El nombre de usuario ya está en uso');
            }

            user.username = updateUserDto.username;
        }
        if (updateUserDto.status) {
            user.status = updateUserDto.status;
        }

        if (typeof updateUserDto.status === 'boolean') {
            user.status = updateUserDto.status;
        }

        return this.userRepo.save(user);
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { username } });
    }

    async findAll(): Promise<{ message: string; users: User[] }> {
        return { message: 'Lista de usuarios', users: await this.userRepo.find() };
    }
}
