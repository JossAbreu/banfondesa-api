import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UpdateUserService {


    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
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
}
