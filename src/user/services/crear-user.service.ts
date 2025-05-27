import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { CreateUserDto } from '@user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';



@Injectable()
export class CrearUserService {


    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.userRepo.findOne({
            where: { username: createUserDto.username },
        });
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
}
