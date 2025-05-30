import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { CreateUserDto } from '@/user/dto/v1.0/create-user.dto'
import { UserResponseDto } from '@/user/dto/v1.0/user-response.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';


@Injectable()
export class CrearUserService {


    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
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
        const savedUser = await this.userRepo.save(user);


        return {
            message: 'Usuario creado exitosamente',
            user: {
                id: savedUser.id,
                username: savedUser.username,
                status: savedUser.status,
            },
        };
    }
}
