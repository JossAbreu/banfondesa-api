
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { User } from '@user/entities/user.entity';
import { CrearUserService } from '@user/services/crear-user.service';
import { UpdateUserService } from '@user/services/update-user.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private crearUserRepo: CrearUserService,
        private updateUserRepo: UpdateUserService,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        return this.crearUserRepo.create(createUserDto);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        return this.updateUserRepo.updateUser(id, updateUserDto);

    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { username } });
    }

    async findAll(): Promise<{ message: string; users: { username: string; status: boolean }[] }> {

        const users = await this.userRepo.find();

        // Transformamos los usuarios para excluir el password
        const usersTransformed = users.map(user => ({
            username: user.username,
            status: user.status,
        }));

        return { message: 'Lista de usuarios registrados', users: usersTransformed };
    }
}
