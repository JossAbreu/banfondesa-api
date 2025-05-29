
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';


@Injectable()
export class UserBaseService {
    constructor(
        @InjectRepository(User)
        protected userRepo: Repository<User>,

    ) { }


    async findByUsername(username: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { username } });
    }

    async findAll(): Promise<{ message: string; users: { username: string; status: boolean }[] }> {

        const users = await this.userRepo.find();

        // Transformamos los usuarios para excluir el password
        const usersTransformed = users.map(user => ({
            id: user.id,
            username: user.username,
            status: user.status,
        }));

        return { message: 'Lista de usuarios registrados', users: usersTransformed };
    }
}
